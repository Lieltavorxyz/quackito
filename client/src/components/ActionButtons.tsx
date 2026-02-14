import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import iconFeed from "../assets/icon-feed.png";
import iconPlay from "../assets/icon-play.png";
import iconSleep from "../assets/icon-sleep.png";
import type { FoodType } from "../api";
import "./ActionButtons.css";

interface ActionButtonsProps {
  onFeed: (foodType: FoodType) => void;
  onPlay: () => void;
  onSleep: () => void;
}

interface ActionBtnProps {
  iconSrc: string;
  label: string;
  onClick: () => void;
  className: string;
}

const FOOD_OPTIONS: { type: FoodType; label: string; emoji: string; desc: string }[] = [
  { type: "bread",   label: "Bread",   emoji: "\uD83C\uDF5E", desc: "+15 hunger, +5 happy" },
  { type: "seeds",   label: "Seeds",   emoji: "\uD83C\uDF3B", desc: "+10 hunger, +10 happy" },
  { type: "berries", label: "Berries", emoji: "\uD83C\uDF53", desc: "+5 hunger, +15 happy" },
];

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

function FeedButton({ onFeed }: { onFeed: (foodType: FoodType) => void }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    if (!showPicker) return;
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  const handleFoodSelect = (foodType: FoodType) => {
    onFeed(foodType);
    setShowPicker(false);
  };

  return (
    <div className="feed-wrapper" ref={pickerRef}>
      <motion.button
        className="action-btn action-btn--feed"
        onClick={() => setShowPicker((prev) => !prev)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <img className="action-btn__icon" src={iconFeed} alt="Feed" />
        <span className="action-btn__label">Feed</span>
      </motion.button>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            className="food-picker"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {FOOD_OPTIONS.map((food) => (
              <motion.button
                key={food.type}
                className="food-option"
                onClick={() => handleFoodSelect(food.type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="food-option__emoji">{food.emoji}</span>
                <span className="food-option__label">{food.label}</span>
                <span className="food-option__desc">{food.desc}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ActionButtons({ onFeed, onPlay, onSleep }: ActionButtonsProps) {
  return (
    <div className="actions">
      <FeedButton onFeed={onFeed} />
      <ActionBtn iconSrc={iconPlay} label="Play" onClick={onPlay} className="action-btn--play" />
      <ActionBtn iconSrc={iconSleep} label="Sleep" onClick={onSleep} className="action-btn--sleep" />
    </div>
  );
}
