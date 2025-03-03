import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import Image from "next/image";
import InfoTooltip from "../InfoToolTip";
import APIKeyInput from "./APIKeyInput";
import StyleSelector from "./StyleSelector";
import ColorSelector from "./ColorSelector";

type LogoFormProps = {
  userAPIKey: string;
  companyName: string;
  selectedStyle: string;
  selectedPrimaryColor: string;
  selectedBackgroundColor: string;
  additionalInfo: string;
  isLoading: boolean;
  onUserAPIKeyChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onStyleChange: (value: string) => void;
  onPrimaryColorChange: (value: string) => void;
  onBackgroundColorChange: (value: string) => void;
  onAdditionalInfoChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSignedIn: boolean;
};

export default function LogoForm({
  userAPIKey,
  companyName,
  selectedStyle,
  selectedPrimaryColor,
  selectedBackgroundColor,
  additionalInfo,
  isLoading,
  onUserAPIKeyChange,
  onCompanyNameChange,
  onStyleChange,
  onPrimaryColorChange,
  onBackgroundColorChange,
  onAdditionalInfoChange,
  onSubmit,
  isSignedIn,
}: LogoFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex h-full w-full flex-col">
      <fieldset className="flex grow flex-col" disabled={!isSignedIn}>
        <div className="flex-grow overflow-y-auto">
          <div className="px-8 pb-0 pt-4 md:px-6 md:pt-6">
            <APIKeyInput value={userAPIKey} onChange={onUserAPIKeyChange} />
            
            <div className="-mx-6 mb-6 h-px w-[calc(100%+48px)] bg-[#343434]"></div>
            
            <div className="mb-6">
              <label
                htmlFor="company-name"
                className="mb-2 block text-xs font-bold uppercase text-[#6F6F6F]"
              >
                Company Name
              </label>
              <Input
                value={companyName}
                onChange={(e) => onCompanyNameChange(e.target.value)}
                placeholder="Sam's Burgers"
                required
              />
            </div>
            
            <StyleSelector value={selectedStyle} onChange={onStyleChange} />
            
            <ColorSelector
              primaryColor={selectedPrimaryColor}
              backgroundColor={selectedBackgroundColor}
              onPrimaryColorChange={onPrimaryColorChange}
              onBackgroundColorChange={onBackgroundColorChange}
            />
            
            <div className="mb-1">
              <div className="mt-1">
                <div className="mb-1">
                  <label
                    htmlFor="additional-info"
                    className="mb-2 flex items-center text-xs font-bold uppercase text-[#6F6F6F]"
                  >
                    Additional Info
                    <InfoTooltip content="Provide any additional information about your logo" />
                  </label>
                  <Textarea
                    value={additionalInfo}
                    onChange={(e) => onAdditionalInfoChange(e.target.value)}
                    placeholder="Enter additional information"
                  />
                </div>
              </div>
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
            {isLoading ? "Loading..." : "Generate Logo"}{" "}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
