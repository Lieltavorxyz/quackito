import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="duck-container">
        <div className="duck" role="img" aria-label="duck">
          🦆
        </div>
      </div>
      <h1 className="title">Quackito</h1>
      <p className="subtitle">Your little duck is waiting for you</p>
      <div className="actions">
        <button className="action-btn" disabled>
          🍞 Feed
        </button>
        <button className="action-btn" disabled>
          🎾 Play
        </button>
        <button className="action-btn" disabled>
          💤 Sleep
        </button>
      </div>
      <p className="coming-soon">Coming soon...</p>
    </div>
  );
}

export default App;
