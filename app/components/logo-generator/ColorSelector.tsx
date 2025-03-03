import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const primaryColors = [
  { name: "Blue", color: "#0F6FFF" },
  { name: "Red", color: "#FF0000" },
  { name: "Green", color: "#00FF00" },
  { name: "Yellow", color: "#FFFF00" },
];

export const backgroundColors = [
  { name: "White", color: "#FFFFFF" },
  { name: "Gray", color: "#CCCCCC" },
  { name: "Black", color: "#000000" },
];

type ColorSelectorProps = {
  primaryColor: string;
  backgroundColor: string;
  onPrimaryColorChange: (value: string) => void;
  onBackgroundColorChange: (value: string) => void;
};

export default function ColorSelector({
  primaryColor,
  backgroundColor,
  onPrimaryColorChange,
  onBackgroundColorChange,
}: ColorSelectorProps) {
  return (
    <div className="mb-[25px] flex flex-col md:flex-row md:space-x-3">
      <div className="mb-4 flex-1 md:mb-0">
        <label className="mb-1 block text-xs font-bold uppercase text-[#6F6F6F]">
          Primary
        </label>
        <Select value={primaryColor} onValueChange={onPrimaryColorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {primaryColors.map((color) => (
                <SelectItem key={color.color} value={color.name}>
                  <span className="flex items-center">
                    <span
                      style={{ backgroundColor: color.color }}
                      className="mr-2 size-4 rounded-sm bg-white"
                    />
                    {color.name}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <label className="mb-1 block items-center text-xs font-bold uppercase text-[#6F6F6F]">
          Background
        </label>
        <Select value={backgroundColor} onValueChange={onBackgroundColorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {backgroundColors.map((color) => (
                <SelectItem key={color.color} value={color.name}>
                  <span className="flex items-center">
                    <span
                      style={{ backgroundColor: color.color }}
                      className="mr-2 size-4 rounded-sm bg-white"
                    />
                    {color.name}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
