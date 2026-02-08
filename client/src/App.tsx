import { useCallback } from "react";
import { useDuck } from "./hooks/useDuck";
import { useTimeOfDay, TIME_LABELS } from "./hooks/useTimeOfDay";
import { Background } from "./components/Background";
import { Duck } from "./components/Duck";
import { StatusBars } from "./components/StatusBars";
import { ActionButtons } from "./components/ActionButtons";
import { Particles } from "./components/Particles";
import { useParticles } from "./hooks/useParticles";
import "./App.css";

function App() {
  const { state, mood, feed, play, sleep } = useDuck();
  const timeOfDay = useTimeOfDay();
  const { particles, emit, remove } = useParticles();

  const handleFeed = useCallback(() => { feed(); emit("feed"); }, [feed, emit]);
  const handlePlay = useCallback(() => { play(); emit("play"); }, [play, emit]);
  const handleSleep = useCallback(() => { sleep(); emit("sleep"); }, [sleep, emit]);

  return (
    <div className="app-wrapper">
      <Background timeOfDay={timeOfDay} />
      <div className="app-content">
        <p className="time-greeting">{TIME_LABELS[timeOfDay]}</p>
        <h1 className="title">Quackito</h1>
        <div className="duck-particles-wrapper">
          <Duck mood={mood} />
          <Particles particles={particles} onComplete={remove} />
        </div>
        <div className="glass-card">
          <StatusBars
            hunger={state.hunger}
            happiness={state.happiness}
            energy={state.energy}
          />
          <ActionButtons onFeed={handleFeed} onPlay={handlePlay} onSleep={handleSleep} />
        </div>
      </div>
    </div>
  );
}

export default App;
