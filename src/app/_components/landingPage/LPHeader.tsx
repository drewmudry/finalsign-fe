import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function LPHeader() {
  return (
    <header className="border-b border-sage/10 bg-cream/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-sage to-accent-orange rounded-lg flex items-center justify-center">
              <Image
                width={100}
                height={100}
                src="/fs_logo.svg"
                alt="Logo"
                className="w-5 h-5"
                style={{ filter: "brightness(0) invert(1)" }}
                unoptimized
              />
            </div>
            <span className="ml-2 text-xl font-semibold text-sage">
              FinalSign
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="#waitlist">
              <Button className="bg-sage hover:bg-sage text-cream font-medium transition-all duration-200">
                Join the Waitlist
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default LPHeader;
