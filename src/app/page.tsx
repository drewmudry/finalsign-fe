"use client"

import { useState, useEffect } from "react"
import { Hero } from "./components/landingPage/hero"
import { CTA } from "./components/landingPage/CTA"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface User {
  email: string
}

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null)

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
    } 
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header />

      {/* Hero Section */}
      <Hero />

      {/* CTA Section */}
      <CTA user={user} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <p className="text-center text-gray-300">&copy; 2025 FinalSign. All rights reserved.</p>
      </footer>
    </div>
  )
}