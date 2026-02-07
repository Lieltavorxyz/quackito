import { useDuck } from "./hooks/useDuck";
import { useTimeOfDay, TIME_LABELS } from "./hooks/useTimeOfDay";
import { Background } from "./components/Background";
import { Duck } from "./components/Duck";
import { StatusBars } from "./components/StatusBars";
import { ActionButtons } from "./components/ActionButtons";
import "./App.css";

function App() {
  const { state, mood, feed, play, sleep } = useDuck();
  const timeOfDay = useTimeOfDay();

  return (
    <div className="app-wrapper">
      <Background timeOfDay={timeOfDay} />
      <div className="app-content">
        <p className="time-greeting">{TIME_LABELS[timeOfDay]}</p>
        <h1 className="title">Quackito</h1>
        <Duck mood={mood} />
        <div className="glass-card">
          <StatusBars
            hunger={state.hunger}
            happiness={state.happiness}
            energy={state.energy}
          />
          <ActionButtons onFeed={feed} onPlay={play} onSleep={sleep} />
        </div>
      </div>
    </div>
  );
}

export default App;
