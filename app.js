let currentQuestion = null;

let streak = Number(localStorage.getItem("streak")) || 0;
let bestStreak = Number(localStorage.getItem("bestStreak")) || 0;

let language = localStorage.getItem("language") || "en";

const languageSelector = document.getElementById("language");

languageSelector.value = language;

const texts = {
  es: {
    streak: "Racha",
    record: "Récord",
    correct: "✅ Correcto",
    wrong: "❌ Incorrecto",
  },

  en: {
    streak: "Streak",
    record: "Best",
    correct: "✅ Correct",
    wrong: "❌ Wrong",
  },
};

async function cargarPregunta() {
  const response = await fetch(`/api/question?lang=${language}`);

  currentQuestion = await response.json();

  document.getElementById("gameImage").src = currentQuestion.image;

  document.getElementById("question").textContent = currentQuestion.question;

  mostrarOpciones();
}

function mostrarOpciones() {
  const container = document.getElementById("answers");

  container.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.textContent = option;

    button.onclick = () => comprobarRespuesta(index);

    container.appendChild(button);
  });
}

function comprobarRespuesta(index) {
  const buttons = document.querySelectorAll("#answers button");

  buttons.forEach((button) => {
    button.disabled = true;
  });

  if (index === currentQuestion.correct) {
    streak++;

    if (streak > bestStreak) {
      bestStreak = streak;
    }

    buttons[index].style.background = "#4CAF50";
    buttons[index].style.color = "white";
  } else {
    streak = 0;

    buttons[index].style.background = "#d32f2f";
    buttons[index].style.color = "white";

    buttons[currentQuestion.correct].style.background = "#4CAF50";
    buttons[currentQuestion.correct].style.color = "white";
  }

  localStorage.setItem("streak", streak);
  localStorage.setItem("bestStreak", bestStreak);

  actualizarMarcador();

  setTimeout(() => {
    cargarPregunta();
  }, 900);
}

function actualizarMarcador() {
  document.getElementById("score").textContent =
    `${texts[language].streak}: ${streak} | ${texts[language].record}: ${bestStreak}`;
}

languageSelector.addEventListener("change", () => {
  localStorage.setItem("language", languageSelector.value);

  window.location.reload();
});

actualizarMarcador();

cargarPregunta();
