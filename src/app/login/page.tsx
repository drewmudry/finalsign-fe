"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Replace this URL with your actual Go API Google OAuth endpoint
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="border-b border-sage/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/"
              className="flex items-center text-sage hover:text-accent-orange transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="font-medium">Back to home</span>
            </Link>
            <Link href="/" className="flex items-center group">
              <div className="w-8 h-8 bg-gradient-to-br from-sage to-accent-orange rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all duration-200">
                <Zap className="w-5 h-5 text-cream" />
              </div>
              <span className="ml-2 text-xl font-semibold text-sage group-hover:text-accent-orange transition-colors">
                Nexus
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-white border-sage/10 shadow-xl hover:shadow-2xl transition-shadow duration-300 border-l-4 border-l-accent-orange/20">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-sage to-accent-orange rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-6 h-6 text-cream" />
              </div>
              <CardTitle className="text-2xl font-bold text-sage">
                Welcome back
              </CardTitle>
              <CardDescription className="text-sage/60 mt-2">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pb-2 ">
              {/* Google Sign In Button */}
              <Button
                onClick={handleGoogleLogin}
                className="w-full bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-accent-orange/5 text-gray-900 border border-gray-300 hover:border-accent-orange/30 shadow-sm py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-3"
                variant="outline"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </Button>

              {/* Footer Links */}
              <div className="text-center space-y-2">
                <p className="text-xs text-sage/60">
                  By signing in, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-sage hover:text-accent-orange underline transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-sage hover:text-accent-orange underline transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-sage/60">
              Need help?{" "}
              <Link
                href="/support"
                className="text-sage hover:text-accent-orange font-medium transition-colors"
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
