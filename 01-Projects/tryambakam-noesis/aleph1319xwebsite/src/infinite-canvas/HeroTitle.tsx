import * as React from "react";
import gsap from "gsap";
import { useProgress } from "@react-three/drei";
import styles from "./hero-title.module.css";

export function HeroTitle() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { progress } = useProgress();
  const hasAnimated = React.useRef(false);

  React.useEffect(() => {
    if (containerRef.current) {
      gsap.set(containerRef.current, { xPercent: -50 });
    }
  }, []);

  React.useEffect(() => {
    if (progress === 100 && !hasAnimated.current && containerRef.current) {
      hasAnimated.current = true;

      // Delay to let the PageLoader finish its sequence
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 4, ease: "power2.out", delay: 2.8 }
      );
    }
  }, [progress]);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const xMove = (e.clientX / window.innerWidth - 0.5) * -40;
      const yMove = (e.clientY / window.innerHeight - 0.5) * -20;

      gsap.to(containerRef.current, {
        x: xMove,
        y: yMove,
        duration: 2.5,
        ease: "power2.out",
        overwrite: "auto"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <p className={styles.subtitle}>Bioluminescent Architecture</p>
      <h1 className={styles.title}>Tryambakam Noesis</h1>
    </div>
  );
}
