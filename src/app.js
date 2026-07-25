const express = require("express");
const path = require("path");
const cors = require("cors");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        process.env.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
      ];

      if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("No permitido por CORS"));
    },
  }),
);

app.use(express.static(path.join(__dirname, "../public")));

const triviaRoutes = require("./routes/trivia");
app.use("/api", triviaRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
