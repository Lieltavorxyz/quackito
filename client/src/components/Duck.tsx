import { motion, AnimatePresence } from "framer-motion";
import { type DuckMood } from "../hooks/useDuck";
import duckHappy from "../assets/duck-happy.png";
import duckContent from "../assets/duck-content.png";
import duckHungry from "../assets/duck-hungry.png";
import duckSad from "../assets/duck-sad.png";
import duckTired from "../assets/duck-tired.png";
import duckSleeping from "../assets/duck-sleeping.png";
import "./Duck.css";

interface DuckProps {
  mood: DuckMood;
}

const DUCK_IMAGES: Record<DuckMood, string> = {
  happy: duckHappy,
  content: duckContent,
  hungry: duckHungry,
  sad: duckSad,
  tired: duckTired,
  sleeping: duckSleeping,
};

const MOOD_LABELS: Record<DuckMood, string> = {
  happy: "Quackito is happy!",
  content: "Quackito is doing okay",
  hungry: "Quackito is hungry...",
  sad: "Quackito is sad...",
  tired: "Quackito is tired...",
  sleeping: "Quackito is sleeping...",
};

const DUCK_ANIMATIONS: Record<DuckMood, object> = {
  happy: {
    y: [0, -10, 0],
    rotate: [0, -3, 0, 3, 0],
    transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
  },
  content: {
    y: [0, -4, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
  hungry: {
    rotate: [-2, 2, -2],
    transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" },
  },
  sad: {
    y: [0, 3, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
  tired: {
    rotate: [-4, 4, -4],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
  sleeping: {
    scale: [1, 1.03, 1],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export function Duck({ mood }: DuckProps) {
  return (
    <div className="duck-area">
      <motion.div
        className={`duck-character duck-character--${mood}`}
        role="img"
        aria-label="duck"
        whileTap={{ scale: 1.15 }}
        animate={DUCK_ANIMATIONS[mood]}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={mood}
            src={DUCK_IMAGES[mood]}
            alt={`Duck feeling ${mood}`}
            className="duck-img"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.p
          key={mood}
          className="duck-mood-label"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          {MOOD_LABELS[mood]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
