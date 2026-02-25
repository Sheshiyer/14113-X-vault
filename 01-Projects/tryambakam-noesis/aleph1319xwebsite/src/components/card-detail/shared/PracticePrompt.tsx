import sharedStyles from "./shared.module.css";

interface PracticePromptProps {
  prompt: string;
}

export default function PracticePrompt({ prompt }: PracticePromptProps) {
  return (
    <div className={sharedStyles.practicePrompt}>
      <span className={sharedStyles.practiceLabel}>
        <span className={sharedStyles.practiceLabelPrefix}>&gt;</span>
        Practice
      </span>
      <p className={sharedStyles.practiceText}>{prompt}</p>
    </div>
  );
}
