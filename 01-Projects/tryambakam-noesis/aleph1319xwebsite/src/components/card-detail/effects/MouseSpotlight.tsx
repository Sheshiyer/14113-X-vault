import React, { useRef, useState, useCallback } from "react";
import styles from "./effects.module.css";

interface MouseSpotlightProps {
  color?: string;
  size?: number;
}

export const MouseSpotlight: React.FC<MouseSpotlightProps> = ({
  color = "rgba(255,255,255,0.06)",
  size = 400,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setPosition(null);
  }, []);

  const gradientStyle: React.CSSProperties = position
    ? {
        background: `radial-gradient(circle ${size}px at ${position.x}px ${position.y}px, ${color}, transparent)`,
      }
    : {};

  return (
    <div
      ref={containerRef}
      className={styles.mouseSpotlight}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...gradientStyle,
        pointerEvents: "auto",
      }}
    />
  );
};
