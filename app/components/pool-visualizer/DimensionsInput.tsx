import { Input } from "@/app/components/ui/input";
import InfoTooltip from "../InfoToolTip";

type DimensionsInputProps = {
  dimensions: {
    length: string;
    width: string;
    depth: string;
  };
  onChange: (dimension: string, value: string) => void;
};

export default function DimensionsInput({ dimensions, onChange }: DimensionsInputProps) {
  return (
    <div className="mb-6">
      <label className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]">
        DIMENSIONS (FT)
        <InfoTooltip content="Enter pool dimensions in feet" />
      </label>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs text-[#6F6F6F]">
            Length
          </label>
          <Input
            type="number"
            value={dimensions.length}
            onChange={(e) => onChange("length", e.target.value)}
            min="10"
            max="40"
            placeholder="20"
          />
        </div>
        
        <div>
          <label className="mb-1 block text-xs text-[#6F6F6F]">
            Width
          </label>
          <Input
            type="number"
            value={dimensions.width}
            onChange={(e) => onChange("width", e.target.value)}
            min="6"
            max="16"
            placeholder="8"
          />
        </div>
        
        <div>
          <label className="mb-1 block text-xs text-[#6F6F6F]">
            Depth
          </label>
          <Input
            type="number"
            value={dimensions.depth}
            onChange={(e) => onChange("depth", e.target.value)}
            min="3"
            max="10"
            placeholder="6"
          />
        </div>
      </div>
    </div>
  );
}
