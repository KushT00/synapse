/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"


const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter(); // Correct usage
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || (!isLogin && !name)) {
      toast.error("Please fill in all fields");
      return;
    }

    // Demo authentication - in a real app, you would connect to your backend
    toast.success(isLogin ? "Logged in successfully!" : "Account created successfully!");

    // Redirect to home page after successful auth
    setTimeout(() => {
      router.push("/"); // Correct way to navigate in Next.js
    }, 1500);
  };



  const handleGoogleAuth = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile`, // Redirect directly to home
      },
    });

    if (error) {
      toast.error("Google Auth failed");
      console.error("Auth error:", error);
      setLoading(false);
    } else {
      toast.success("Redirecting to Google...");
      // Loading will be handled by the auth state change
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-primary/5 items-center justify-center">
        <div className="max-w-md p-8">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW5zfGVufDB8fDB8fHww"
            alt="Cloud Storage"
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <h2 className="mt-6 text-2xl font-semibold text-center text-foreground">
            Cloud Basket
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Store, share, and access your files from anywhere.
          </p>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fadeIn">
          <div className="text-center">
            <h1 className="text-3xl font-bold">{isLogin ? "Welcome back" : "Create an account"}</h1>
            <p className="mt-2 text-muted-foreground">
              {isLogin ? "Sign in to access your files" : "Sign up to start storing your files"}
            </p>
          </div>

          {/* Google Auth Button */}
          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleAuth}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              {isLogin ? (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Sign in
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Create account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button
                variant="link"
                className="ml-1 p-0"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;