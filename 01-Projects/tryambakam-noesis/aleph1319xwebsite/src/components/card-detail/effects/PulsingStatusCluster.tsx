import React from "react";
import styles from "./effects.module.css";

interface StatusItem {
  readonly label: string;
  readonly color: string;
  readonly active?: boolean;
}

interface PulsingStatusClusterProps {
  items: readonly StatusItem[];
  layout?: "horizontal" | "vertical";
}

export const PulsingStatusCluster: React.FC<PulsingStatusClusterProps> = ({
  items,
  layout = "horizontal",
}) => {
  const clusterClassName =
    layout === "vertical"
      ? `${styles.statusCluster} ${styles.statusClusterVertical}`
      : styles.statusCluster;

  return (
    <div className={clusterClassName}>
      {items.map((item, index) => {
        const dotClassName = item.active
          ? `${styles.statusDot} ${styles.statusDotActive}`
          : styles.statusDot;

        const dotStyle: React.CSSProperties = {
          background: item.color,
          ...(item.active ? { boxShadow: `0 0 10px ${item.color}` } : {}),
        };

        return (
          <div key={index} className={styles.statusItem}>
            <span className={dotClassName} style={dotStyle} />
            <span className={styles.statusLabel}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};
