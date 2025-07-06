"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Animated Background Particles Component
export function AnimatedParticles({ count = 15, className = "" }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = [...Array(count)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 4,
      size: 1 + Math.random() * 2
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-yellow-400/30 rounded-full animate-float"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </div>
  );
}

// Circuit Pattern Background
export function CircuitPattern({ className = "", opacity = 0.05 }) {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ opacity }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10,0 L10,20 M0,10 L20,10" stroke="#facc15" strokeWidth="0.3" fill="none" />
            <circle cx="10" cy="10" r="1" fill="#facc15" opacity="0.4" />
            <circle cx="5" cy="5" r="0.5" fill="#facc15" opacity="0.6" />
            <circle cx="15" cy="15" r="0.5" fill="#facc15" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
    </div>
  );
}

// Scanning Lines Effect
export function ScanningLines({ lines = 3, className = "" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden opacity-20 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="absolute h-px w-full bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent animate-scanline"
          style={{
            top: `${20 + (i * 30)}%`,
            animationDelay: `${i * 2}s`
          }}
        />
      ))}
    </div>
  );
}

// Glowing Orbs Background
export function GlowingOrbs({ count = 3, className = "" }) {
  const orbs = [
    { size: 96, position: "top-0 right-0", color: "from-yellow-400/20 to-yellow-600/10", animation: "animate-pulse-slow" },
    { size: 80, position: "top-1/3 left-0", color: "from-yellow-500/15 to-yellow-400/5", animation: "animate-pulse-slower" },
    { size: 72, position: "bottom-16 right-16", color: "from-yellow-300/20 to-yellow-500/10", animation: "animate-pulse-slow" }
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {orbs.slice(0, count).map((orb, i) => (
        <div
          key={i}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${orb.color} blur-3xl ${orb.animation} ${orb.position}`}
          style={{
            width: `${orb.size * 4}px`,
            height: `${orb.size * 4}px`
          }}
        />
      ))}
    </div>
  );
}

// Tech Corner Accents
export function TechCornerAccents({ className = "", size = "w-8 h-8" }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div className={`absolute top-2 left-2 ${size} border-l-2 border-t-2 border-yellow-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className={`absolute top-2 right-2 ${size} border-r-2 border-t-2 border-yellow-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className={`absolute bottom-2 left-2 ${size} border-l-2 border-b-2 border-yellow-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className={`absolute bottom-2 right-2 ${size} border-r-2 border-b-2 border-yellow-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    </div>
  );
}

// Enhanced Card Glow Effect
export function CardGlowEffect({ className = "", intensity = "low" }) {
  const intensityClasses = {
    low: "from-yellow-400/0 via-yellow-400/5 to-yellow-400/0",
    medium: "from-yellow-400/5 via-yellow-400/10 to-yellow-400/5",
    high: "from-yellow-400/10 via-yellow-400/20 to-yellow-400/10"
  };

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${intensityClasses[intensity]} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl ${className}`} />
  );
}

// Animated Border Glow
export function AnimatedBorderGlow({ className = "" }) {
  return (
    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400/20 via-transparent to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${className}`} />
  );
}

// Matrix Rain Effect (Subtle)
export function MatrixRain({ density = 5, className = "" }) {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    const newDrops = [...Array(density)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 5,
      char: String.fromCharCode(33 + Math.random() * 94)
    }));
    setDrops(newDrops);
  }, [density]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute text-yellow-400/10 text-xs font-mono animate-matrix-rain"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`
          }}
        >
          {drop.char}
        </div>
      ))}
    </div>
  );
}

// Holographic Effect
export function HolographicEffect({ children, className = "" }) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{
        scale: 1.02,
        rotateY: 2,
        rotateX: 1,
      }}
      transition={{ duration: 0.3 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      {children}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}

// Energy Pulse Effect
export function EnergyPulse({ className = "" }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 animate-energy-pulse" />
    </div>
  );
}

// Tech Grid Overlay
export function TechGridOverlay({ spacing = 50, className = "" }) {
  return (
    <div 
      className={`absolute inset-0 opacity-10 ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 239, 0, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 239, 0, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: `${spacing}px ${spacing}px`,
        animation: 'grid-move 20s linear infinite'
      }}
    />
  );
}

// Holographic Card Overlay
export function HolographicOverlay({ className = "", intensity = "medium" }) {
  const intensityClasses = {
    low: "opacity-20",
    medium: "opacity-30", 
    high: "opacity-40"
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Rainbow gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-red-500/10 via-yellow-500/15 via-green-500/10 via-blue-500/15 via-purple-500/10 to-pink-500/15 ${intensityClasses[intensity]} group-hover:opacity-60 transition-opacity duration-700`} />
      
      {/* Holographic shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Prismatic reflections */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-80 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-purple-400 via-blue-400 via-green-400 via-yellow-400 to-red-400 opacity-0 group-hover:opacity-80 transition-opacity duration-500 delay-200" />
    </div>
  );
}

// Cyber Grid Lines
export function CyberGridLines({ className = "" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Vertical lines */}
      <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute right-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
      
      {/* Horizontal lines */}
      <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
      <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300" />
      
      {/* Intersection points */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-500 animate-ping" />
      <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-cyan-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-600 animate-ping" />
    </div>
  );
}

// Floating Price Particles
export function FloatingPriceParticles({ savings, className = "" }) {
  const particles = [
    { symbol: "$", delay: 0, x: 20, y: -10, color: "text-green-400" },
    { symbol: "%", delay: 0.5, x: -15, y: -20, color: "text-yellow-400" },
    { symbol: "💰", delay: 1, x: 10, y: -30, color: "text-orange-400" },
    { symbol: "🔥", delay: 1.5, x: -20, y: -15, color: "text-red-400" }
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle, i) => (
        <div
          key={i}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${particle.color} font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-500`}
          style={{
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            animationDelay: `${particle.delay}s`
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            transition={{ 
              duration: 1.5, 
              delay: particle.delay,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="animate-float"
          >
            {particle.symbol}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// Digital Glitch Effect
export function DigitalGlitch({ text, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 text-red-400 opacity-0 group-hover:opacity-30 transition-opacity duration-200" 
            style={{ transform: 'translate(-1px, -1px)' }}>
        {text}
      </span>
      <span className="absolute top-0 left-0 text-blue-400 opacity-0 group-hover:opacity-30 transition-opacity duration-200 delay-100" 
            style={{ transform: 'translate(1px, 1px)' }}>
        {text}
      </span>
    </div>
  );
}

// Neon Glow Border
export function NeonGlowBorder({ color = "red", intensity = "medium", className = "" }) {
  const colorClasses = {
    red: "shadow-red-500/50 border-red-500/50",
    yellow: "shadow-yellow-500/50 border-yellow-500/50",
    orange: "shadow-orange-500/50 border-orange-500/50",
    green: "shadow-green-500/50 border-green-500/50",
    blue: "shadow-blue-500/50 border-blue-500/50",
    purple: "shadow-purple-500/50 border-purple-500/50"
  };

  const intensityClasses = {
    low: "shadow-lg",
    medium: "shadow-xl", 
    high: "shadow-2xl"
  };

  return (
    <div className={`absolute inset-0 rounded-lg border-2 ${colorClasses[color]} ${intensityClasses[intensity]} opacity-0 group-hover:opacity-100 transition-all duration-500 ${className}`} />
  );
}

// Interactive Icon Burst
export function IconBurst({ icons = ["⚡", "💎", "🚀", "⭐"], className = "" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {icons.map((icon, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500"
          style={{
            transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-40px)`,
            transitionDelay: `${i * 100}ms`
          }}
        >
          <motion.span
            className="text-2xl"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ 
              duration: 0.8, 
              delay: i * 0.1,
              type: "spring",
              stiffness: 300
            }}
          >
            {icon}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

// Prismatic Border Effect
export function PrismaticBorder({ className = "" }) {
  return (
    <div className={`absolute inset-0 rounded-lg overflow-hidden ${className}`}>
      {/* Animated rainbow border */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-px rounded-lg">
        <div className="w-full h-full bg-zinc-900 rounded-lg" />
      </div>
      
      {/* Corner sparkles */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 animate-ping" />
      <div className="absolute top-1 right-1 w-2 h-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-400 animate-ping" />
      <div className="absolute bottom-1 left-1 w-2 h-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-600 animate-ping" />
      <div className="absolute bottom-1 right-1 w-2 h-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-800 animate-ping" />
    </div>
  );
}
