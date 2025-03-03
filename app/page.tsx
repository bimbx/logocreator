"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "@/hooks/use-toast";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VisualizerForm from "./components/pool-visualizer/VisualizerForm";
import PoolPreview from "./components/pool-visualizer/PoolPreview";
import AuthOverlay from "./components/pool-visualizer/AuthOverlay";
import { poolModels } from "./components/pool-visualizer/ModelSelector";
import { interiorMaterials, exteriorMaterials } from "./components/pool-visualizer/MaterialsSelector";
import { environments } from "./components/pool-visualizer/EnvironmentSelector";

export default function Page() {
  // User state
  const { isSignedIn, isLoaded } = useUser();
  
  // Pool configuration state
  const [poolModel, setPoolModel] = useState(poolModels[0].name);
  const [interiorMaterial, setInteriorMaterial] = useState(interiorMaterials[0].name);
  const [exteriorMaterial, setExteriorMaterial] = useState(exteriorMaterials[0].name);
  const [dimensions, setDimensions] = useState({ length: "20", width: "8", depth: "6" });
  const [environment, setEnvironment] = useState(environments[0].name);
  const [additionalFeatures, setAdditionalFeatures] = useState("");
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");

  async function generateVisualization() {
    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);

    const res = await fetch("/api/generate-pool-visualization", {
      method: "POST",
      body: JSON.stringify({
        poolModel,
        interiorMaterial,
        exteriorMaterial,
        dimensions,
        environment,
        additionalFeatures,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      setGeneratedImage(json.base64);
    } else if (res.headers.get("Content-Type") === "text/plain") {
      toast({
        variant: "destructive",
        title: res.statusText,
        description: await res.text(),
      });
    } else {
      toast({
        variant: "destructive",
        title: "Visualization Error",
        description: `There was a problem generating your pool visualization: ${res.statusText}`,
      });
    }

    setIsLoading(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedImage("");
    generateVisualization();
  };

  const handleDimensionChange = (dimension: string, value: string) => {
    setDimensions(prev => ({ ...prev, [dimension]: value }));
  };

  return (
    <div className="flex h-screen flex-col overflow-y-auto overflow-x-hidden bg-[#343434] md:flex-row">
      <Header className="block md:hidden" />

      <div className="flex w-full flex-col md:flex-row">
        <div className="relative flex h-full w-full flex-col bg-[#2C2C2C] text-[#F3F3F3] md:max-w-sm">
          <VisualizerForm 
            poolModel={poolModel}
            interiorMaterial={interiorMaterial}
            exteriorMaterial={exteriorMaterial}
            dimensions={dimensions}
            environment={environment}
            additionalFeatures={additionalFeatures}
            isLoading={isLoading}
            onPoolModelChange={setPoolModel}
            onInteriorMaterialChange={setInteriorMaterial}
            onExteriorMaterialChange={setExteriorMaterial}
            onDimensionChange={handleDimensionChange}
            onEnvironmentChange={setEnvironment}
            onAdditionalFeaturesChange={setAdditionalFeatures}
            onSubmit={handleSubmit}
            isSignedIn={!!isSignedIn}
          />

          <AuthOverlay isVisible={isLoaded && !isSignedIn} />
        </div>

        <div className="flex w-full flex-col pt-12 md:pt-0">
          <Header className="hidden md:block" />
          <PoolPreview 
            generatedImage={generatedImage}
            isLoading={isLoading}
            onRegenerate={generateVisualization}
            poolModel={poolModel}
            dimensions={dimensions}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
}
