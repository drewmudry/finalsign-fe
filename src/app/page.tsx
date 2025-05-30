import { Hero } from "./_components/landingPage/hero"
import { CTA } from "./_components/landingPage/CTA"
import { LPHeader } from "./_components/landingPage/LPHeader"


export default async function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <LPHeader />
      <Hero />
      <CTA />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <p className="text-center text-gray-300">&copy; 2025 FinalSign. All rights reserved.</p>
      </footer>
    </div>
  )
}
