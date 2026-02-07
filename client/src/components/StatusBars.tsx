import "./StatusBars.css";

interface StatusBarsProps {
  hunger: number;
  happiness: number;
  energy: number;
}

function getBarColor(value: number): string {
  if (value > 60) return "#4caf50"; // green
  if (value > 30) return "#ff9800"; // orange
  return "#f44336"; // red
}

function StatusBar({ label, value, icon }: { label: string; value: number; icon: string }) {
  const percent = Math.round(value);
  const color = getBarColor(value);

  return (
    <div className="status-bar">
      <span className="status-bar__icon">{icon}</span>
      <span className="status-bar__label">{label}</span>
      <div className="status-bar__track">
        <div
          className="status-bar__fill"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
      <span className="status-bar__value">{percent}%</span>
    </div>
  );
}

export function StatusBars({ hunger, happiness, energy }: StatusBarsProps) {
  return (
    <div className="status-bars">
      <StatusBar label="Hunger" value={hunger} icon="🍞" />
      <StatusBar label="Happy" value={happiness} icon="💛" />
      <StatusBar label="Energy" value={energy} icon="⚡" />
    </div>
  );
}
