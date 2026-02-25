import sharedStyles from "./shared.module.css";

interface SeekerQuestionProps {
  question: string;
}

export default function SeekerQuestion({ question }: SeekerQuestionProps) {
  return (
    <div className={sharedStyles.seekerQuestion}>
      <span className={sharedStyles.seekerLabel}>Practitioner Asks</span>
      <p className={sharedStyles.seekerText}>{question}</p>
    </div>
  );
}
