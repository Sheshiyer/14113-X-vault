"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  showBiorhythmWheel?: boolean;
}

// Animated Biorhythm Wheel Component
const BiorhythmWheel: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Outer rotating ring - Physical cycle (23 days) */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[600px] h-[600px] rounded-full",
          "border border-octave/20"
        )}
        style={{
          animation: "spin 23s linear infinite",
        }}
      >
        {/* Markers */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[8px] h-[8px] rounded-full bg-octave/30"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 45}deg) translateX(300px) translateY(-50%)`,
            }}
          />
        ))}
      </div>

      {/* Middle rotating ring - Emotional cycle (28 days) */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[440px] h-[440px] rounded-full",
          "border border-transform/20"
        )}
        style={{
          animation: "spin 28s linear infinite reverse",
        }}
      >
        {[...Array(13)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[6px] h-[6px] rounded-full bg-transform/30"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * (360 / 13)}deg) translateX(220px) translateY(-50%)`,
            }}
          />
        ))}
      </div>

      {/* Inner rotating ring - Intellectual cycle (33 days) */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[280px] h-[280px] rounded-full",
          "border border-architect/20"
        )}
        style={{
          animation: "spin 33s linear infinite",
        }}
      >
        {[...Array(19)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[4px] h-[4px] rounded-full bg-architect/30"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * (360 / 19)}deg) translateX(140px) translateY(-50%)`,
            }}
          />
        ))}
      </div>

      {/* Center static ring - Spiritual (unity) */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[152px] h-[152px] rounded-full",
          "border-2 border-unity/20"
        )}
      >
        {/* Pulsing center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full bg-unity/10"
          style={{
            animation: "pulse 8s ease-in-out infinite",
          }}
        />
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface/0 via-surface/50 to-surface/80" />

      <style jsx>{`
        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

// Particle field for background
const ParticleField: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Power number inspired particle count
    const particleCount = 44;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = [
      "#FF6B6B", // octave
      "#9B59B6", // transform
      "#3498DB", // architect
      "#1ABC9C", // unity
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
      });

      // Draw connections
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = "#3498DB";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = "Welcome to Somatic Canticles",
  subtitle = "Your body's rhythm unlocks the chapters within",
  className,
  showBiorhythmWheel = true,
}) => {
  return (
    <div
      className={cn(
        "min-h-screen w-full relative flex items-center justify-center",
        "bg-surface",
        className
      )}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient */}
        <div
          className={cn(
            "absolute -top-1/2 -left-1/2 w-[200%] h-[200%]",
            "bg-gradient-to-br from-octave/5 via-surface to-architect/5",
            "animate-pulse"
          )}
          style={{ animationDuration: "13s" }}
        />

        {/* Secondary gradient accent */}
        <div
          className={cn(
            "absolute top-0 right-0 w-[800px] h-[800px]",
            "bg-gradient-to-bl from-transform/5 via-transparent to-transparent",
            "rounded-full blur-[100px]"
          )}
        />

        {/* Bottom accent */}
        <div
          className={cn(
            "absolute bottom-0 left-0 w-[600px] h-[600px]",
            "bg-gradient-to-tr from-unity/5 via-transparent to-transparent",
            "rounded-full blur-[80px]"
          )}
        />
      </div>

      {/* Particle Field */}
      <ParticleField />

      {/* Biorhythm Wheel Decoration */}
      {showBiorhythmWheel && <BiorhythmWheel />}

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[440px] mx-[21px]">
        {/* Logo / Brand Header */}
        <div className="text-center mb-[44px]">
          {/* Logo Icon */}
          <div className="inline-flex items-center justify-center mb-[21px]">
            <div className="relative w-[72px] h-[72px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-octave via-transform to-architect opacity-80 animate-pulse" style={{ animationDuration: "8s" }} />
              <div className="absolute inset-[4px] rounded-full bg-surface flex items-center justify-center">
                <span className="text-[28px] font-bold bg-gradient-to-r from-octave to-architect bg-clip-text text-transparent">
                  SC
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-[28px] sm:text-[32px] font-bold text-text mb-[13px]">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] text-text-muted leading-[1.618]">
            {subtitle}
          </p>
        </div>

        {/* Card Container */}
        <div
          className={cn(
            "relative bg-surface-elevated/80 backdrop-blur-[13px]",
            "rounded-[21px] border border-surface-elevated/50",
            "shadow-[0_8px_44px_rgba(0,0,0,0.3)]",
            "p-[32px] sm:p-[44px]"
          )}
        >
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-[44px] h-[44px] border-t-2 border-l-2 border-octave/30 rounded-tl-[21px]" />
          <div className="absolute top-0 right-0 w-[44px] h-[44px] border-t-2 border-r-2 border-architect/30 rounded-tr-[21px]" />
          <div className="absolute bottom-0 left-0 w-[44px] h-[44px] border-b-2 border-l-2 border-transform/30 rounded-bl-[21px]" />
          <div className="absolute bottom-0 right-0 w-[44px] h-[44px] border-b-2 border-r-2 border-unity/30 rounded-br-[21px]" />

          {/* Content */}
          <div className="relative">{children}</div>
        </div>

        {/* Footer Links */}
        <div className="mt-[44px] text-center">
          <div className="flex items-center justify-center gap-[21px] text-[13px] text-text-muted">
            <a
              href="#"
              className="hover:text-text transition-colors duration-8"
            >
              Privacy Policy
            </a>
            <span className="text-surface-elevated">·</span>
            <a
              href="#"
              className="hover:text-text transition-colors duration-8"
            >
              Terms of Service
            </a>
            <span className="text-surface-elevated">·</span>
            <a
              href="#"
              className="hover:text-text transition-colors duration-8"
            >
              Help
            </a>
          </div>

          {/* Power number hint */}
          <p className="mt-[21px] text-[13px] text-text-muted/50">
            8 · 13 · 19 · 21 · 44 · 125 · 152
          </p>
        </div>
      </div>
    </div>
  );
};

AuthLayout.displayName = "AuthLayout";
