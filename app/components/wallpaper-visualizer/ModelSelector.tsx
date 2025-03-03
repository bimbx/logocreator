import Image from "next/image";
import * as RadioGroup from "@radix-ui/react-radio-group";
import InfoTooltip from "../InfoToolTip";

const poolModels = [
  { 
    name: "Classic Container", 
    icon: "/models/classic.jpg",
    description: "Standard 20ft container converted to an above-ground pool"
  },
  { 
    name: "Premium Infinity", 
    icon: "/models/infinity.jpg",
    description: "40ft container with infinity edge and premium finishes"
  },
  { 
    name: "Urban Rooftop", 
    icon: "/models/rooftop.jpg",
    description: "Lightweight 20ft design optimized for rooftop installation"
  },
  { 
    name: "Family Swim", 
    icon: "/models/family.jpg",
    description: "Extended width design using multiple containers for maximum swim space"
  },
  { 
    name: "Swim Spa", 
    icon: "/models/spa.jpg",
    description: "Hybrid model with swimming and spa zones"
  },
  { 
    name: "Natural Look", 
    icon: "/models/natural.jpg",
    description: "Container pool with natural stone cladding and landscaping integration"
  },
];

type ModelSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="mb-6">
      <label className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]">
        POOL MODEL
        <InfoTooltip content="Choose a container pool model" />
      </label>
      <RadioGroup.Root
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-3 gap-3"
      >
        {poolModels.map((model) => (
          <RadioGroup.Item
            value={model.name}
            key={model.name}
            className="group text-[#6F6F6F] focus-visible:outline-none data-[state=checked]:text-white"
          >
            <div className="relative">
              <Image
                src={model.icon}
                alt={model.name}
                width={96}
                height={96}
                className="w-full rounded-md border border-transparent group-focus-visible:outline group-focus-visible:outline-offset-2 group-focus-visible:outline-gray-400 group-data-[state=checked]:border-white"
              />
              <div className="mt-1">
                <span className="text-xs font-bold block">{model.name}</span>
                <span className="text-xs text-gray-400 hidden group-data-[state=checked]:block">
                  {model.description}
                </span>
              </div>
            </div>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
}

export { poolModels };
