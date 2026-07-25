const URL = "https://www.freetogame.com/api/games";

async function getGames() {
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error("No se pudieron obtener los juegos");
  }

  return await response.json();
}

module.exports = {
  getGames,
};
