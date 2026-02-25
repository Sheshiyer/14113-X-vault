import styles from "../card-detail.module.css";

interface HudHeaderProps {
  sectionCode: string;
  version: string;
  accentColor: string;
  onBack: () => void;
}

export default function HudHeader({
  sectionCode,
  version,
  accentColor,
  onBack,
}: HudHeaderProps) {
  return (
    <header className={styles.headerHud} data-gsap="card-hud">
      <div className={styles.hudItem}>
        <span>{sectionCode}</span>
        <span
          className={styles.statusDot}
          style={{
            background: accentColor,
            boxShadow: `0 0 10px ${accentColor}`,
          }}
        />
      </div>
      <div className={styles.hudItem}>
        <span>{version}</span>
      </div>
      <button
        type="button"
        className={styles.backButton}
        onClick={onBack}
      >
        BACK &larr;
      </button>
    </header>
  );
}
