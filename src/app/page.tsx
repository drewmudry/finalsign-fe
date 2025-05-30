import { Hero } from "./components/landingPage/hero"
import { CTA } from "./components/landingPage/CTA"
import Header from "./components/landingPage/header"


export default async function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <Header />
      <Hero />
      <CTA id="waitlist"/>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <p className="text-center text-gray-300">&copy; 2025 FinalSign. All rights reserved.</p>
      </footer>
    </div>
  )
}
