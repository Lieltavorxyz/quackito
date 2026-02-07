import { type TimeOfDay } from "../hooks/useTimeOfDay";
import "./Background.css";

interface BackgroundProps {
  timeOfDay: TimeOfDay;
}

export function Background({ timeOfDay }: BackgroundProps) {
  return (
    <div className={`bg bg--${timeOfDay}`}>
      {/* Sky */}
      <div className="bg__sky" />

      {/* Stars (night only) */}
      {timeOfDay === "night" && (
        <div className="bg__stars">
          <div className="star" style={{ top: "8%", left: "15%" }} />
          <div className="star" style={{ top: "12%", left: "45%" }} />
          <div className="star" style={{ top: "5%", left: "72%" }} />
          <div className="star" style={{ top: "18%", left: "88%" }} />
          <div className="star" style={{ top: "15%", left: "30%" }} />
          <div className="star star--large" style={{ top: "10%", left: "60%" }} />
        </div>
      )}

      {/* Sun/Moon */}
      <div className="bg__celestial">
        {timeOfDay === "night" ? (
          <div className="moon" />
        ) : (
          <div className="sun" />
        )}
      </div>

      {/* Clouds */}
      <div className="bg__clouds">
        <div className="cloud cloud--1" />
        <div className="cloud cloud--2" />
        <div className="cloud cloud--3" />
      </div>

      {/* Hills */}
      <div className="bg__hills">
        <div className="hill hill--back" />
        <div className="hill hill--front" />
      </div>

      {/* Pond */}
      <div className="bg__pond">
        <div className="pond" />
        <div className="pond-shimmer" />
      </div>

      {/* Grass */}
      <div className="bg__grass" />
    </div>
  );
}
