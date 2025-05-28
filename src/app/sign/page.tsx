"use client"

import { useState } from "react"
import { SignatureInput } from "./_components/AnimatedSignatureInput"

export default function SignPage() {
  const [signedName, setSignedName] = useState<string | null>(null)

  const handleSignatureComplete = (name: string) => {
    setSignedName(name)
    console.log("Signature completed for:", name)
    // Here you could save the signature or proceed with document signing
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-8">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Simple header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Digital Signature</h1>
          <p className="text-xl text-gray-600">Type your name to see the signature animation</p>
        </div>

        {/* Signature Input Component */}
        <div className="flex justify-center mb-8">
        <SignatureInput autoType="John Doe" />
        </div>

        {/* Success message */}
        {signedName && (
          <div className="text-center">
            <div className="inline-block p-6 bg-green-50 border border-green-200 rounded-2xl">
              <div className="text-green-800 text-lg">
                ✓ Signature created for <strong>{signedName}</strong>
              </div>
              <p className="text-green-600 mt-2">Your signature has been captured successfully!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
