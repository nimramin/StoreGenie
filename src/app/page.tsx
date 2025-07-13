import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { Sparkles, Store, Wand2, Users } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-magic-accent/20 to-magic-secondary/30">
      <header className="w-full p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-magic-primary to-magic-secondary animate-magic-glow">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              StoreGenie
            </span>
          </div>
          {user ? (
            <form action="/api/auth/logout" method="post">
              <Button
                type="submit"
                variant="outline"
                className="border-magic-primary text-magic-primary hover:bg-magic-primary hover:text-white"
              >
                Sign Out
              </Button>
            </form>
          ) : (
            <Button
              asChild
              className="bg-magic-primary hover:bg-magic-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/login">Sign in with Google</Link>
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center mb-16">
          <div className="mb-8 animate-magic-float">
            <div className="inline-block p-4 rounded-full bg-gradient-to-br from-magic-primary to-magic-secondary shadow-lg">
              <Wand2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Launch Your
            <span className="bg-gradient-to-r from-magic-primary to-magic-secondary bg-clip-text text-transparent">
              {" "}
              Dream Store{" "}
            </span>
            in Minutes
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            No tech skills needed. Upload your products, get AI-powered
            descriptions, and share your beautiful storefront with the world.
          </p>

          <Button
            size="lg"
            asChild
            className="bg-gradient-to-r from-magic-primary to-magic-secondary hover:from-magic-primary/90 hover:to-magic-secondary/90 text-white text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Link href="/login">
              <Sparkles className="mr-2 h-5 w-5" />
              Let’s Launch Your Magic
            </Link>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card/80 backdrop-blur-sm border-magic-accent hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="mb-4 p-3 rounded-full bg-magic-accent/50 w-fit mx-auto">
                <Store className="h-8 w-8 text-magic-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Instant Storefront
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Get a beautiful, personalized store page with your unique URL in
                seconds.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-magic-accent hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="mb-4 p-3 rounded-full bg-magic-accent/50 w-fit mx-auto">
                <Wand2 className="h-8 w-8 text-magic-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                AI Magic
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Upload product photos and let AI generate compelling
                descriptions and tags.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-magic-accent hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="mb-4 p-3 rounded-full bg-magic-accent/50 w-fit mx-auto">
                <Users className="h-8 w-8 text-magic-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Connect with Buyers
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Accept reservations and custom requests directly from your
                storefront.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-magic-primary/10 to-magic-secondary/10 rounded-3xl p-12 border border-magic-accent">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Make Magic Happen?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join artists, crafters, and creators who&apos;ve already launched
            their dream stores with StoreGenie.
          </p>

          <Button
            size="lg"
            asChild
            className="bg-gradient-to-r from-magic-primary to-magic-secondary hover:from-magic-primary/90 hover:to-magic-secondary/90 text-white text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Link href="/login">
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started for Free
            </Link>
          </Button>
        </div>
      </main>
      <footer className="py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} StoreGenie. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
