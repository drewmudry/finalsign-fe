"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

import { FileText, ArrowRight} from "lucide-react"
import Link from "next/link"
import { SignatureInput } from "./sign/_components/AnimatedSignatureInput"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface User {
  email: string
}

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        credentials: "include",
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.log("Not authenticated")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetStarted = () => {
    window.location.href = `${API_BASE_URL}/auth/google`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FinalSign
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#security" className="text-gray-600 hover:text-gray-900 transition-colors">
              Security
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-24 h-9 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
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
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
            >
              Join the Waitlist
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
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
                <h2 className="font-semibold text-gray-900 mb-2">3. Sign Digitally</h2>
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


      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Document Workflow?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using FinalSign to streamline their document signing process.
          </p>

          {user ? (
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              Start Signing Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">FinalSign</span>
              </div>
              <p className="text-gray-400">The most trusted digital signature platform for modern businesses.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FinalSign. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}