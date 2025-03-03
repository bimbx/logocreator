import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InfoTooltip from "../InfoToolTip";

export const interiorMaterials = [
  { name: "Blue Liner", color: "#0066CC" },
  { name: "White Plaster", color: "#FFFFFF" },
  { name: "Gray Concrete", color: "#888888" },
  { name: "Mosaic Tiles", color: "#00CCFF" },
];

export const exteriorMaterials = [
  { name: "Container Original", color: "#E67E22" },
  { name: "Wood Cladding", color: "#8B4513" },
  { name: "White Panels", color: "#F5F5F5" },
  { name: "Stone Finish", color: "#A0A0A0" },
];

type MaterialsSelectorProps = {
  interiorMaterial: string;
  exteriorMaterial: string;
  onInteriorMaterialChange: (value: string) => void;
  onExteriorMaterialChange: (value: string) => void;
};

export default function MaterialsSelector({
  interiorMaterial,
  exteriorMaterial,
  onInteriorMaterialChange,
  onExteriorMaterialChange,
}: MaterialsSelectorProps) {
  return (
    <div className="mb-6">
      <label className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]">
        MATERIALS
        <InfoTooltip content="Choose interior and exterior materials" />
      </label>
      
      <div className="flex flex-col md:flex-row md:space-x-3">
        <div className="mb-4 flex-1 md:mb-0">
          <label className="mb-1 block text-xs font-bold uppercase text-[#6F6F6F]">
            Interior
          </label>
          <Select value={interiorMaterial} onValueChange={onInteriorMaterialChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {interiorMaterials.map((material) => (
                  <SelectItem key={material.name} value={material.name}>
                    <span className="flex items-center">
                      <span
                        style={{ backgroundColor: material.color }}
                        className="mr-2 size-4 rounded-sm"
                      />
                      {material.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="mb-1 block text-xs font-bold uppercase text-[#6F6F6F]">
            Exterior
          </label>
          <Select value={exteriorMaterial} onValueChange={onExteriorMaterialChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {exteriorMaterials.map((material) => (
                  <SelectItem key={material.name} value={material.name}>
                    <span className="flex items-center">
                      <span
                        style={{ backgroundColor: material.color }}
                        className="mr-2 size-4 rounded-sm"
                      />
                      {material.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
