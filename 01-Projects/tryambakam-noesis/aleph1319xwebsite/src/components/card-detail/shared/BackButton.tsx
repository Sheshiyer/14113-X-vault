import styles from "../card-detail.module.css";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export default function BackButton({
  onClick,
  label = "Return to Field",
}: BackButtonProps) {
  return (
    <button
      type="button"
      className={styles.ctaContainer}
      onClick={onClick}
      data-gsap="card-cta"
    >
      <span className={styles.btnText}>{label}</span>
      <span className={styles.arrowIcon}>&rarr;</span>
    </button>
  );
}
