import { type DuckMood } from "../hooks/useDuck";
import "./Duck.css";

interface DuckProps {
  mood: DuckMood;
}

// Different duck expressions based on mood
const DUCK_FACES: Record<DuckMood, string> = {
  happy: "🦆",
  content: "🦆",
  hungry: "🐥",
  sad: "🐣",
  tired: "😴",
  sleeping: "💤",
};

const MOOD_LABELS: Record<DuckMood, string> = {
  happy: "Quackito is happy!",
  content: "Quackito is doing okay",
  hungry: "Quackito is hungry...",
  sad: "Quackito is sad...",
  tired: "Quackito is tired...",
  sleeping: "Quackito is sleeping... zzz",
};

export function Duck({ mood }: DuckProps) {
  return (
    <div className="duck-container">
      <div
        className={`duck duck--${mood}`}
        role="img"
        aria-label="duck"
      >
        {DUCK_FACES[mood]}
      </div>
      <p className="duck-mood">{MOOD_LABELS[mood]}</p>
    </div>
  );
}
