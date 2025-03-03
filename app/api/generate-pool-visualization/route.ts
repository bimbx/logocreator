import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dedent from "dedent";
import { fal } from "@fal-ai/client";
import { z } from "zod";

// Define custom types for better type safety
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
      poolModel: z.string(),
      interiorMaterial: z.string(),
      exteriorMaterial: z.string(),
      dimensions: z.object({
        length: z.string(),
        width: z.string(),
        depth: z.string(),
      }),
      environment: z.string(),
      additionalFeatures: z.string().optional(),
    })
    .parse(json);

  // Add rate limiting if Upstash API keys are set
  if (process.env.UPSTASH_REDIS_REST_URL) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      // Allow 3 requests per day on prod
      limiter: Ratelimit.fixedWindow(3, "1 d"),
      analytics: true,
      prefix: "hardbox",
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
        "You've used up all your visualization credits for today. Try again tomorrow.",
        {
          status: 429,
          headers: { "Content-Type": "text/plain" },
        },
      );
    }
  }

  // Define model-specific styles and descriptions
  const modelDetails = {
    "Classic Container": 
      "Standard 20ft shipping container converted to an above-ground pool with clean, industrial aesthetic",
    "Premium Infinity": 
      "40ft container with infinity edge, premium finishes, and extended decking",
    "Urban Rooftop": 
      "Lightweight 20ft design optimized for rooftop installation with modern urban styling",
    "Family Swim": 
      "Extended width design using multiple shipping containers for maximum swim space",
    "Swim Spa": 
      "Hybrid model with dedicated swimming area and integrated spa/hot tub section",
    "Natural Look": 
      "Container pool with natural stone cladding and landscaping integration, blends with surroundings"
  };

  // Define environment settings
  const environmentSettings = {
    "Backyard": "residential backyard setting with lawn and garden",
    "Rooftop": "urban rooftop terrace with city views",
    "Beachfront": "coastal property with ocean views and beach access",
    "Countryside": "rural setting with natural landscape",
    "Indoor": "enclosed indoor space, possibly connected to a home",
    "Urban Patio": "small urban outdoor space with limited footprint",
  };

  // Generate the prompt
  const prompt = dedent`Create a photorealistic visualization of a Hardbox.eu swimming pool made from a shipping container. 

Model type: ${data.poolModel} - ${modelDetails[data.poolModel as keyof typeof modelDetails] || "Custom container pool"}
Size: ${data.dimensions.length}ft length x ${data.dimensions.width}ft width x ${data.dimensions.depth}ft depth
Interior finish: ${data.interiorMaterial}
Exterior cladding: ${data.exteriorMaterial}
Environment: ${data.environment} - ${environmentSettings[data.environment as keyof typeof environmentSettings] || "Standard outdoor setting"}
${data.additionalFeatures ? `Additional features: ${data.additionalFeatures}` : ""}

The image should be well-lit, high resolution, and showcase the pool from a 3/4 view angle that highlights both the interior and exterior design elements. Show the pool in use with proper water level and crystal clear water. Make sure the shipping container origin is still somewhat visible in the design.`;

  try {
    console.log("Submitting request to fal.ai with prompt:", prompt);
    
    // Use the queue API to get more control over the response format
    const { request_id } = await fal.queue.submit("fal-ai/flux/dev", {
      input: {
        prompt,
        image_size: "square_hd",
        num_inference_steps: 30,
        guidance_scale: 7.5,
        enable_safety_checker: true,
      },
    });
    
    console.log("Request submitted with ID:", request_id);
    
    // Poll for the result
    let result;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds timeout - pool visualizations might take longer
    
    while (attempts < maxAttempts) {
      const status = await fal.queue.status("fal-ai/flux/dev", {
        requestId: request_id,
        logs: true,
      });
      
      console.log("Status check attempt", attempts + 1, ":", status.status);
      
      if (status.status === "COMPLETED") {
        console.log("Request completed!");
        result = await fal.queue.result("fal-ai/flux/dev", {
          requestId: request_id
        });
        break;
      }
      
      // Use proper type assertion with interface
      if ((status.status as string) === "FAILED") {
        const failedStatus = status as unknown as FailedQueueStatus;
        console.error("Request failed:", failedStatus.error);
        throw new Error("Visualization generation failed: " + failedStatus.error);
      }
      
      // Wait 2 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }
    
    if (!result) {
      console.error("Request timed out");
      throw new Error("Timed out waiting for visualization generation");
    }
    
    console.log("Full result object:", JSON.stringify(result, null, 2));
    
    // Format the response
    if (result.data && result.data.images && result.data.images.length > 0) {
      console.log("Images array:", JSON.stringify(result.data.images, null, 2));
      
      const image = result.data.images[0];
      console.log("First image data:", JSON.stringify(image, null, 2));
      
      console.log("Image object keys:", Object.keys(image));
      
      // If we have a URL, fetch the image and convert to base64
      if (image.url) {
        console.log("Fetching image from URL:", image.url);
        
        const imageResponse = await fetch(image.url);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
        }
        
        const contentType = image.content_type || imageResponse.headers.get("content-type") || "image/png";
        const arrayBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const dataUri = `data:${contentType};base64,${base64}`;
        
        console.log("Converted image to base64 data URI");
        
        // Return the data URI
        return Response.json({
          base64: dataUri
        }, { status: 200 });
      } 
      // Use proper interface for base64 check
      else if ((image as unknown as ImageWithBase64).base64) {
        console.log("Using provided base64 data");
        const imageWithBase64 = image as unknown as ImageWithBase64;
        const contentType = image.content_type || "image/png";
        const dataUri = `data:${contentType};base64,${imageWithBase64.base64}`;
        
        return Response.json({
          base64: dataUri
        }, { status: 200 });
      } else {
        throw new Error("No usable image data found");
      }
    } else {
      console.error("No image data found in the response");
      throw new Error("No image data in response");
    }
  } catch (error: unknown) {
    console.error("Error generating pool visualization:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Unknown error occurred";
    
    // For any errors
    return new Response("An error occurred while generating your pool visualization: " + errorMessage, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

export const runtime = "edge";
