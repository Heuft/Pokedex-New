const Base_URL = "https://pokeapi.co/api/v2/pokemon";
const limit = 20;
let offset = 0;
let pokeArray = [];
let abilitiesList = [];

async function init() {
  try {
    showLoading();
    let pokemonResponse = await getAllPokemon(limit, offset);
    await getAllInformations(pokemonResponse.results);
    renderPokemons(pokeArray);
  } catch (error) {
    console.error("Es ist ein Fehler aufgetreten!", error);
  } finally {
    hideLoading();
  }
}

async function getAllPokemon(limit, offset) {
  let response = await fetch(`${Base_URL}?limit=${limit}&offset=${offset}`);
  return await response.json();
}

async function getAllInformations(basicInfos) {
  for (let i = 0; i < basicInfos.length; i++) {
    let detailInfos = await fetchPokemonDetails(basicInfos[i].url);
    pokeArray.push({
      name: basicInfos[i].name,
      url: basicInfos[i].url,
      id: detailInfos.id,
      height: detailInfos.height,
      weight: detailInfos.weight,
      stats: detailInfos.stats,
      abilities: detailInfos.abilities,
      sprites: detailInfos.sprites.other["official-artwork"].front_default,
      types: detailInfos.types.map((typeInfo) => typeInfo.type.name),
    });
  }
}

async function fetchPokemonDetails(url) {
  let response = await fetch(url);
  let pokemonDetails = await response.json();
  return pokemonDetails;
}

async function renderPokemons(pokemonArray) {
  const cardsSection = document.getElementById("pokecards-section");
  cardsSection.innerHTML = "";

  pokemonArray.forEach((pokeCard) => {
    cardsSection.innerHTML += genCard(pokeCard);
  });
}

async function getAbilities() {
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/ability/?limit=999"
    );
    const data = await response.json();
    abilitiesList = data.results.map((ability) => ({
      name: ability.name,
      url: ability.url,
    }));
  } catch (error) {
    console.error("Fehler beim Abrufen der Fähigkeiten:", error);
  }
}

async function updateAbilities(pokeCard) {
  try {
    const abilities = pokeCard.abilities.map(
      (abilityObj) => abilityObj.ability.url
    );
    detailAbilities();
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Fähigkeiten:", error);
  }
}

async function detailAbilities() {
  const detailedAbilities = await Promise.all(
    abilities.map(async (url) => {
      const response = await fetch(url);
      const abilityData = await response.json();
      return {
        name: abilityData.name,
      };
    })
  );
  pokeCard.detailedAbilities = detailedAbilities;
}

function protection(event) {
  event.stopPropagation();
}

function showStats() {
  document.getElementById("stats").classList.remove("d_none");
  document.getElementById("basic-info").classList.add("d_none");
  document.getElementById("basic-info").classList.remove("parameters");
}

function showBasicInfo() {
  document.getElementById("basic-info").classList.remove("d_none");
  document.getElementById("stats").classList.add("d_none");
}

async function loadMorePokemons() {
  const button = document.getElementById("btnDis");
  try {
    button.disabled = true;
    setTimeout(() => {
      button.disabled = false;
    }, 2000);
    offset += limit;
    const newPokemonResponse = await getAllPokemon(limit, offset);
    await getAllInformations(newPokemonResponse.results);
    renderPokemons(pokeArray.slice(offset, offset + limit));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    updateDialogMaxId();
  } catch (error) {
    console.error("Fehler beim Laden weiterer Pokémon:", error);
  }
}

function disableButtonForOneSecond() {
  let btnDis = document.querySelector("btnDis");
  btnDis.addEventListener("click", () => {
    btnDis.disabled = true;
  });
}

async function updateDialogMaxId() {
  const dialogContainer = document.getElementById("dialog");
  if (!dialogContainer.classList.contains("d_none")) {
    const currentPokeId = parseInt(dialogContainer.dataset.pokeId, 10);
    if (currentPokeId) {
      showPokemonById(currentPokeId);
    }
  }
}

function showPokemonById(pokeId) {
  const pokeCard = pokeArray.find((pokemon) => pokemon.id === pokeId);

  if (!pokeCard) {
    console.error("Pokémon nicht gefunden!");
    return;
  }

  const dialogHTML = gendialog(pokeCard);
  const dialogContainer = document.getElementById("dialog");
  dialogContainer.innerHTML = dialogHTML;
}

async function pokeForward(currentId) {
  const nextId = currentId + 1;
  const maxId = Math.max(...pokeArray.map((pokemon) => pokemon.id));

  if (nextId > maxId) {
    await loadMorePokemons();
  }
  const nextPokemon = pokeArray.find((pokemon) => pokemon.id === nextId);

  if (nextPokemon) {
    showPokemonById(nextId);
  }
}

function pokeBack(currentId) {
  const prevId = currentId - 1;
  const minId = Math.min(...pokeArray.map((pokemon) => pokemon.id));
  const messageElement = document.getElementById("noPreviousPokemonMessage");
  if (prevId < minId) {
    messageElement.classList.remove("d-none");
    setTimeout(() => {
      messageElement.classList.add("d-none");
    }, 3000);
    return;
  }
  messageElement.classList.add("d-none");

  showPokemonById(prevId);
}

function generateTypeIcons(types) {
  return types
    .map(
      (type) =>
        `<img src="assets/icons/${type}.png" alt="${type}" class="type-icon">`
    )
    .join("");
}

function getFilterInput() {
  return document.getElementById("pokemonFilter").value.toLowerCase();
}

function updateFilterMessage(message, color) {
  const filterMessage = document.getElementById("filterMessage");
  filterMessage.textContent = message;
  filterMessage.style.color = color;
}

function filterByPokemonName(filterInput) {
  return pokeArray.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(filterInput)
  );
}

function filterPokemon() {
  const filterInput = getFilterInput();
  const filterMessage = document.getElementById("filterMessage");

  if (filterInput.length < 3) {
    updateFilterMessage("Bitte gib mindestens 3 Buchstaben ein.", "#DC143C");
    renderPokemons(pokeArray);
    return;
  } else {
    updateFilterMessage("", "");
  }

  const filteredPokemon = filterByPokemonName(filterInput);

  if (filteredPokemon.length === 0) {
    updateFilterMessage("Kein Pokémon gefunden.", "#DC143C");
  } else {
    updateFilterMessage("", "");
  }

  renderPokemons(filteredPokemon);
}

function showLoading() {
  const loadingElement = document.getElementById("loading");
  loadingElement.classList.remove("d-none");
}

function hideLoading() {
  const loadingElement = document.getElementById("loading");
  loadingElement.classList.add("d-none");
}

function openDialog(pokeId) {
  const pokeCard = pokeArray.find((pokemon) => pokemon.id === pokeId);

  if (!pokeCard) {
    console.error("Pokémon nicht gefunden!");
    return;
  }
  const dialogHTML = gendialog(pokeCard);
  const dialogContainer = document.getElementById("dialog");
  dialogContainer.innerHTML = dialogHTML;
  dialogContainer.classList.remove("d_none");
  document.body.classList.add("no-scroll");
  dialogContainer.addEventListener("click", (event) => {
    closeDialogOnOutsideClick(event, dialogContainer);
  });
}

function closeDialog() {
  const dialogContainer = document.getElementById("dialog");
  dialogContainer.classList.add("d_none");
  dialogContainer.innerHTML = "";
  document.body.classList.remove("no-scroll");
}

function closeDialogOnOutsideClick(event) {
  if (!event.target.closest(".dialog-content")) {
    closeDialog();
  }
}
