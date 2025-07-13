"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { Sparkles, Store, Users } from "lucide-react";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) {
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-magic-accent/20 to-magic-secondary/30 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6 animate-magic-float">
            <div className="inline-block p-4 rounded-full bg-gradient-to-br from-magic-primary to-magic-secondary shadow-lg">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-magic-primary to-magic-secondary bg-clip-text text-transparent">
              StoreGenie
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose how you&amp;apos;d like to get started
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Seller Login */}
          <Card className="bg-card/80 backdrop-blur-sm border-magic-accent hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mb-4 p-3 rounded-full bg-magic-accent/50 w-fit mx-auto">
                <Store className="h-8 w-8 text-magic-primary" />
              </div>
              <CardTitle className="text-2xl text-foreground">
                I&apos;m a Seller
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Create and manage your magical storefront
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Upload and showcase your products</li>
                <li>• Get AI-generated descriptions</li>
                <li>• Manage inventory and orders</li>
                <li>• Connect with customers</li>
              </ul>
              <Button
                onClick={handleGoogleLogin}
                className="w-full bg-gradient-to-r from-magic-primary to-magic-secondary hover:from-magic-primary/90 hover:to-magic-secondary/90 text-white"
                size="lg"
              >
                <Store className="mr-2 h-4 w-4" />
                Sign in as Seller
              </Button>
            </CardContent>
          </Card>

          {/* Buyer Login */}
          <Card className="bg-card/80 backdrop-blur-sm border-magic-accent hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mb-4 p-3 rounded-full bg-magic-accent/50 w-fit mx-auto">
                <Users className="h-8 w-8 text-magic-primary" />
              </div>
              <CardTitle className="text-2xl text-foreground">
                I&apos;m a Buyer
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Discover and shop unique handmade items
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Browse beautiful storefronts</li>
                <li>• Reserve unique products</li>
                <li>• Request custom creations</li>
                <li>• Connect with artists</li>
              </ul>
              <p className="text-xs text-muted-foreground text-center pt-8">
                Or browse stores without signing in
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
