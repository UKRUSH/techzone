"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Cpu, Eye, EyeOff, Github, Chrome } from "lucide-react";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        // Check for return URL or default to home
        const returnUrl = localStorage.getItem('returnUrl') || '/';
        localStorage.removeItem('returnUrl');
        router.push(returnUrl);
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      setError("An error occurred with social login.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-2xl shadow-yellow-400/25">
              <Cpu className="w-7 h-7 text-black" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">TechZone</span>
          </Link>
        </div>

        <div className="bg-gradient-to-br from-gray-900/95 via-black/98 to-gray-900/95 backdrop-blur-sm border-2 border-yellow-500/40 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-yellow-300/80">
              Sign in to your TechZone account
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-300 bg-red-500/20 border border-red-500/40 rounded-xl backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-yellow-300">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-black/60 border-2 border-yellow-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-white placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-yellow-300">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-black/60 border-2 border-yellow-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-white placeholder-gray-400 pr-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-yellow-500/30"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gradient-to-r from-gray-900 to-black px-4 text-yellow-300/70">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => handleOAuthSignIn("google")}
                disabled={loading}
                className="flex items-center justify-center px-4 py-3 bg-black/60 border-2 border-yellow-500/40 rounded-xl text-white hover:bg-yellow-400/10 transition-all duration-200 disabled:opacity-50"
              >
                <Chrome className="w-4 h-4 mr-2 text-yellow-400" />
                Google
              </button>
              <button
                onClick={() => handleOAuthSignIn("github")}
                disabled={loading}
                className="flex items-center justify-center px-4 py-3 bg-black/60 border-2 border-yellow-500/40 rounded-xl text-white hover:bg-yellow-400/10 transition-all duration-200 disabled:opacity-50"
              >
                <Github className="w-4 h-4 mr-2 text-yellow-400" />
                GitHub
              </button>
            </div>
          </div>

          <div className="mt-8 text-center space-y-4">
            <Link
              href="/auth/forgot-password"
              className="block text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium"
            >
              Forgot your password?
            </Link>
            
            <div className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
