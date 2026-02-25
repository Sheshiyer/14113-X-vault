import React from "react";
import styles from "./effects.module.css";

interface ScanlineVariantProps {
  direction?: "horizontal" | "vertical" | "diagonal";
  opacity?: number;
}

const DIRECTION_ANGLE: Record<string, string> = {
  horizontal: "0deg",
  vertical: "90deg",
  diagonal: "45deg",
};

export const ScanlineVariant: React.FC<ScanlineVariantProps> = ({
  direction = "horizontal",
  opacity = 0.03,
}) => {
  const angle = DIRECTION_ANGLE[direction];
  const lineColor = `rgba(255,255,255,${opacity})`;

  const inlineStyle: React.CSSProperties = {
    background: `repeating-linear-gradient(${angle}, ${lineColor} 0px, ${lineColor} 1px, transparent 1px, transparent 4px)`,
  };

  return <div className={styles.scanlineVariant} style={inlineStyle} />;
};
