import React from "react";
import styles from "./effects.module.css";

interface GlassmorphismPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassmorphismPanel: React.FC<GlassmorphismPanelProps> = ({
  children,
  className,
}) => {
  const combinedClassName = className
    ? `${styles.glassmorphismPanel} ${className}`
    : styles.glassmorphismPanel;

  return <div className={combinedClassName}>{children}</div>;
};
