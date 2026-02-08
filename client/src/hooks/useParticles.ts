import { useState, useCallback } from "react";

type ActionType = "feed" | "play" | "sleep";

export interface Particle {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  drift: number;
  duration: number;
}

const ACTION_EMOJIS: Record<ActionType, string[]> = {
  feed: ["🍪", "🍞", "✨", "🥖"],
  play: ["💛", "✨", "🎾", "💫"],
  sleep: ["💤", "😴", "⭐", "💤"],
};

let nextId = 0;

export function useParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const emit = useCallback((action: ActionType) => {
    const emojis = ACTION_EMOJIS[action];
    const count = 5 + Math.floor(Math.random() * 3);
    const batch: Particle[] = Array.from({ length: count }, () => ({
      id: nextId++,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: 30 + Math.random() * 40,
      delay: Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 60,
      duration: 1.2 + Math.random() * 0.5,
    }));
    setParticles((prev) => [...prev, ...batch]);
  }, []);

  const remove = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { particles, emit, remove };
}
