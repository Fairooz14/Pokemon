const MAX_POKEMON = 100000;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

//Empty array before fetching 
let allPokemons = [];

///------------------------------------------------------REQUESTING FOR API FETCHING SECTION---------------------------------------------------------

//Basic structure of fetching PokeAPI url 
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
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
            <div class = "number-wrap">
                <p class = "caption_fonts" >#${pokemonID}</p>
            </div>
            <div class = "image-wrap">
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
            </div>
            <div class = "name-wrap">
                <p class= "body3-fonts">${pokemon.name}</p>
            </div>
        `;

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