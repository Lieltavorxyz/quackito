import { motion, AnimatePresence } from "framer-motion";
import { type Particle } from "../hooks/useParticles";
import "./Particles.css";

export function Particles({
  particles,
  onComplete,
}: {
  particles: Particle[];
  onComplete: (id: number) => void;
}) {
  return (
    <div className="particles-container">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="particle"
            style={{ left: `${p.x}%` }}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -120, scale: 1.2, x: p.drift }}
            transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
            onAnimationComplete={() => onComplete(p.id)}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
