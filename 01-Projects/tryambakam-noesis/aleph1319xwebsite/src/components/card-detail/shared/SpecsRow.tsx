import styles from "../card-detail.module.css";

interface SpecsRowProps {
  specs: readonly { label: string; value: string }[];
}

export default function SpecsRow({ specs }: SpecsRowProps) {
  return (
    <div className={styles.specsContainer}>
      {specs.map((spec) => (
        <div
          key={spec.label}
          className={styles.specBox}
          data-gsap="card-spec"
        >
          <span className={styles.specLabel}>{spec.label}</span>
          <span className={styles.specValue}>{spec.value}</span>
        </div>
      ))}
    </div>
  );
}
