import sharedStyles from "./shared.module.css";

interface KeyInsightProps {
  insight: string;
  accentColor: string;
}

export default function KeyInsight({ insight, accentColor }: KeyInsightProps) {
  return (
    <div
      className={sharedStyles.keyInsight}
      style={{ borderLeftColor: accentColor }}
    >
      <p className={sharedStyles.keyInsightText}>{insight}</p>
    </div>
  );
}
