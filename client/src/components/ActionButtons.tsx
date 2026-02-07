import { motion } from "framer-motion";
import iconFeed from "../assets/icon-feed.png";
import iconPlay from "../assets/icon-play.png";
import iconSleep from "../assets/icon-sleep.png";
import "./ActionButtons.css";

interface ActionButtonsProps {
  onFeed: () => void;
  onPlay: () => void;
  onSleep: () => void;
}

interface ActionBtnProps {
  iconSrc: string;
  label: string;
  onClick: () => void;
  className: string;
}

function ActionBtn({ iconSrc, label, onClick, className }: ActionBtnProps) {
  return (
    <motion.button
      className={`action-btn ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <img className="action-btn__icon" src={iconSrc} alt={label} />
      <span className="action-btn__label">{label}</span>
    </motion.button>
  );
}

export function ActionButtons({ onFeed, onPlay, onSleep }: ActionButtonsProps) {
  return (
    <div className="actions">
      <ActionBtn iconSrc={iconFeed} label="Feed" onClick={onFeed} className="action-btn--feed" />
      <ActionBtn iconSrc={iconPlay} label="Play" onClick={onPlay} className="action-btn--play" />
      <ActionBtn iconSrc={iconSleep} label="Sleep" onClick={onSleep} className="action-btn--sleep" />
    </div>
  );
}
