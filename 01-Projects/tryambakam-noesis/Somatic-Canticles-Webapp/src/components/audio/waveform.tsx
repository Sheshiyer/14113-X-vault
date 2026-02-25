"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type WaveformColorMode = "default" | "frequency" | "biorhythm";

export interface WaveformProps {
  data?: number[];
  progress?: number;
  isPlaying?: boolean;
  colorMode?: WaveformColorMode;
  onSeek?: (progress: number) => void;
  className?: string;
  height?: number;
  barWidth?: number;
  barGap?: number;
  animate?: boolean;
  // For frequency-based coloring
  bassIntensity?: number;
  voiceIntensity?: number;
  bellIntensity?: number;
}

export const Waveform: React.FC<WaveformProps> = ({
  data,
  progress = 0,
  isPlaying = false,
  colorMode = "default",
  onSeek,
  className,
  height = 80,
  barWidth = 3,
  barGap = 2,
  animate = true,
  bassIntensity = 0,
  voiceIntensity = 0,
  bellIntensity = 0,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef<number | null>(null);
  const [canvasWidth, setCanvasWidth] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  // Generate default waveform data if not provided
  const waveformData = React.useMemo(() => {
    if (data && data.length > 0) return data;
    
    // Generate synthetic waveform data with power-number patterns
    const length = 144; // 8 * 18 - power number multiple
    return Array.from({ length }, (_, i) => {
      // Create varied amplitude pattern using golden ratio
      const phi = 1.618;
      const base = Math.sin(i / 8) * 0.5 + 0.5;
      const variation = Math.sin(i / 13) * 0.3;
      const detail = Math.sin(i / 21) * 0.2;
      return Math.max(0.1, Math.min(1, base + variation + detail));
    });
  }, [data]);

  // Calculate responsive width
  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Get color for a specific bar based on color mode and position
  const getBarColor = React.useCallback(
    (index: number, total: number, amplitude: number, isPlayed: boolean) => {
      if (!isPlayed) {
        return "rgba(161, 161, 170, 0.3)"; // text-muted with opacity
      }

      switch (colorMode) {
        case "frequency": {
          // Map frequency ranges to colors
          // Bass = red (octave), Voice = purple (transform), Bells = gold (solar)
          const position = index / total;
          
          if (bassIntensity > 0.5 && position < 0.3) {
            return `rgba(255, 107, 107, ${0.5 + amplitude * 0.5})`; // octave
          } else if (voiceIntensity > 0.5 && position >= 0.3 && position < 0.7) {
            return `rgba(155, 89, 182, ${0.5 + amplitude * 0.5})`; // transform
          } else if (bellIntensity > 0.5 && position >= 0.7) {
            return `rgba(241, 196, 15, ${0.5 + amplitude * 0.5})`; // solar
          }
          return `rgba(52, 152, 219, ${0.5 + amplitude * 0.5})`; // witness (default)
        }

        case "biorhythm": {
          // Color based on biorhythm cycles (physical, emotional, intellectual)
          const cycle = index % 3;
          const colors = [
            `rgba(255, 107, 107, ${0.5 + amplitude * 0.5})`, // physical - octave
            `rgba(155, 89, 182, ${0.5 + amplitude * 0.5})`, // emotional - transform
            `rgba(52, 152, 219, ${0.5 + amplitude * 0.5})`, // intellectual - witness
          ];
          return colors[cycle];
        }

        default: {
          // Gradient from octave to solar
          const gradientPosition = index / total;
          if (gradientPosition < 0.5) {
            return `rgba(255, 107, 107, ${0.5 + amplitude * 0.5})`;
          }
          return `rgba(241, 196, 15, ${0.5 + amplitude * 0.5})`;
        }
      }
    },
    [colorMode, bassIntensity, voiceIntensity, bellIntensity]
  );

  // Draw waveform on canvas
  const drawWaveform = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const totalBars = Math.floor(canvasWidth / (barWidth + barGap));
    const playedBars = Math.floor(totalBars * progress);
    const centerY = canvas.height / 2;

    // Draw each bar
    for (let i = 0; i < totalBars; i++) {
      // Map bar index to data index
      const dataIndex = Math.floor((i / totalBars) * waveformData.length);
      const amplitude = waveformData[Math.min(dataIndex, waveformData.length - 1)];
      
      // Apply animation if playing
      let animatedAmplitude = amplitude;
      if (animate && isPlaying) {
        const time = Date.now() / 1000;
        const wave = Math.sin(time * 8 + i * 0.1) * 0.1; // 8-beat pulse
        animatedAmplitude = Math.max(0.1, Math.min(1, amplitude + wave));
      }

      const barHeight = animatedAmplitude * canvas.height * 0.9;
      const x = i * (barWidth + barGap);
      const isPlayed = i <= playedBars;

      // Set bar color
      ctx.fillStyle = getBarColor(i, totalBars, animatedAmplitude, isPlayed);

      // Draw rounded bar
      const radius = barWidth / 2;
      ctx.beginPath();
      ctx.roundRect(
        x,
        centerY - barHeight / 2,
        barWidth,
        barHeight,
        [radius, radius, radius, radius]
      );
      ctx.fill();

      // Add glow effect for played bars
      if (isPlayed && animate && isPlaying) {
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Draw progress line
    const progressX = playedBars * (barWidth + barGap);
    ctx.beginPath();
    ctx.moveTo(progressX, 0);
    ctx.lineTo(progressX, canvas.height);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw progress handle
    ctx.beginPath();
    ctx.arc(progressX, centerY, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [
    canvasWidth,
    waveformData,
    progress,
    animate,
    isPlaying,
    barWidth,
    barGap,
    height,
    getBarColor,
  ]);

  // Animation loop
  React.useEffect(() => {
    const animate = () => {
      drawWaveform();
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying && animate) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      drawWaveform();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawWaveform, isPlaying, animate]);

  // Initial draw and resize handler
  React.useEffect(() => {
    drawWaveform();
  }, [drawWaveform, canvasWidth]);

  // Handle click/touch for seeking
  const handleSeek = React.useCallback(
    (clientX: number) => {
      if (!containerRef.current || !onSeek) return;
      const rect = containerRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onSeek(percent);
    },
    [onSeek]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeek(e.clientX);
  };

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        handleSeek(e.clientX);
      }
    },
    [isDragging, handleSeek]
  );

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouch = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleSeek(touch.clientX);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full cursor-pointer select-none",
        isDragging && "cursor-grabbing",
        className
      )}
      style={{ height }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={height}
        className="block"
      />
      
      {/* Hover tooltip */}
      {!isDragging && onSeek && (
        <div className="absolute inset-0 bg-transparent" />
      )}
    </div>
  );
};

export default Waveform;
