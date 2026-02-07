import { useState, useEffect } from "react";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

// Background gradients for each time of day
export const TIME_BACKGROUNDS: Record<TimeOfDay, string> = {
  morning: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  afternoon: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  evening: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
  night: "linear-gradient(135deg, #2c3e50 0%, #4a69bd 100%)",
};

export const TIME_LABELS: Record<TimeOfDay, string> = {
  morning: "Good morning!",
  afternoon: "Good afternoon!",
  evening: "Good evening!",
  night: "Shh... it's nighttime",
};

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

export function useTimeOfDay(): TimeOfDay {
  const [time, setTime] = useState<TimeOfDay>(getTimeOfDay());

  // Check every minute if time of day changed
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeOfDay());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return time;
}
