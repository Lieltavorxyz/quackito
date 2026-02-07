const express = require("express");
const pool = require("../db/pool");
const { nanoid } = require("nanoid");

const router = express.Router();

// Decay rates: points lost per minute
const DECAY_RATES = {
  hunger: 0.3,
  happiness: 0.2,
  energy: 0.15,
};

// Action effects
const ACTIONS = {
  feed: { hunger: 25 },
  play: { happiness: 20, energy: -10 },
  sleep: { energy: 35 },
};

function clamp(value) {
  return Math.min(100, Math.max(0, value));
}

function applyDecay(duck) {
  const now = new Date();
  const minutesElapsed = (now - new Date(duck.last_updated)) / 60000;

  if (minutesElapsed < 0.1) {
    return { hunger: duck.hunger, happiness: duck.happiness, energy: duck.energy };
  }

  return {
    hunger: clamp(duck.hunger - DECAY_RATES.hunger * minutesElapsed),
    happiness: clamp(duck.happiness - DECAY_RATES.happiness * minutesElapsed),
    energy: clamp(duck.energy - DECAY_RATES.energy * minutesElapsed),
  };
}

// POST /api/ducks — Create a new duck
router.post("/", async (req, res) => {
  try {
    const code = nanoid(8);
    const name = req.body.name || "Quackito";

    const result = await pool.query(
      "INSERT INTO ducks (code, name) VALUES ($1, $2) RETURNING *",
      [code, name]
    );

    const duck = result.rows[0];
    res.status(201).json({
      code: duck.code,
      name: duck.name,
      hunger: duck.hunger,
      happiness: duck.happiness,
      energy: duck.energy,
    });
  } catch (err) {
    console.error("Error creating duck:", err.message);
    res.status(500).json({ error: "Failed to create duck" });
  }
});

// GET /api/ducks/:code — Get duck state (with decay applied)
router.get("/:code", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ducks WHERE code = $1",
      [req.params.code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Duck not found" });
    }

    const duck = result.rows[0];
    const decayed = applyDecay(duck);

    // Save decayed state back to DB
    await pool.query(
      "UPDATE ducks SET hunger = $1, happiness = $2, energy = $3, last_updated = NOW() WHERE id = $4",
      [decayed.hunger, decayed.happiness, decayed.energy, duck.id]
    );

    res.json({
      code: duck.code,
      name: duck.name,
      ...decayed,
    });
  } catch (err) {
    console.error("Error fetching duck:", err.message);
    res.status(500).json({ error: "Failed to fetch duck" });
  }
});

// POST /api/ducks/:code/interact — Feed, play, or sleep
router.post("/:code/interact", async (req, res) => {
  try {
    const { action } = req.body;

    if (!action || !ACTIONS[action]) {
      return res.status(400).json({ error: "Invalid action. Use: feed, play, sleep" });
    }

    const result = await pool.query(
      "SELECT * FROM ducks WHERE code = $1",
      [req.params.code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Duck not found" });
    }

    const duck = result.rows[0];
    const decayed = applyDecay(duck);

    // Apply action effects on top of decayed state
    const effects = ACTIONS[action];
    const updated = {
      hunger: clamp(decayed.hunger + (effects.hunger || 0)),
      happiness: clamp(decayed.happiness + (effects.happiness || 0)),
      energy: clamp(decayed.energy + (effects.energy || 0)),
    };

    // Save to DB
    await pool.query(
      "UPDATE ducks SET hunger = $1, happiness = $2, energy = $3, last_updated = NOW() WHERE id = $4",
      [updated.hunger, updated.happiness, updated.energy, duck.id]
    );

    // Log the interaction
    await pool.query(
      "INSERT INTO interactions (duck_id, action) VALUES ($1, $2)",
      [duck.id, action]
    );

    res.json({
      code: duck.code,
      name: duck.name,
      ...updated,
    });
  } catch (err) {
    console.error("Error interacting with duck:", err.message);
    res.status(500).json({ error: "Failed to interact with duck" });
  }
});

module.exports = router;
