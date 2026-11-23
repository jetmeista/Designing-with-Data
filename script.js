// HTML elements we will update
const image = document.getElementById("pokemonImage");
const message = document.getElementById("message");
const hintText = document.getElementById("hintText");
const guessInput = document.getElementById("guessInput");
const pokemonInfo = document.getElementById("pokemonInfo");

let currentPokemon;
let score = 0;
let round = 1;
let finished = false;

// Load a random Pokémon from PokéAPI
async function newPokemon() {
    finished = true;
    message.textContent = "Loading Pokémon...";
    hintText.textContent = "";
    pokemonInfo.textContent = "";
    guessInput.value = "";
    image.removeAttribute("src");
    image.classList.add("hidden");
    document.body.style.backgroundColor = "#e9eef5";
    document.getElementById("pictureBox").style.backgroundColor = "#f0f0f0";

    try {
        // Choose a random Pokémon from the first 1025
        let number = Math.floor(Math.random() * 1025) + 1;
        let response = await fetch("https://pokeapi.co/api/v2/pokemon/" + number);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        currentPokemon = await response.json();
        image.src = currentPokemon.sprites.other["official-artwork"].front_default;
        image.alt = "Mystery Pokémon silhouette";
        message.textContent = "Who is this Pokémon?";
        finished = false;
    } catch (error) {
        message.textContent = "Couldn't load a Pokémon. Press Next Pokémon to try again.";
    }
}

// Reveal the Pokémon and its information
function revealPokemon() {
    if (finished || !currentPokemon) return;

    finished = true;
    image.classList.remove("hidden");
    guessInput.value = "";

    let name = currentPokemon.name;
    let type = currentPokemon.types.map(item => item.type.name).join(" / ");

    pokemonInfo.textContent = "Pokémon: " + name + " | Type: " + type;

    // API data also changes the background color
    let colors = {
        fire: "#ffd4b8", water: "#cce6ff", grass: "#d5f2cb",
        electric: "#fff1a8", psychic: "#ffd2e5", poison: "#e8d6f5",
        bug: "#e6edc2", rock: "#e6dcca", ground: "#ead6bd",
        ice: "#d8f5f7", fighting: "#f5d0ca", ghost: "#ddd8f4",
        dragon: "#d8d0ff", fairy: "#ffe1ef", dark: "#d5d0d0",
        steel: "#dce5e8", flying: "#dce8ff", normal: "#e6e6e6"
    };

    let firstType = currentPokemon.types[0].type.name;
    document.body.style.backgroundColor = colors[firstType] || "#e9eef5";
    document.getElementById("pictureBox").style.backgroundColor = colors[firstType] || "#f0f0f0";
}

// Check the player's guess
function checkGuess(event) {
    event.preventDefault();
    if (finished || !currentPokemon) return;

    let guess = guessInput.value.trim().toLowerCase();

    if (guess === currentPokemon.name) {
        score++;
        document.getElementById("score").textContent = score;
        revealPokemon();
        message.textContent = "Correct! You got it!";
    } else {
        message.textContent = "Not quite. Try again!";
    }
}

// Show a hint using the Pokémon's API type data
function showHint() {
    if (finished || !currentPokemon) return;
    hintText.textContent = "Hint: This Pokémon is " + currentPokemon.types[0].type.name + " type.";
}

function giveUp() {
    if (finished || !currentPokemon) return;
    revealPokemon();
    message.textContent = "It was " + currentPokemon.name + "!";
}

function nextRound() {
    round++;
    document.getElementById("round").textContent = round;
    newPokemon();
}

// Button interactions
 document.getElementById("guessForm").addEventListener("submit", checkGuess);
 document.getElementById("hintButton").addEventListener("click", showHint);
 document.getElementById("revealButton").addEventListener("click", giveUp);
 document.getElementById("nextButton").addEventListener("click", nextRound);

// Start the first round
newPokemon();
