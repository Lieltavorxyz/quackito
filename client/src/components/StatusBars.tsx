import { motion } from "framer-motion";
import "./StatusBars.css";

interface StatusBarsProps {
  hunger: number;
  happiness: number;
  energy: number;
}

function getBarGradient(value: number): string {
  if (value > 60) return "linear-gradient(90deg, #56ab2f, #a8e063)";
  if (value > 30) return "linear-gradient(90deg, #f7971e, #ffd200)";
  return "linear-gradient(90deg, #e44d26, #f09819)";
}

function StatusBar({ label, value, icon }: { label: string; value: number; icon: string }) {
  const percent = Math.round(value);

  return (
    <div className="stat">
      <div className="stat__header">
        <span className="stat__icon">{icon}</span>
        <span className="stat__label">{label}</span>
        <span className="stat__value">{percent}%</span>
      </div>
      <div className="stat__track">
        <motion.div
          className="stat__fill"
          style={{ backgroundImage: getBarGradient(value) }}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />
      </div>
    </div>
  );
}

export function StatusBars({ hunger, happiness, energy }: StatusBarsProps) {
  return (
    <div className="status-bars">
      <StatusBar label="Hunger" value={hunger} icon="🍞" />
      <StatusBar label="Happiness" value={happiness} icon="💛" />
      <StatusBar label="Energy" value={energy} icon="⚡" />
    </div>
  );
}
