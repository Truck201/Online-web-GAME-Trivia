const express = require("express");
const app = express();
require("dotenv").config();

const triviaRoutes = require("./routes/trivia");
app.use("/api", triviaRoutes);
app.use(express.static("public"));
const cors = require("cors");

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

      console.error(`Bloqueado por CORS: origen ${origin}`);
      return callback(new Error("No permitido por CORS"));
    },
  }),
);

app.disable("x-powered-by");
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("<h1>Bienvenidos a mi página de inicio</h1>");
});

// app.get("/api/question", (req, res) => {
//   try {
//     console.log("Question:", question); // Verifica el contenido aquí
//     res.json(question);
//   } catch (error) {
//     console.error("Error al obtener los contenidos:", error); // Agrega este log
//     res
//       .status(500)
//       .json({ error: "Hubo un problema al obtener los contenidos." });
//   }
// });

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `El servidor se ejecuta en http://localhost:${process.env.PORT || 3000}`,
  );
});

module.exports = app;
