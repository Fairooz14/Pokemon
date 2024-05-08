const MAX_POKEMON = 10000;
const listWrapper = document.querySelector(".pokemon-list");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");
const loadMoreBtn = document.querySelector("#load-more-btn");

//load more functionality


//Empty array before fetching 
let allPokemons = [];
let offset = 0; // Offset for paginating through API results

///------------------------------------------------------REQUESTING FOR API FETCHING SECTION---------------------------------------------------------

//Basic structure of fetching PokeAPI url 
fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`)
    .then((response) => response.json())
    .then((data) => {

        // console.log(data);
        // console.log(data.results);
        // console.log(data.results[0]);
        // console.log(data.results[0].name);
        // console.log(data.results[0].url);
        // console.log(allPokemons);

        //Calling display fuction inside the fetch request to put it in the empty array
        allPokemons = data.results;
        displayPokemons(allPokemons);
    });

async function fetchPokemonDataBeforeRedirect(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([

            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) =>
                response.json()
            ),

            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) =>
                response.json()
            ),

        ]);
        return true;
    } catch (error) {
        console.error("Failed to fetch Pokemon Data before direct");
    }
    // const someData = API data from url
    // console.log(someData)
}

// Function to fetch Pokémon from API for loading 
async function fetchPokemons() {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
        const data = await response.json();
        allPokemons = [...allPokemons, ...data.results];
        offset += 20;
        displayPokemons(allPokemons);
    } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
    }
}

// Load initial Pokémon on page load
fetchPokemons();

///------------------------------------------------------CREATING HTML STRCUCTURE OF EACH CARD TO DISPLAY-------------------------------------------


function displayPokemons(pokemon) {
    //emptying the list wrapper after reloading the page
    listWrapper.innerHTML = "";

    //creating HTML stracture for each pokemon.
    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="back">
            <div class="back-content">
              <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}">
            </div>
          </div>

          <div class="front">
            <div class="img">
              <div class="circle">
              </div>
              <div class="circle" id="right">
              </div>
              <div class="circle" id="bottom">
              </div>
            </div>

            <div class="front-content">
              <small class="number-wrap">
                <p class="caption_fonts">No. ${pokemonID}</p>
              </small>
              <div class="description">
                <div class="name-wrap">
                  <p class="body3-fonts">
                    <strong>${pokemon.name}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        `;
        // <div class = "number-wrap">
        // <p class = "caption_fonts" >#${pokemonID}</p>
        // </div>
        // <div class = "image-wrap">
        // <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
        // </div>
        // <div class = "name-wrap">
        //     <p class= "body3-fonts">${pokemon.name}</p>
        // </div> 

        //click event that will take to the detailed page of each pokemon card selected.
        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect(pokemonID);
            if (success) {
                window.location.href = `./detail.html?id=${pokemonID}`;
            }
        });


        //Adding all the list item to the list wrapper.
        listWrapper.appendChild(listItem);
    });
}

loadMoreBtn.addEventListener("click", fetchPokemons);

///---------------------------------------------------------------------ENABLING SEARCH FUNCTION----------------------------------------------------

//search event executes when the key is released.
searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {

    //making all the capital latter to lower by default
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons;

    if (numberFilter.checked) {
        filteredPokemons = allPokemons.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID.startsWith(searchTerm);
        });
    } else if (nameFilter.checked) {
        filteredPokemons = allPokemons.filter((pokemon) =>
            pokemon.name.toLowerCase().startsWith(searchTerm)
        );
    } else {
        filteredPokemons = allPokemons;
    }

    //displaying pokemons using filter pokemon functions
    displayPokemons(filteredPokemons);
    if (filteredPokemons.length === 0) {
        notFoundMessage.style.display = "block";
    } else {
        notFoundMessage.style.display = "none";
    }
}
// creating closer click event function 
const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
    searchInput.value = "";
    displayPokemons(allPokemons);
    notFoundMessage.style.display = "none";
}