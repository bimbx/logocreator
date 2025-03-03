import { Input } from "@/app/components/ui/input";
import InfoTooltip from "../InfoToolTip";

type DimensionsInputProps = {
  dimensions: {
    width: string;
    height: string;
  };
  onChange: (dimension: string, value: string) => void;
};

export default function DimensionsInput({ dimensions, onChange }: DimensionsInputProps) {
  return (
    <div className="mb-6">
      <label className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]">
        DIMENSIONS (PX)
        <InfoTooltip content="Enter wallpaper dimensions in pixels" />
      </label>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-[#6F6F6F]">
            Width
          </label>
          <Input
            type="number"
            value={dimensions.width}
            onChange={(e) => onChange("width", e.target.value)}
            min="800"
            max="3840"
            placeholder="1920"
          />
        </div>
        
        <div>
          <label className="mb-1 block text-xs text-[#6F6F6F]">
            Height
          </label>
          <Input
            type="number"
            value={dimensions.height}
            onChange={(e) => onChange("height", e.target.value)}
            min="600"
            max="2160"
            placeholder="1080"
          />
        </div>
      </div>
    </div>
  );
}