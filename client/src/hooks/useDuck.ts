import { useState, useEffect, useCallback } from "react";
import * as api from "../api";

export interface DuckState {
  hunger: number;
  happiness: number;
  energy: number;
  lastUpdated: number;
}

export type DuckMood = "happy" | "content" | "hungry" | "sad" | "tired" | "sleeping";

const STORAGE_KEY = "quackito-duck";
const CODE_KEY = "quackito-code";

// Decay rates (used for local fallback only)
const DECAY_RATES = {
  hunger: 0.3,
  happiness: 0.2,
  energy: 0.15,
};

function getDefaultState(): DuckState {
  return { hunger: 80, happiness: 80, energy: 80, lastUpdated: Date.now() };
}

function loadLocal(): DuckState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // corrupted
  }
  return getDefaultState();
}

function applyDecay(state: DuckState): DuckState {
  const minutesElapsed = (Date.now() - state.lastUpdated) / 60000;
  if (minutesElapsed < 0.1) return state;
  return {
    hunger: Math.max(0, state.hunger - DECAY_RATES.hunger * minutesElapsed),
    happiness: Math.max(0, state.happiness - DECAY_RATES.happiness * minutesElapsed),
    energy: Math.max(0, state.energy - DECAY_RATES.energy * minutesElapsed),
    lastUpdated: Date.now(),
  };
}

function clamp(v: number) {
  return Math.min(100, Math.max(0, v));
}

function getMood(state: DuckState): DuckMood {
  if (state.energy < 15) return "sleeping";
  if (state.energy < 30) return "tired";
  if (state.hunger < 20) return "hungry";
  if (state.happiness < 20) return "sad";
  if (state.hunger > 60 && state.happiness > 60 && state.energy > 40) return "happy";
  return "content";
}

const ACTION_VALUES: Record<string, { hunger?: number; happiness?: number; energy?: number }> = {
  feed: { hunger: 25 },
  play: { happiness: 20, energy: -10 },
  sleep: { energy: 35 },
};

export function useDuck() {
  const [state, setState] = useState<DuckState>(() => applyDecay(loadLocal()));
  const [duckCode, setDuckCode] = useState<string | null>(
    () => localStorage.getItem(CODE_KEY)
  );
  const [online, setOnline] = useState(false);

  // On mount: try to sync with server
  useEffect(() => {
    async function init() {
      try {
        if (duckCode) {
          // Fetch existing duck from server (decay is applied server-side)
          const duck = await api.getDuck(duckCode);
          setState({ ...duck, lastUpdated: Date.now() });
        } else {
          // Create a new duck on the server
          const duck = await api.createDuck();
          localStorage.setItem(CODE_KEY, duck.code);
          setDuckCode(duck.code);
          setState({ ...duck, lastUpdated: Date.now() });
        }
        setOnline(true);
      } catch {
        // Server unavailable — use localStorage fallback
        setOnline(false);
      }
    }
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save to localStorage as backup
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Local decay every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => applyDecay(prev));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const doAction = useCallback(
    async (action: "feed" | "play" | "sleep") => {
      // Optimistic local update
      const effects = ACTION_VALUES[action];
      setState((prev) => ({
        hunger: clamp(prev.hunger + (effects.hunger || 0)),
        happiness: clamp(prev.happiness + (effects.happiness || 0)),
        energy: clamp(prev.energy + (effects.energy || 0)),
        lastUpdated: Date.now(),
      }));

      // Sync to server if available
      if (duckCode && online) {
        try {
          const duck = await api.interact(duckCode, action);
          setState({ ...duck, lastUpdated: Date.now() });
        } catch {
          // Server failed — local update already applied
        }
      }
    },
    [duckCode, online]
  );

  const feed = useCallback(() => doAction("feed"), [doAction]);
  const play = useCallback(() => doAction("play"), [doAction]);
  const sleep = useCallback(() => doAction("sleep"), [doAction]);

  return { state, mood: getMood(state), feed, play, sleep, online, duckCode };
}
