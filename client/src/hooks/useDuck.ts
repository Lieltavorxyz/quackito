import { useState, useEffect, useCallback } from "react";

export interface DuckState {
  hunger: number; // 0-100, 100 = full
  happiness: number; // 0-100, 100 = very happy
  energy: number; // 0-100, 100 = fully rested
  lastUpdated: number; // timestamp
}

export type DuckMood = "happy" | "content" | "hungry" | "sad" | "tired" | "sleeping";

const STORAGE_KEY = "quackito-duck";

// How fast stats decay: points lost per minute
const DECAY_RATES = {
  hunger: 0.3, // loses ~18 points per hour
  happiness: 0.2, // loses ~12 points per hour
  energy: 0.15, // loses ~9 points per hour
};

// How much each action restores
const ACTION_VALUES = {
  feed: { hunger: 25 },
  play: { happiness: 20, energy: -10 },
  sleep: { energy: 35 },
};

function getDefaultState(): DuckState {
  return {
    hunger: 80,
    happiness: 80,
    energy: 80,
    lastUpdated: Date.now(),
  };
}

function loadState(): DuckState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // corrupted data, start fresh
  }
  return getDefaultState();
}

function applyDecay(state: DuckState): DuckState {
  const now = Date.now();
  const minutesElapsed = (now - state.lastUpdated) / 60000;

  if (minutesElapsed < 0.1) return state;

  return {
    hunger: Math.max(0, state.hunger - DECAY_RATES.hunger * minutesElapsed),
    happiness: Math.max(0, state.happiness - DECAY_RATES.happiness * minutesElapsed),
    energy: Math.max(0, state.energy - DECAY_RATES.energy * minutesElapsed),
    lastUpdated: now,
  };
}

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function getMood(state: DuckState): DuckMood {
  if (state.energy < 15) return "sleeping";
  if (state.energy < 30) return "tired";
  if (state.hunger < 20) return "hungry";
  if (state.happiness < 20) return "sad";
  if (state.hunger > 60 && state.happiness > 60 && state.energy > 40) return "happy";
  return "content";
}

export function useDuck() {
  const [state, setState] = useState<DuckState>(() => {
    const loaded = loadState();
    return applyDecay(loaded);
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Decay stats every 30 seconds while the app is open
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => applyDecay(prev));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const feed = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hunger: clamp(prev.hunger + ACTION_VALUES.feed.hunger),
      lastUpdated: Date.now(),
    }));
  }, []);

  const play = useCallback(() => {
    setState((prev) => ({
      ...prev,
      happiness: clamp(prev.happiness + ACTION_VALUES.play.happiness),
      energy: clamp(prev.energy + ACTION_VALUES.play.energy),
      lastUpdated: Date.now(),
    }));
  }, []);

  const sleep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      energy: clamp(prev.energy + ACTION_VALUES.sleep.energy),
      lastUpdated: Date.now(),
    }));
  }, []);

  const mood = getMood(state);

  return { state, mood, feed, play, sleep };
}
