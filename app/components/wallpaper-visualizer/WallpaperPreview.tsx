import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import Spinner from "@/app/components/Spinner";

type PoolPreviewProps = {
  generatedImage: string;
  isLoading: boolean;
  onRegenerate: () => void;
  poolModel: string;
  dimensions: {
    length: string;
    width: string;
    depth: string;
  };
};

export default function PoolPreview({
  generatedImage,
  isLoading,
  onRegenerate,
  poolModel,
  dimensions,
}: PoolPreviewProps) {
  return (
    <div className="relative flex flex-grow items-center justify-center px-4">
      <div className="relative aspect-square w-full max-w-lg">
        {generatedImage ? (
          <>
            <Image
              className={`${isLoading ? "animate-pulse" : ""} rounded-lg`}
              width={512}
              height={512}
              src={generatedImage}
              alt={`${poolModel} container pool visualization`}
            />
            <div
              className={`pointer-events-none absolute inset-0 transition rounded-lg ${isLoading ? "bg-black/50 duration-500" : "bg-black/0 duration-0"}`}
            />

            <div className="absolute -right-12 top-0 flex flex-col gap-2">
              <Button size="icon" variant="secondary" asChild>
                <a href={generatedImage} download="hardbox-pool.png">
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
            
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 rounded-b-lg">
              <p className="text-sm font-bold">{poolModel}</p>
              <p className="text-xs">{dimensions.length}&apos; × {dimensions.width}&apos; × {dimensions.depth}&apos; deep</p>
            </div>
          </>
        ) : (
          <Spinner loading={isLoading} className="size-8 text-white">
            <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl bg-[#2C2C2C]">
              <h4 className="text-center text-base leading-tight text-white">
                Visualize your dream
                <br />
                container pool in seconds!
              </h4>
              <p className="text-sm text-gray-400 mt-2 max-w-[80%] text-center">
                Select your preferences and click &quot;Visualize My Pool&quot; to see a realistic preview
              </p>
            </div>
          </Spinner>
        )}
      </div>
    </div>
  );
}
