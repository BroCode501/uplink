import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Link as LinkIcon, Zap, Shield, ExternalLink, Github } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
       <main className="flex-1">
         {/* Community Badge */}
         <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 border-b border-amber-200 dark:border-slate-700">
           <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center text-sm">
             <p className="text-foreground">
               Built by the{" "}
               <a 
                 href="https://brocode-tech.netlify.app/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center justify-center gap-1 inline-flex"
               >
                 BroCode Tech Community
                 <ExternalLink className="w-3 h-3" />
               </a>
             </p>
           </div>
         </div>

         {/* Hero Section */}
         <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
           <div className="max-w-4xl mx-auto text-center">
             <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
               Shorten Your Links
               <span className="text-amber-700 dark:text-amber-400"> Instantly</span>
             </h1>
             <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
               Create short, memorable URLs and track clicks with ease. Perfect for sharing on social media or tracking campaigns.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/signup">
                 <Button size="lg" className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700">
                   Get Started
                 </Button>
               </Link>
               <Link href="/login">
                 <Button size="lg" variant="outline" className="w-full sm:w-auto">
                   Sign In
                 </Button>
               </Link>
             </div>
           </div>
         </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20 bg-muted">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 text-center">
                <LinkIcon className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Easy Shortening</h3>
                <p className="text-muted-foreground">
                  Create custom or auto-generated short links in seconds. Perfect for any URL.
                </p>
              </div>
              <div className="space-y-3 text-center">
                <Zap className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Analytics</h3>
                <p className="text-muted-foreground">
                  Track clicks and gain insights into your link performance.
                </p>
              </div>
              <div className="space-y-3 text-center">
                <Shield className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your data is secure with Supabase. Choose temporary or permanent links.
                </p>
              </div>
            </div>
          </div>
        </section>

         {/* CTA Section */}
         <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
           <div className="max-w-2xl mx-auto text-center">
             <h2 className="text-3xl sm:text-4xl font-bold mb-6">
               Ready to get started?
             </h2>
             <p className="text-lg text-muted-foreground mb-8">
               Create your account today and start shortening URLs.
             </p>
             <Link href="/signup">
               <Button size="lg" className="bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700">Create Account</Button>
             </Link>
           </div>
         </section>
      </main>

       {/* Footer */}
       <footer className="border-t border-border bg-muted mt-12">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
           <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
             {/* About */}
             <div>
               <h3 className="font-semibold mb-4 flex items-center gap-2">
                 <LinkIcon className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                 Uplink
               </h3>
               <p className="text-sm text-muted-foreground mb-4">
                 A modern URL shortener built with Next.js and Supabase for the BroCode community.
               </p>
               <a 
                 href="https://github.com/BroCode501/uplink" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-2 text-sm font-medium w-fit"
               >
                 <Github className="w-4 h-4" />
                 Open Source on GitHub
               </a>
             </div>

              {/* Community */}
              <div>
                <h3 className="font-semibold mb-4">Community</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a 
                      href="https://brocode-tech.netlify.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 w-fit"
                    >
                      BroCode Tech
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://events.neopanda.tech/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 w-fit"
                    >
                      Event Horizon
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                </ul>
              </div>

              {/* API & Docs */}
              <div>
                <h3 className="font-semibold mb-4">API</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link 
                      href="/docs"
                      className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 w-fit"
                    >
                      API Documentation
                    </Link>
                  </li>
                </ul>
              </div>

             {/* Community Projects */}
              <div>
                <h3 className="font-semibold mb-4">Community Tools</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a 
                      href="https://shareb.in/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 w-fit"
                    >
                      Shareb.in
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">File sharing by Nnisarg Gada</p>
                  </li>
                  <li>
                    <a 
                      href="https://vericert.neopanda.tech/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 w-fit"
                    >
                      Vericert
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">Certificate verification by BroCode</p>
                  </li>
                </ul>
              </div>

             {/* Tech Stack */}
             <div>
               <h3 className="font-semibold mb-4">Built With</h3>
               <p className="text-sm text-muted-foreground">
                 Next.js 15 • Supabase • Tailwind CSS • shadcn/ui
               </p>
             </div>
           </div>

           <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
             <p className="mb-2">&copy; 2024 Uplink. Free and open source software by the BroCode Tech Community.</p>
             <p className="text-xs">
               Part of the BroCode ecosystem • 
               <a 
                 href="https://github.com/BroCode501/uplink" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-amber-700 dark:text-amber-400 hover:underline ml-1"
               >
                 GitHub Repository
               </a>
             </p>
           </div>
         </div>
       </footer>
    </div>
  );
}
