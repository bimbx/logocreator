import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import Image from "next/image";
import InfoTooltip from "../InfoToolTip";
import ModelSelector from "./ModelSelector";
import MaterialsSelector from "./MaterialsSelector";
import EnvironmentSelector from "./EnvironmentSelector";
import DimensionsInput from "./DimensionsInput";

type VisualizerFormProps = {
  poolModel: string;
  interiorMaterial: string;
  exteriorMaterial: string;
  dimensions: {
    length: string;
    width: string;
    depth: string;
  };
  environment: string;
  additionalFeatures: string;
  isLoading: boolean;
  onPoolModelChange: (value: string) => void;
  onInteriorMaterialChange: (value: string) => void;
  onExteriorMaterialChange: (value: string) => void;
  onDimensionChange: (dimension: string, value: string) => void;
  onEnvironmentChange: (value: string) => void;
  onAdditionalFeaturesChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSignedIn: boolean;
};

export default function VisualizerForm({
  poolModel,
  interiorMaterial,
  exteriorMaterial,
  dimensions,
  environment,
  additionalFeatures,
  isLoading,
  onPoolModelChange,
  onInteriorMaterialChange,
  onExteriorMaterialChange,
  onDimensionChange,
  onEnvironmentChange,
  onAdditionalFeaturesChange,
  onSubmit,
  isSignedIn,
}: VisualizerFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex h-full w-full flex-col">
      <fieldset className="flex grow flex-col" disabled={!isSignedIn}>
        <div className="flex-grow overflow-y-auto">
          <div className="px-8 pb-0 pt-4 md:px-6 md:pt-6">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-white mb-2">Hardbox.eu Container Pool Visualizer</h1>
              <p className="text-sm text-gray-400 mb-4">
                Customize and visualize your dream shipping container swimming pool
              </p>
            </div>
            
            <div className="-mx-6 mb-6 h-px w-[calc(100%+48px)] bg-[#343434]"></div>
            
            <ModelSelector value={poolModel} onChange={onPoolModelChange} />
            
            <DimensionsInput 
              dimensions={dimensions}
              onChange={onDimensionChange}
            />
            
            <MaterialsSelector
              interiorMaterial={interiorMaterial}
              exteriorMaterial={exteriorMaterial}
              onInteriorMaterialChange={onInteriorMaterialChange}
              onExteriorMaterialChange={onExteriorMaterialChange}
            />
            
            <EnvironmentSelector 
              value={environment} 
              onChange={onEnvironmentChange} 
            />
            
            <div className="mb-6">
              <label
                htmlFor="additional-features"
                className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]"
              >
                Additional Features
                <InfoTooltip content="Specify any additional features or customizations" />
              </label>
              <Textarea
                value={additionalFeatures}
                onChange={(e) => onAdditionalFeaturesChange(e.target.value)}
                placeholder="E.g., LED lighting, swim jets, integrated deck, heating system..."
              />
            </div>
          </div>
        </div>
        <div className="px-8 py-4 md:px-6 md:py-6">
          <Button
            size="lg"
            className="w-full text-base font-bold"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loader mr-2" />
            ) : (
              <Image
                src="/generate-icon.svg"
                alt="Generate Icon"
                width={16}
                height={16}
                className="mr-2"
              />
            )}
            {isLoading ? "Generating..." : "Visualize My Pool"}{" "}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
