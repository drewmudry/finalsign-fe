"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function CTA() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/waitlist`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setSubmitMessage("Successfully joined the waitlist!");
        setName("");
        setEmail("");
        setPhone("");
      } else {
        const errorData = await response.json();
        setSubmitMessage(
          errorData.message || "Failed to join the waitlist. Please try again."
        );
      }
    } catch (error) {
      console.error("Waitlist submission error:", error);
      setSubmitMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setSubmitMessage(null);
    setName("");
    setEmail("");
    setPhone("");
  };

  return (
    <section
      id="waitlist"
      className="py-20 px-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your Document Workflow?
          </h2>

          <div className="max-w-md mx-auto">
            {isSuccess ? (
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    You&apos;re on the list!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for joining our waitlist. We&apos;ll notify you as
                    soon as FinalSign is ready for you.
                  </p>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Join Another Person
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Join the Waitlist
                    </h3>
                    <p className="text-gray-600">
                      Be the first to know when we launch
                    </p>
                  </div>

                  <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="h-12 text-base"
                    />
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="h-12 text-base"
                    />
                    <Input
                      type="tel"
                      placeholder="Your Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isSubmitting}
                      className="h-12 text-base"
                    />

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>
                          Join Waitlist
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    {submitMessage && !isSuccess && (
                      <Alert
                        variant={
                          submitMessage.startsWith("Successfully")
                            ? "default"
                            : "destructive"
                        }
                      >
                        <AlertDescription>{submitMessage}</AlertDescription>
                      </Alert>
                    )}
                  </form>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    We won&apos;t spam you.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
