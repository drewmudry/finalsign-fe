import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignatureInput } from "../Signature/AnimatedSignatureInput";

export function Hero() {
  return (
    <section className="py-10 px-4 bg-cream">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-sage via-accent-orange to-sage/70 bg-clip-text text-transparent leading-tight">
          Sign Documents
          <br />
          <span className="relative bg-gradient-to-r from-sage via-accent-orange to-sage/70 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-sage">
            Digitally
            <svg
              className="absolute -bottom-2 left-0 w-full h-3"
              viewBox="0 0 300 12"
              fill="none"
            >
              <path
                d="M2 10C100 2 200 2 298 10"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1d503a" />
                  <stop offset="100%" stopColor="#da8a67" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        <p className="text-xl text-sage/70 mb-8 max-w-2xl mx-auto leading-relaxed">
          Streamline your document workflow with secure, legally binding digital
          signatures. Fast, simple, and trusted by professionals worldwide.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="#waitlist">
            <Button
              size="lg"
              className="bg-sage hover:bg-sage text-cream text-lg px-8 py-6 font-medium transition-all duration-200"
            >
              Join the Waitlist
            </Button>
          </Link>
        </div>

        {/* 4-Step Process Container */}
        <div className="py-16 px-4 bg-gradient-to-br from-sage/5 to-accent-orange/5 rounded-3xl border border-accent-orange/10">
          {/* 4-Step Process with SignatureInput */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Step 1: Upload PDFs */}
            <div className="text-center group flex flex-col">
              <h2 className="font-bold text-sage mb-2">1. Upload Documents</h2>
              <div className="flex-1 mx-auto mb-4 p-4 bg-gradient-to-br from-sage/5 to-accent-orange/5 rounded-xl group-hover:shadow-lg transition-shadow duration-300 flex items-center justify-center border border-accent-orange/10">
                <img
                  src="/upload_pdfs.svg"
                  alt="Upload PDFs"
                  className="w-full h-full max-w-[200px] max-h-[200px] object-contain"
                />
              </div>
            </div>

            {/* Step 2: Add Fields */}
            <div className="text-center group flex flex-col">
              <h2 className="font-semibold text-sage mb-2">
                2. Add Signature Fields
              </h2>
              <div className="flex-1 mx-auto mb-4 p-4 bg-gradient-to-br from-sage/5 to-accent-orange/5 rounded-xl group-hover:shadow-lg transition-shadow duration-300 flex items-center justify-center border border-accent-orange/10">
                <img
                  src="/add_fields.svg"
                  alt="Add Fields"
                  className="w-full h-full max-w-[200px] max-h-[200px] object-contain"
                />
              </div>
            </div>

            {/* Step 3: Sign Documents */}
            <div className="text-center group flex flex-col">
              <h2 className="font-semibold text-sage mb-2">
                3. Recipients Sign Digitally
              </h2>
              <div className="flex-1 mb-4 flex items-center justify-center">
                <SignatureInput
                  autoType="Final Sign"
                  maxWidth="280px"
                  strokeWidth={1}
                  colorScheme="custom"
                  customColors={{
                    background:
                      "linear-gradient(180deg, rgba(29,80,58,0.08) 0%, rgba(218,138,103,0.04) 100%)",
                    border: "rgba(29,80,58,0.15)",
                    borderActive: "rgba(218,138,103,0.4)",
                    text: "rgba(29,80,58, 0.8)",
                    stroke: "url(#signature-gradient)",
                    placeholder: "rgba(29,80,58,0.5)",
                    signedBy: "rgba(218,138,103,0.7)",
                  }}
                  preventLayoutShift={true}
                  fixedHeight={true}
                  autoTypeDelay={1500}
                />
              </div>
            </div>

            {/* Step 4: View Metrics */}
            <div className="text-center group flex flex-col">
              <h2 className="font-semibold text-sage mb-2">
                4. Track Progress
              </h2>
              <div className="flex-1 mx-auto mb-4 p-4 bg-gradient-to-br from-sage/5 to-accent-orange/5 rounded-xl group-hover:shadow-lg transition-shadow duration-300 flex items-center justify-center border border-accent-orange/10">
                <img
                  src="/view_metrics.svg"
                  alt="View Metrics"
                  className="w-full h-full max-w-[200px] max-h-[200px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
