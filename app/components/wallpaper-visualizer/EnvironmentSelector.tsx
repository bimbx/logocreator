import Image from "next/image";
import * as RadioGroup from "@radix-ui/react-radio-group";
import InfoTooltip from "../InfoToolTip";

export const environments = [
  { name: "Backyard", icon: "/environments/backyard.jpg" },
  { name: "Rooftop", icon: "/environments/rooftop.jpg" },
  { name: "Beachfront", icon: "/environments/beachfront.jpg" },
  { name: "Countryside", icon: "/environments/countryside.jpg" },
  { name: "Indoor", icon: "/environments/indoor.jpg" },
  { name: "Urban Patio", icon: "/environments/urban.jpg" },
];

type EnvironmentSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function EnvironmentSelector({ value, onChange }: EnvironmentSelectorProps) {
  return (
    <div className="mb-6">
      <label className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]">
        ENVIRONMENT
        <InfoTooltip content="Choose where your pool will be installed" />
      </label>
      <RadioGroup.Root
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-3 gap-3"
      >
        {environments.map((env) => (
          <RadioGroup.Item
            value={env.name}
            key={env.name}
            className="group text-[#6F6F6F] focus-visible:outline-none data-[state=checked]:text-white"
          >
            <Image
              src={env.icon}
              alt={env.name}
              width={96}
              height={96}
              className="w-full rounded-md border border-transparent group-focus-visible:outline group-focus-visible:outline-offset-2 group-focus-visible:outline-gray-400 group-data-[state=checked]:border-white"
            />
            <span className="text-xs">{env.name}</span>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
}
