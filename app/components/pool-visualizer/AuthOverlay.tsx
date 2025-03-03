import { Button } from "@/app/components/ui/button";
import { motion } from "framer-motion";
import { SignInButton } from "@clerk/nextjs";
import { domain } from "@/app/lib/domain";

type AuthOverlayProps = {
  isVisible: boolean;
};

export default function AuthOverlay({ isVisible }: AuthOverlayProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 px-6"
    >
      <div className="rounded bg-gray-200 p-4 text-gray-900">
        <p className="text-lg">
          Create a free account to visualize your Hardbox.eu container pool:
        </p>

        <div className="mt-4">
          <SignInButton
            mode="modal"
            signUpForceRedirectUrl={domain}
            forceRedirectUrl={domain}
          >
            <Button
              size="lg"
              className="w-full text-base font-semibold"
              variant="secondary"
            >
              Sign in
            </Button>
          </SignInButton>
        </div>
      </div>
    </motion.div>
  );
}
