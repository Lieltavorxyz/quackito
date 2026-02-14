const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface DuckResponse {
  code: string;
  name: string;
  hunger: number;
  happiness: number;
  energy: number;
}

export async function createDuck(name?: string): Promise<DuckResponse> {
  const res = await fetch(`${API_URL}/api/ducks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create duck");
  return res.json();
}

export async function getDuck(code: string): Promise<DuckResponse> {
  const res = await fetch(`${API_URL}/api/ducks/${code}`);
  if (!res.ok) throw new Error("Failed to fetch duck");
  return res.json();
}

export type FoodType = "bread" | "seeds" | "berries";

export async function interact(
  code: string,
  action: "feed" | "play" | "sleep",
  food_type?: FoodType
): Promise<DuckResponse> {
  const body: Record<string, string> = { action };
  if (action === "feed" && food_type) {
    body.food_type = food_type;
  }
  const res = await fetch(`${API_URL}/api/ducks/${code}/interact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to interact");
  return res.json();
}
