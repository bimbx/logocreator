import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dedent from "dedent";
import { fal } from "@fal-ai/client";
import { z } from "zod";

interface FailedQueueStatus {
  status: string;
  error: string;
}

interface ImageWithBase64 {
  url?: string;
  base64?: string;
  content_type?: string;
}

let ratelimit: Ratelimit | undefined;

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new Response("", { status: 404 });
  }

  const json = await req.json();
  const data = z
    .object({
      style: z.string(),
      theme: z.string(),
      colorScheme: z.string(),
      mood: z.string(),
      additionalElements: z.string().optional(),
    })
    .parse(json);

  if (process.env.UPSTASH_REDIS_REST_URL) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.fixedWindow(3, "1 d"),
      analytics: true,
      prefix: "wallpaper",
    });
  }

  if (ratelimit) {
    const identifier = user.id;
    const { success, remaining } = await ratelimit.limit(identifier);
    (await clerkClient()).users.updateUserMetadata(user.id, {
      unsafeMetadata: {
        remaining,
      },
    });

    if (!success) {
      return new Response(
        "You've reached your wallpaper generation limit for today. Try again tomorrow.",
        {
          status: 429,
          headers: { "Content-Type": "text/plain" },
        },
      );
    }
  }

  const prompt = dedent`Create a stunning wallpaper with the following specifications:

Style: ${data.style}
Theme: ${data.theme}
Color Scheme: ${data.colorScheme}
Mood: ${data.mood}
${data.additionalElements ? `Additional Elements: ${data.additionalElements}` : ""}

Generate a high-resolution 1920x1080 wallpaper that's visually striking and suitable for desktop use.`;

  try {
    const { request_id } = await fal.queue.submit("fal-ai/flux/dev", {
      input: {
        prompt,
        image_size: "landscape_16_9",
        num_inference_steps: 30,
        guidance_scale: 7.5,
        enable_safety_checker: true,
      },
    });
    
    let result;
    let attempts = 0;
    const maxAttempts = 60;
    
    while (attempts < maxAttempts) {
      const status = await fal.queue.status("fal-ai/flux/dev", {
        requestId: request_id,
        logs: true,
      });
      
      if (status.status === "COMPLETED") {
        result = await fal.queue.result("fal-ai/flux/dev", {
          requestId: request_id
        });
        break;
      }
      
      if ((status.status as string) === "FAILED") {
        const failedStatus = status as unknown as FailedQueueStatus;
        throw new Error("Wallpaper generation failed: " + failedStatus.error);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }
    
    if (!result) {
      throw new Error("Timed out waiting for wallpaper generation");
    }
    
    if (result.data?.images?.[0]) {
      const image = result.data.images[0];
      
      if (image.url) {
        const imageResponse = await fetch(image.url);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
        }
        
        const contentType = image.content_type || imageResponse.headers.get("content-type") || "image/png";
        const arrayBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const dataUri = `data:${contentType};base64,${base64}`;
        
        return Response.json({ base64: dataUri }, { status: 200 });
      } 
      else if ((image as unknown as ImageWithBase64).base64) {
        const imageWithBase64 = image as unknown as ImageWithBase64;
        const contentType = image.content_type || "image/png";
        const dataUri = `data:${contentType};base64,${imageWithBase64.base64}`;
        
        return Response.json({ base64: dataUri }, { status: 200 });
      }
    }
    throw new Error("No image data in response");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response("Failed to generate wallpaper: " + errorMessage, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
export const runtime = "edge";