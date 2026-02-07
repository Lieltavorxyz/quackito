const express = require("express");
const cors = require("cors");
const duckRoutes = require("./routes/ducks");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Duck API routes
app.use("/api/ducks", duckRoutes);

if (require.main === module) {
  const migrate = require("./db/migrate");
  migrate()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Quackito API running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to start:", err.message);
      process.exit(1);
    });
}

module.exports = app;
