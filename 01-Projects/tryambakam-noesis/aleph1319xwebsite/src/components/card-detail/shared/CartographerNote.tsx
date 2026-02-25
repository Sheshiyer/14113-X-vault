import sharedStyles from "./shared.module.css";

interface CartographerNoteProps {
  note: string;
  accentColor: string;
}

export default function CartographerNote({
  note,
  accentColor,
}: CartographerNoteProps) {
  const mutedAccent = accentColor + "cc"; // ~80% opacity via hex alpha

  return (
    <blockquote
      className={sharedStyles.cartographerNote}
      style={{ borderLeftColor: accentColor }}
    >
      <span className={sharedStyles.cartographerLabel}>The Cartographer</span>
      <p className={sharedStyles.cartographerText} style={{ color: mutedAccent }}>
        {note}
      </p>
    </blockquote>
  );
}
