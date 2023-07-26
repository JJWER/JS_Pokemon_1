// Function to fetch the list of Pokemons from the API
async function fetchPokemonList() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/");
    if (response.ok) {
      const pokemons = await response.json();
      return pokemons['results'];
    }
  } catch (error) {
    console.log("Can't fetch data from API.");
    return [];
  }
}

// Function to fetch Pokemon details from the API
async function fetchPokemonDetails(name) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
    if (response.ok) {
      const pokemonDetails = await response.json();
      return pokemonDetails;
    }
  } catch (error) {
    console.log("Can't fetch Pokemon details from the API.");
    return null;
  }
}

// Function to add a Pokemon to the list
function addPokemonToList(name, url) {
  const urlsplited = url.split("/");
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${urlsplited[6]}.png`;

  const pokemonDiv = document.getElementById("pokemonlist");
  const card = document.createElement("div");
  card.setAttribute("class", "card col-3");

  const image = document.createElement("img");
  image.setAttribute("class", "card-img-top");
  image.setAttribute("src", imageUrl);

  const nameDiv = document.createElement("div");
  nameDiv.setAttribute("class", "card-body");

  const title = document.createElement("h5");
  title.setAttribute("class", "card-title");
  title.innerText = name;

  const button = document.createElement("a");
  button.setAttribute("class", "btn btn-primary center");
  button.setAttribute("href", "#");
  button.innerText = "more...";
  button.addEventListener("click", () => {
    // Function to show more details about the selected Pokemon
    showDetails(name);
  });

  nameDiv.appendChild(title);
  nameDiv.appendChild(button);

  card.appendChild(image);
  card.appendChild(nameDiv);

  pokemonDiv.appendChild(card);
}

// Function to show the modal with Pokemon details
async function showDetails(name) {
  const pokemonDetails = await fetchPokemonDetails(name);
  if (pokemonDetails) {
    const modal = new bootstrap.Modal(document.getElementById("pokemonModal"));
    const modalTitle = document.getElementById("modalTitle");
    const modalImage = document.getElementById("modalImage");
    const modalDetails = document.getElementById("modalDetails");

    modalTitle.innerText = name;
    modalTitle.setAttribute("class", "title-center");
    modalImage.setAttribute("src", pokemonDetails.sprites.front_default);

    const filteredStats = pokemonDetails.stats.filter(stat => {
      return ["hp", "attack", "defense", "speed"].includes(stat.stat.name);
    });

    const statsHTML = `
      <div class="col-6">
        <h5>Stats:</h5>
        <ul>
          ${filteredStats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join("")}
        </ul>
      </div>
    `;

    const detailsHTML = `
      <div class="row">
        <div class="col-6">
          <p>Height: ${pokemonDetails.height} </p>
          <p>Weight: ${pokemonDetails.weight} </p>
          <p>Base Experience: ${pokemonDetails.base_experience}</p>
          <!-- Add more basic details if needed -->
        </div>
        ${statsHTML}
      </div>
    `;

    modalDetails.innerHTML = detailsHTML;
    modal.show();
  }
}

// Main function to fetch Pokemon list and add them to the page
async function initializePokemonList() {
  try {
    const pokemonList = await fetchPokemonList();
    if (pokemonList && pokemonList.length > 0) {
      pokemonList.forEach(pokemon => {
        addPokemonToList(pokemon.name, pokemon.url);
      });
    }
  } catch (error) {
    console.log("Error initializing the Pokemon list.");
  }
}

// Call the main function to initialize the Pokemon list
initializePokemonList();
