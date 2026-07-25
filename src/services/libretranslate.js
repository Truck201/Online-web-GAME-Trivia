const { translate: googleTranslate } = require("google-translate-api-x");

const cache = new Map();

async function translate(text, target = "es") {
  if (!text) return text;

  const key = `${target}:${text}`;

  if (cache.has(key)) {
    return cache.get(key);
  }

  try {
    const result = await googleTranslate(text, {
      to: target,
    });

    cache.set(key, result.text);

    return result.text;
  } catch (error) {
    console.error("Error traduciendo:", error);

    // Si falla la traducción devolvemos el texto original
    return text;
  }
}

module.exports = {
  translate,
};
