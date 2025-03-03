import Link from "next/link";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { domain } from "@/app/lib/domain";

export default function Header({ className }: { className: string }) {
  const { user } = useUser();

  return (
    <header className={`relative w-full ${className}`}>
      <div className="flex items-center justify-between bg-[#343434] px-4 py-2 md:mt-4">
        {/* Logo - left on mobile, centered on larger screens */}
        <div className="flex flex-grow justify-start xl:justify-center">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              Hardbox AI
            </h1>
          </Link>
        </div>
        {/* Credits Section */}
        <div className="absolute right-8 flex items-center space-x-2 md:top-20 lg:top-8">
          <SignedOut>
            <SignInButton
              mode="modal"
              signUpForceRedirectUrl={domain}
              forceRedirectUrl={domain}
            />
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata.remaining === "BYOK" ? (
              <p>Your API key</p>
            ) : (
              <p>Credits: {`${user?.unsafeMetadata.remaining ?? 3}`}</p>
            )}
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
