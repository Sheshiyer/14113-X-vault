"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type VisualizerMode = "bars" | "circle" | "wave" | "mandala";
export type ColorScheme = "biorhythm" | "frequency" | "sacred" | "ocean";

export interface VisualizerProps {
  analyser?: AnalyserNode | null;
  isPlaying?: boolean;
  mode?: VisualizerMode;
  colorScheme?: ColorScheme;
  className?: string;
  size?: number;
  beatSync?: 8 | 13 | 19;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  analyser,
  isPlaying = false,
  mode = "bars",
  colorScheme = "biorhythm",
  className,
  size = 300,
  beatSync = 8,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number | null>(null);
  const dataArrayRef = React.useRef<Uint8Array | null>(null);

  // Initialize data array
  React.useEffect(() => {
    if (analyser) {
      const bufferLength = analyser.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
    }
  }, [analyser]);

  // Get color based on scheme and value
  const getColor = React.useCallback(
    (value: number, index: number, total: number, isWave = false) => {
      const normalized = value / 255;

      switch (colorScheme) {
        case "biorhythm": {
          // Physical (red), Emotional (purple), Intellectual (blue)
          const cycle = index % 3;
          if (cycle === 0) {
            return `rgba(255, 107, 107, ${0.3 + normalized * 0.7})`; // octave - physical
          } else if (cycle === 1) {
            return `rgba(155, 89, 182, ${0.3 + normalized * 0.7})`; // transform - emotional
          }
          return `rgba(52, 152, 219, ${0.3 + normalized * 0.7})`; // witness - intellectual
        }

        case "frequency": {
          // Low freq = red, Mid = purple, High = gold
          const ratio = index / total;
          if (ratio < 0.33) {
            return `rgba(255, 107, 107, ${0.3 + normalized * 0.7})`;
          } else if (ratio < 0.66) {
            return `rgba(155, 89, 182, ${0.3 + normalized * 0.7})`;
          }
          return `rgba(241, 196, 15, ${0.3 + normalized * 0.7})`;
        }

        case "sacred": {
          // Golden ratio spiral coloring
          const hue = (index / total) * 360 * 1.618; // φ
          return `hsla(${hue % 360}, 70%, 60%, ${0.3 + normalized * 0.7})`;
        }

        case "ocean": {
          // Deep blues and teals
          const intensity = 0.3 + normalized * 0.7;
          return `rgba(26, 188, 156, ${intensity})`; // creative
        }

        default:
          return `rgba(255, 255, 255, ${0.3 + normalized * 0.7})`;
      }
    },
    [colorScheme]
  );

  // Draw bars visualization
  const drawBars = React.useCallback(
    (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, centerX: number, centerY: number) => {
      const barCount = 64; // Power of 2, close to 8*8
      const barWidth = (size / barCount) * 0.8;
      const gap = (size / barCount) * 0.2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * dataArray.length);
        const value = dataArray[dataIndex] || 0;
        const barHeight = (value / 255) * size * 0.4;

        const x = centerX - size / 2 + i * (barWidth + gap);
        const y = centerY - barHeight / 2;

        ctx.fillStyle = getColor(value, i, barCount);
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    },
    [size, getColor]
  );

  // Draw circle visualization (radial frequency display)
  const drawCircle = React.useCallback(
    (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, centerX: number, centerY: number) => {
      const radius = size * 0.3;
      const barCount = 44; // Power number
      const angleStep = (Math.PI * 2) / barCount;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * dataArray.length);
        const value = dataArray[dataIndex] || 0;
        const barHeight = (value / 255) * size * 0.25;

        const angle = i * angleStep - Math.PI / 2;
        const innerX = centerX + Math.cos(angle) * radius;
        const innerY = centerY + Math.sin(angle) * radius;
        const outerX = centerX + Math.cos(angle) * (radius + barHeight);
        const outerY = centerY + Math.sin(angle) * (radius + barHeight);

        ctx.beginPath();
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(outerX, outerY);
        ctx.strokeStyle = getColor(value, i, barCount);
        ctx.lineWidth = size / barCount * 0.5;
        ctx.stroke();
      }

      // Draw center glow
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const glowRadius = (average / 255) * radius * 0.5;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
      gradient.addColorStop(0, `rgba(255, 107, 107, ${average / 255})`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    },
    [size, getColor]
  );

  // Draw wave visualization (oscilloscope-style)
  const drawWave = React.useCallback(
    (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, centerX: number, centerY: number) => {
      const sliceWidth = size / dataArray.length;
      let x = centerX - size / 2;

      // Draw multiple waves with different phases
      const waves = [
        { amplitude: 0.3, speed: 1, color: "octave" },
        { amplitude: 0.2, speed: 1.618, color: "transform" },
        { amplitude: 0.15, speed: 2.058, color: "solar" },
      ];

      waves.forEach((wave, waveIndex) => {
        ctx.beginPath();
        ctx.lineWidth = 2;

        const time = Date.now() / 1000;
        const beatMultiplier = beatSync / 8;

        for (let i = 0; i < dataArray.length; i++) {
          const value = dataArray[i] || 0;
          const normalized = value / 255;

          // Oscilloscope formula with beat sync
          const y = centerY + 
            Math.sin((i / dataArray.length) * Math.PI * wave.speed * beatMultiplier + time * beatMultiplier) * 
            normalized * size * wave.amplitude;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x + i * sliceWidth, y);
          }
        }

        ctx.strokeStyle = getColor(128 + waveIndex * 50, waveIndex, waves.length, true);
        ctx.stroke();
      });

      // Draw center line
      ctx.beginPath();
      ctx.moveTo(centerX - size / 2, centerY);
      ctx.lineTo(centerX + size / 2, centerY);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();
    },
    [size, beatSync, getColor]
  );

  // Draw mandala visualization (sacred geometry patterns)
  const drawMandala = React.useCallback(
    (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, centerX: number, centerY: number) => {
      const time = Date.now() / 1000;
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const normalizedAverage = average / 255;

      // Number of petals based on beat sync
      const petals = beatSync;
      const rings = 5;

      // Draw rotating rings
      for (let ring = 0; ring < rings; ring++) {
        const baseRadius = size * 0.1 * (ring + 1);
        const rotation = time * (ring % 2 === 0 ? 1 : -1) * (beatSync / 44);
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);

        ctx.beginPath();
        for (let i = 0; i <= petals * 4; i++) {
          const angle = (i / (petals * 4)) * Math.PI * 2;
          const dataIndex = Math.floor((i / (petals * 4)) * dataArray.length);
          const value = dataArray[dataIndex] || 0;
          const amplitude = (value / 255) * size * 0.08;

          // Sacred geometry: flower of life pattern
          const r = baseRadius + amplitude * Math.sin(angle * petals);
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        ctx.strokeStyle = getColor(average, ring, rings);
        ctx.lineWidth = 1 + normalizedAverage * 2;
        ctx.stroke();

        // Fill with gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius);
        gradient.addColorStop(0, getColor(average, ring, rings).replace(/[\d.]+\)$/, "0.1)"));
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.restore();
      }

      // Draw center sacred symbol
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * beatSync / 13);

      const symbolSize = size * 0.05 * (1 + normalizedAverage);
      ctx.beginPath();
      for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2;
        const x = Math.cos(angle) * symbolSize;
        const y = Math.sin(angle) * symbolSize;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = getColor(average, 0, 1);
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    },
    [size, beatSync, getColor]
  );

  // Main animation loop
  const animate = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    if (analyser && dataArrayRef.current && isPlaying) {
      analyser.getByteFrequencyData(dataArrayRef.current as any);

      switch (mode) {
        case "bars":
          drawBars(ctx, dataArrayRef.current, centerX, centerY);
          break;
        case "circle":
          drawCircle(ctx, dataArrayRef.current, centerX, centerY);
          break;
        case "wave":
          drawWave(ctx, dataArrayRef.current, centerX, centerY);
          break;
        case "mandala":
          drawMandala(ctx, dataArrayRef.current, centerX, centerY);
          break;
      }
    } else {
      // Draw idle state
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.1, 0, Math.PI * 2);
      ctx.stroke();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [analyser, isPlaying, mode, drawBars, drawCircle, drawWave, drawMandala, size]);

  // Start/stop animation
  React.useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-full"
      />
      
      {/* Subtle glow effect */}
      {isPlaying && (
        <div
          className={cn(
            "absolute inset-0 rounded-full opacity-30 animate-pulse-13 pointer-events-none",
            colorScheme === "biorhythm" && "bg-gradient-to-br from-octave/20 via-transform/20 to-witness/20",
            colorScheme === "frequency" && "bg-gradient-to-br from-octave/20 via-transform/20 to-solar/20",
            colorScheme === "sacred" && "bg-gradient-to-br from-transform/20 via-solar/20 to-creative/20",
            colorScheme === "ocean" && "bg-creative/20"
          )}
        />
      )}
    </div>
  );
};

export default Visualizer;
