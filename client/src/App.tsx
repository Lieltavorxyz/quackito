import { useDuck } from "./hooks/useDuck";
import { useTimeOfDay, TIME_BACKGROUNDS, TIME_LABELS } from "./hooks/useTimeOfDay";
import { Duck } from "./components/Duck";
import { StatusBars } from "./components/StatusBars";
import { ActionButtons } from "./components/ActionButtons";
import "./App.css";

function App() {
  const { state, mood, feed, play, sleep } = useDuck();
  const timeOfDay = useTimeOfDay();

  return (
    <div className="app-wrapper" style={{ background: TIME_BACKGROUNDS[timeOfDay] }}>
      <div className="app">
        <p className="time-greeting">{TIME_LABELS[timeOfDay]}</p>
        <Duck mood={mood} />
        <h1 className="title">Quackito</h1>
        <StatusBars
          hunger={state.hunger}
          happiness={state.happiness}
          energy={state.energy}
        />
        <ActionButtons onFeed={feed} onPlay={play} onSleep={sleep} />
      </div>
    </div>
  );
}

export default App;
