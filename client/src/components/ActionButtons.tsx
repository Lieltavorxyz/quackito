import "./ActionButtons.css";

interface ActionButtonsProps {
  onFeed: () => void;
  onPlay: () => void;
  onSleep: () => void;
}

export function ActionButtons({ onFeed, onPlay, onSleep }: ActionButtonsProps) {
  return (
    <div className="actions">
      <button className="action-btn action-btn--feed" onClick={onFeed}>
        🍞 Feed
      </button>
      <button className="action-btn action-btn--play" onClick={onPlay}>
        🎾 Play
      </button>
      <button className="action-btn action-btn--sleep" onClick={onSleep}>
        💤 Sleep
      </button>
    </div>
  );
}
