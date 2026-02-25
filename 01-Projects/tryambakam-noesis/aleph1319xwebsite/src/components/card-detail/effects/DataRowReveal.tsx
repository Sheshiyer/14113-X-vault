import React, { useState, useRef, useCallback, useEffect } from "react";
import styles from "./effects.module.css";

interface DataRowItem {
  readonly label: string;
  readonly value: string;
}

interface DataRowRevealProps {
  rows: readonly DataRowItem[];
  triggerLabel?: string;
}

export const DataRowReveal: React.FC<DataRowRevealProps> = ({
  rows,
  triggerLabel = "Details",
}) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [rows]);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const iconClassName = open
    ? `${styles.dataRowTriggerIcon} ${styles.dataRowTriggerIconOpen}`
    : styles.dataRowTriggerIcon;

  const contentStyle: React.CSSProperties = {
    height: open ? `${contentHeight}px` : "0px",
  };

  return (
    <div className={styles.dataRowReveal}>
      <div className={styles.dataRowTrigger} onClick={toggle}>
        <span className={styles.dataRowTriggerLabel}>{triggerLabel}</span>
        <span className={iconClassName}>+</span>
      </div>
      <div
        ref={contentRef}
        className={styles.dataRowContent}
        style={contentStyle}
      >
        {rows.map((row, index) => (
          <div key={index} className={styles.dataRow}>
            <span className={styles.dataRowLabel}>{row.label}</span>
            <span className={styles.dataRowValue}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
