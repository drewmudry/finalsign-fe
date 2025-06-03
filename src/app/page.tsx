import LPHeader from "./_components/landingPage/LPHeader";
import { Hero } from "./_components/landingPage/hero";
import { CTA } from "./_components/landingPage/CTA";

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <LPHeader />
      <Hero />
      <CTA />
      {/* Footer */}
      <footer className="bg-cream text-sage py-12 px-4">
        <p className="text-center text-sage">
          &copy; 2025 FinalSign. All rights reserved.
        </p>
      </footer>
    </div>
    // <div className="min-h-screen bg-cream">
    //   {/* Header */}
    //   <header className="border-b border-sage/10">
    //     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    //       <div className="flex justify-between items-center py-4">
    //         <div className="flex items-center">
    //           <div className="w-8 h-8 bg-gradient-to-br from-sage to-accent-orange rounded-lg flex items-center justify-center">
    //             <Zap className="w-5 h-5 text-cream" />
    //           </div>
    //           <span className="ml-2 text-xl font-semibold text-sage">
    //             Nexus
    //           </span>
    //         </div>
    //         <Link
    //           href="/login"
    //           className="text-sage hover:text-accent-orange font-medium transition-colors"
    //         >
    //           Sign in
    //         </Link>
    //       </div>
    //     </div>
    //   </header>

    //   {/* Hero Section */}
    //   <main className="container mx-auto px-4 sm:px-6 lg:px-8">
    //     <div className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
    //       <div className="text-center">
    //         {/* Badge */}
    //         <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-sage/10 to-accent-orange/10 text-sage text-sm font-medium mb-8 border border-accent-orange/20">
    //           <CheckCircle className="w-4 h-4 mr-2 text-accent-orange" />
    //           Trusted by 10,000+ businesses worldwide
    //         </div>

    //         {/* Main Heading */}
    //         <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-sage leading-tight mb-6">
    //           Financial infrastructure
    //           <br />
    //           <span className="bg-gradient-to-r from-sage via-accent-orange to-sage/70 bg-clip-text text-transparent">
    //             for the internet
    //           </span>
    //         </h1>

    //         {/* Subheading */}
    //         <p className="text-xl sm:text-2xl text-sage/70 max-w-3xl mx-auto mb-10 leading-relaxed">
    //           Millions of companies of all sizes use Nexus to accept payments,
    //           send payouts, and manage their businesses online.
    //         </p>

    //         {/* CTA Buttons */}
    //         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
    //           <Button
    //             size="lg"
    //             className="bg-gradient-to-r from-sage to-accent-orange hover:from-sage/90 hover:to-accent-orange/90 text-cream px-8 py-4 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
    //           >
    //             Start now
    //             <ArrowRight className="ml-2 w-5 h-5" />
    //           </Button>
    //           <Button
    //             variant="outline"
    //             size="lg"
    //             className="border-accent-orange/30 text-sage hover:bg-accent-orange/5 hover:border-accent-orange/50 px-8 py-4 text-lg font-medium rounded-lg transition-all duration-200"
    //           >
    //             Contact sales
    //           </Button>
    //         </div>

    //         {/* Feature Pills */}
    //         <div className="flex flex-wrap justify-center gap-6 text-sage/60">
    //           <div className="flex items-center group hover:text-accent-orange transition-colors">
    //             <Shield className="w-5 h-5 mr-2 group-hover:text-accent-orange" />
    //             <span className="text-sm font-medium">
    //               Enterprise-grade security
    //             </span>
    //           </div>
    //           <div className="flex items-center group hover:text-accent-orange transition-colors">
    //             <Globe className="w-5 h-5 mr-2 group-hover:text-accent-orange" />
    //             <span className="text-sm font-medium">Global scale</span>
    //           </div>
    //           <div className="flex items-center group hover:text-accent-orange transition-colors">
    //             <Zap className="w-5 h-5 mr-2 group-hover:text-accent-orange" />
    //             <span className="text-sm font-medium">Lightning fast</span>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Hero Visual */}
    //       <div className="mt-20 relative">
    //         <div className="relative mx-auto max-w-5xl">
    //           {/* Main Dashboard Mockup */}
    //           <div className="bg-white rounded-2xl shadow-2xl border border-sage/10 overflow-hidden">
    //             <div className="bg-gradient-to-r from-sage/5 to-accent-orange/5 px-6 py-4 border-b border-sage/10">
    //               <div className="flex items-center space-x-2">
    //                 <div className="w-3 h-3 bg-red-400 rounded-full"></div>
    //                 <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
    //                 <div className="w-3 h-3 bg-green-400 rounded-full"></div>
    //               </div>
    //             </div>
    //             <div className="p-8">
    //               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    //                 <div className="bg-gradient-to-br from-sage/5 to-accent-orange/5 rounded-lg p-6 border border-accent-orange/10">
    //                   <div className="text-2xl font-bold text-sage mb-2">
    //                     $2.4M
    //                   </div>
    //                   <div className="text-sage/60 text-sm">Total Revenue</div>
    //                   <div className="text-accent-orange text-xs mt-1 font-medium">
    //                     +12.5% from last month
    //                   </div>
    //                 </div>
    //                 <div className="bg-sage/5 rounded-lg p-6">
    //                   <div className="text-2xl font-bold text-sage mb-2">
    //                     1,429
    //                   </div>
    //                   <div className="text-sage/60 text-sm">
    //                     Active Customers
    //                   </div>
    //                   <div className="text-green-600 text-xs mt-1">
    //                     +8.2% from last month
    //                   </div>
    //                 </div>
    //                 <div className="bg-sage/5 rounded-lg p-6">
    //                   <div className="text-2xl font-bold text-sage mb-2">
    //                     99.9%
    //                   </div>
    //                   <div className="text-sage/60 text-sm">Uptime</div>
    //                   <div className="text-green-600 text-xs mt-1">
    //                     All systems operational
    //                   </div>
    //                 </div>
    //               </div>
    //               <div className="space-y-4">
    //                 <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sage/5 to-accent-orange/5 rounded-lg border border-accent-orange/10">
    //                   <div className="flex items-center space-x-3">
    //                     <div className="w-10 h-10 bg-gradient-to-br from-sage to-accent-orange rounded-lg flex items-center justify-center">
    //                       <CheckCircle className="w-5 h-5 text-cream" />
    //                     </div>
    //                     <div>
    //                       <div className="font-medium text-sage">
    //                         Payment processed
    //                       </div>
    //                       <div className="text-sm text-sage/60">
    //                         Acme Corp - $1,299.00
    //                       </div>
    //                     </div>
    //                   </div>
    //                   <div className="text-sm text-accent-orange font-medium">
    //                     2 min ago
    //                   </div>
    //                 </div>
    //                 <div className="flex items-center justify-between p-4 bg-sage/5 rounded-lg">
    //                   <div className="flex items-center space-x-3">
    //                     <div className="w-10 h-10 bg-sage rounded-lg flex items-center justify-center">
    //                       <CheckCircle className="w-5 h-5 text-cream" />
    //                     </div>
    //                     <div>
    //                       <div className="font-medium text-sage">
    //                         New customer
    //                       </div>
    //                       <div className="text-sm text-sage/60">
    //                         TechStart Inc - Subscription
    //                       </div>
    //                     </div>
    //                   </div>
    //                   <div className="text-sm text-sage/60">5 min ago</div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>

    //           {/* Floating Elements */}
    //           <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-sage/10 to-accent-orange/10 rounded-full blur-xl"></div>
    //           <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-accent-orange/5 to-sage/5 rounded-full blur-2xl"></div>
    //           <div className="absolute top-1/2 -right-8 w-16 h-16 bg-accent-orange/10 rounded-full blur-lg"></div>
    //         </div>
    //       </div>
    //     </div>
    //   </main>
    // </div>
  );
}
