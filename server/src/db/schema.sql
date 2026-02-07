-- Quackito database schema

CREATE TABLE IF NOT EXISTS ducks (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,   -- shareable code (e.g. "abc123")
    name VARCHAR(50) DEFAULT 'Quackito',
    hunger REAL DEFAULT 80,
    happiness REAL DEFAULT 80,
    energy REAL DEFAULT 80,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interactions (
    id SERIAL PRIMARY KEY,
    duck_id INTEGER REFERENCES ducks(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL,        -- 'feed', 'play', 'sleep'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ducks_code ON ducks(code);
CREATE INDEX IF NOT EXISTS idx_interactions_duck_id ON interactions(duck_id);
