import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Link as LinkIcon, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Shorten Your Links
              <span className="text-primary"> Instantly</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create short, memorable URLs and track clicks with ease. Perfect for sharing on social media or tracking campaigns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
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
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Create your account today and start shortening URLs.
            </p>
            <Link href="/signup">
              <Button size="lg">Create Account</Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Uplink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
