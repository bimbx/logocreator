import Image from "next/image";
import * as RadioGroup from "@radix-ui/react-radio-group";
import InfoTooltip from "../InfoToolTip";

const logoStyles = [
  { name: "Tech", icon: "/tech.svg" },
  { name: "Flashy", icon: "/flashy.svg" },
  { name: "Modern", icon: "/modern.svg" },
  { name: "Playful", icon: "/playful.svg" },
  { name: "Abstract", icon: "/abstract.svg" },
  { name: "Minimal", icon: "/minimal.svg" },
];

type StyleSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="mb-6">
      <label className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]">
        STYLE
        <InfoTooltip content="Choose a style for your logo" />
      </label>
      <RadioGroup.Root
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-3 gap-3"
      >
        {logoStyles.map((logoStyle) => (
          <RadioGroup.Item
            value={logoStyle.name}
            key={logoStyle.name}
            className="group text-[#6F6F6F] focus-visible:outline-none data-[state=checked]:text-white"
          >
            <Image
              src={logoStyle.icon}
              alt={logoStyle.name}
              width={96}
              height={96}
              className="w-full rounded-md border border-transparent group-focus-visible:outline group-focus-visible:outline-offset-2 group-focus-visible:outline-gray-400 group-data-[state=checked]:border-white"
            />
            <span className="text-xs">{logoStyle.name}</span>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
}

export { logoStyles };
