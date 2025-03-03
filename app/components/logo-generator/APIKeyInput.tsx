import { Input } from "@/app/components/ui/input";

type APIKeyInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function APIKeyInput({ value, onChange }: APIKeyInputProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="api-key"
        className="mb-2 block text-xs font-bold uppercase text-[#F3F3F3]"
      >
        TOGETHER API KEY
        <span className="ml-2 text-xs uppercase text-[#6F6F6F]">
          [OPTIONAL]
        </span>
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="API Key"
        type="password"
      />
    </div>
  );
}
