const express = require("express");
const router = express.Router();

const { translate } = require("../services/libretranslate");
const { getGames } = require("../services/freetogame");

router.get("/question", async (req, res) => {
  try {
    const language = req.query.lang || "en";

    const games = await getGames();

    let correctGame = games[Math.floor(Math.random() * games.length)];

    const questionTypes = [
      {
        property: "title",
        text: {
          es: "¿Cómo se llama este videojuego?",
          en: "What is the name of this game?",
        },
      },
      {
        property: "publisher",
        text: {
          es: "¿Quién publicó este videojuego?",
          en: "Who published this game?",
        },
      },
      {
        property: "release_date",
        text: {
          es: "¿En qué año fue lanzado este videojuego?",
          en: "In what year was this game released?",
        },
      },
      {
        property: "genre",
        text: {
          es: "¿A qué género pertenece este videojuego?",
          en: "What genre does this game belong to?",
        },
      },
      {
        property: "short_description",
        text: {
          es: "¿Cuál es la descripción de este videojuego?",
          en: "Which description matches this game?",
        },
      },
    ];

    const questionType =
      questionTypes[Math.floor(Math.random() * questionTypes.length)];

    const correctValue = await getValue(
      correctGame,
      questionType.property,
      language,
    );

    const usedValues = new Set([correctValue]);

    const options = [correctValue];

    const shuffledGames = shuffle(games);

    for (const game of shuffledGames) {
      if (game.id === correctGame.id) continue;

      const value = await getValue(game, questionType.property, language);

      if (usedValues.has(value)) continue;

      usedValues.add(value);
      options.push(value);

      if (options.length === 4) break;
    }

    const shuffledOptions = shuffle(options);

    const correctIndex = shuffledOptions.indexOf(correctValue);

    res.json({
      question: questionType.text[language],
      image: correctGame.thumbnail,
      options: shuffledOptions,
      correct: correctIndex,
    });
  } catch (error) {
    console.error("ERROR COMPLETO:");
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

async function getValue(game, property, language) {
  let value = game[property];

  if (property === "release_date") {
    return value.substring(0, 4);
  }

  if (language === "es" && ["short_description"].includes(property)) {
    //"genre"
    value = await translate(value, "es");
  }

  return value;
}

function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

module.exports = router;
