import React from "react";
import styles from "./effects.module.css";

interface TraversingGlitchProps {
  speed?: number;
  color?: string;
  height?: number;
}

export const TraversingGlitch: React.FC<TraversingGlitchProps> = ({
  speed = 8,
  color = "rgba(255,255,255,0.04)",
  height = 2,
}) => {
  const inlineStyle: React.CSSProperties = {
    height: `${height}px`,
    background: color,
    ["--traverse-speed" as string]: `${speed}s`,
  };

  return <div className={styles.traversingGlitch} style={inlineStyle} />;
};
