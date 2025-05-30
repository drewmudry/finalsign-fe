import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignatureInput } from '../Signature/AnimatedSignatureInput'

export function Hero() {
  return (
    <section className="py-10 px-4">
    <div className="container mx-auto text-center">
      <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
        Sign Documents
        <br />
        <span className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-blue-600">
          Digitally
          <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 300 12" fill="none">
            <path d="M2 10C100 2 200 2 298 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </h1>

      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Streamline your document workflow with secure, legally binding digital signatures. Fast, simple, and trusted
        by professionals worldwide.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Link href="#waitlist">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
          >
            Join the Waitlist
          </Button>
        </Link>
      </div>

      {/* 4-Step Process Container */}
      <div className="py-16 px-4 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl">
        {/* 4-Step Process with SignatureInput */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Step 1: Upload PDFs */}
          <div className="text-center group flex flex-col">
            <h2 className="font-bold text-gray-900 mb-2">1. Upload Documents</h2>
            <div className="flex-1 mx-auto mb-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl group-hover:shadow-lg transition-shadow duration-300 flex items-center justify-center">
              <img
                src="/upload_pdfs.svg"
                alt="Upload PDFs"
                className="w-full h-full max-w-[200px] max-h-[200px] object-contain"
              />
            </div>
          </div>

          {/* Step 2: Add Fields */}
          <div className="text-center group flex flex-col">
            <h2 className="font-semibold text-gray-900 mb-2">2. Add Signature Fields</h2>
            <div className="flex-1 mx-auto mb-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl group-hover:shadow-lg transition-shadow duration-300 flex items-center justify-center">
              <img
                src="/add_fields.svg"
                alt="Add Fields"
                className="w-full h-full max-w-[200px] max-h-[200px] object-contain"
              />
            </div>
          </div>

          {/* Step 3: Sign Documents */}
          <div className="text-center group flex flex-col">
            <h2 className="font-semibold text-gray-900 mb-2">3. Recipients Sign Digitally</h2>
            <div className="flex-1 mb-4 flex items-center justify-center">
              <SignatureInput
                autoType="Final Sign"
                maxWidth="280px"
                strokeWidth={1}
                colorScheme="custom"
                customColors={{
                  background: 'linear-gradient(180deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.04) 100%)',
                  border: 'rgba(59,130,246,0.15)',
                  borderActive: 'rgba(59,130,246,0.4)',
                  text: 'rgba(0, 0, 0, 0.5)',
                  stroke: 'url(#signature-gradient)',
                  placeholder: 'rgba(59,130,246,0.5)',
                  signedBy: 'rgba(59,130,246,0.6)'
                }}
                preventLayoutShift={true}
                fixedHeight={true}
                autoTypeDelay={1500}
              />
            </div>
          </div>

          {/* Step 4: View Metrics */}
          <div className="text-center group flex flex-col">
            <h2 className="font-semibold text-gray-900 mb-2">4. Track Progress</h2>
            <div className="flex-1 mx-auto mb-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl group-hover:shadow-lg transition-shadow duration-300 flex items-center justify-center">
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
  )
}