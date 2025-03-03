import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import Spinner from "@/app/components/Spinner";

type LogoPreviewProps = {
  generatedImage: string;
  isLoading: boolean;
  onRegenerate: () => void;
};

export default function LogoPreview({
  generatedImage,
  isLoading,
  onRegenerate,
}: LogoPreviewProps) {
  return (
    <div className="relative flex flex-grow items-center justify-center px-4">
      <div className="relative aspect-square w-full max-w-lg">
        {generatedImage ? (
          <>
            <Image
              className={`${isLoading ? "animate-pulse" : ""}`}
              width={512}
              height={512}
              src={generatedImage}
              alt=""
            />
            <div
              className={`pointer-events-none absolute inset-0 transition ${isLoading ? "bg-black/50 duration-500" : "bg-black/0 duration-0"}`}
            />

            <div className="absolute -right-12 top-0 flex flex-col gap-2">
              <Button size="icon" variant="secondary" asChild>
                <a href={generatedImage} download="logo.png">
                  <DownloadIcon />
                </a>
              </Button>
              <Button
                size="icon"
                onClick={onRegenerate}
                variant="secondary"
              >
                <Spinner loading={isLoading}>
                  <RefreshCwIcon />
                </Spinner>
              </Button>
            </div>
          </>
        ) : (
          <Spinner loading={isLoading} className="size-8 text-white">
            <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl bg-[#2C2C2C]">
              <h4 className="text-center text-base leading-tight text-white">
                Generate your dream
                <br />
                logo in 10 seconds!
              </h4>
            </div>
          </Spinner>
        )}
      </div>
    </div>
  );
}
