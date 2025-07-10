"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Cpu, Eye, EyeOff, Github, Chrome, Check } from "lucide-react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const passwordRequirements = [
    { test: (pwd) => pwd.length >= 8, text: "At least 8 characters" },
    { test: (pwd) => /[A-Z]/.test(pwd), text: "One uppercase letter" },
    { test: (pwd) => /[a-z]/.test(pwd), text: "One lowercase letter" },
    { test: (pwd) => /[0-9]/.test(pwd), text: "One number" },
  ];

  // Sri Lankan phone number validation (10 digits only)
  const isValidPhone = (phone) => {
    if (!phone) return true; // Phone is optional
    // Sri Lankan phone validation - exactly 10 digits, starting with 0
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      setError("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
      
      // Auto sign in the user after successful registration
      try {
        const signInResult = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false
        });
        
        if (signInResult?.ok) {
          // Redirect to home page or cart if they came from cart
          setTimeout(() => {
            const returnUrl = localStorage.getItem('returnUrl') || '/';
            localStorage.removeItem('returnUrl');
            router.push(returnUrl);
          }, 2000);
        } else {
          // If auto sign-in fails, redirect to sign-in page
          setTimeout(() => {
            router.push("/auth/signin");
          }, 2000);
        }
      } catch (error) {
        console.error('Auto sign-in failed:', error);
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-400/25">
            <Check className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Account Created!</h2>
          <p className="text-yellow-300/80 text-lg">
            Redirecting to sign in page...
          </p>
        </motion.div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-yellow-300/80">
              Join TechZone and start building
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-300 bg-red-500/20 border border-red-500/40 rounded-xl backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-yellow-300">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-black/60 border-2 border-yellow-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-white placeholder-gray-400"
              />
            </div>

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
              <label htmlFor="phone" className="block text-sm font-semibold text-yellow-300">Phone Number (Optional)</label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter Sri Lankan phone number (e.g., 0771234567)"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={`w-full px-4 py-3 bg-black/60 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-white placeholder-gray-400 ${
                  formData.phone && !isValidPhone(formData.phone) 
                    ? "border-red-500/60 focus:border-red-400" 
                    : "border-yellow-500/40 focus:border-yellow-400"
                }`}
                maxLength={10}
              />
              {formData.phone && !isValidPhone(formData.phone) && (
                <p className="text-xs text-red-400">Please enter a valid 10-digit Sri Lankan phone number starting with 0</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-yellow-300">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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
              
              {/* Password Requirements */}
              <div className="space-y-2 mt-3 p-3 bg-yellow-400/10 border border-yellow-500/30 rounded-xl">
                <p className="text-xs font-medium text-yellow-300 mb-2">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-2">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${
                        req.test(formData.password) ? 'bg-green-400' : 'bg-gray-500'
                      }`} />
                      <span className={
                        req.test(formData.password) ? 'text-green-400' : 'text-gray-400'
                      }>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-yellow-300">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-black/60 border-2 border-yellow-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-white placeholder-gray-400 pr-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
              {loading ? "Creating Account..." : "Create Account"}
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
                disabled={loading}
                className="flex items-center justify-center px-4 py-3 bg-black/60 border-2 border-yellow-500/40 rounded-xl text-white hover:bg-yellow-400/10 transition-all duration-200 disabled:opacity-50"
              >
                <Chrome className="w-4 h-4 mr-2 text-yellow-400" />
                Google
              </button>
              <button
                disabled={loading}
                className="flex items-center justify-center px-4 py-3 bg-black/60 border-2 border-yellow-500/40 rounded-xl text-white hover:bg-yellow-400/10 transition-all duration-200 disabled:opacity-50"
              >
                <Github className="w-4 h-4 mr-2 text-yellow-400" />
                GitHub
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
