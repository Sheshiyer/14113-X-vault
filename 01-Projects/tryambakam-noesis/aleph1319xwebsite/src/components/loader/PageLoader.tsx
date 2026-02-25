import gsap from "gsap";
import * as React from "react";
import styles from "./style.module.css";

export function PageLoader({ progress }: { progress: number }) {
  const [show, setShow] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLParagraphElement>(null);
  const barContainerRef = React.useRef<HTMLDivElement>(null);
  const barFillRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!textRef.current || !barContainerRef.current) return;

    // Soft cinematic entrance
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 2.4, ease: "power2.out", delay: 0.4 }
    );
    gsap.fromTo(
      barContainerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: "power2.out", delay: 1.2 }
    );
  }, []);

  React.useEffect(() => {
    if (barFillRef.current) {
      gsap.to(barFillRef.current, {
        scaleX: progress / 100,
        duration: 0.4,
        ease: "power2.out",
      });
    }

    if (progress === 100 && containerRef.current) {
      // Cinematic dissolve sequence
      gsap.to([textRef.current, barContainerRef.current], {
        opacity: 0,
        y: -4,
        duration: 1.2,
        ease: "power2.inOut",
        delay: 0.5,
      });

      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 2,
        ease: "power2.inOut",
        delay: 1.2,
        onComplete: () => setShow(false),
      });
    }
  }, [progress]);

  if (!show) return null;

  return (
    <div ref={containerRef} className={`${styles.overlay} ${styles.visible}`}>
      <div className={styles.loaderPanel}>
        <p ref={textRef} className={styles.progressText}>
          {progress >= 100 ? "Field Synchronized" : "Initiating perception matrix..."}
        </p>
        <div ref={barContainerRef} className={styles.progressBarContainer}>
          <div ref={barFillRef} className={styles.progressBarFill} />
        </div>
      </div>
    </div>
  );
}
