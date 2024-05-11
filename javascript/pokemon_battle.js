// Initialize Vue app
const MAX_POKEMON = 10000;
const app = new Vue({
    el: '#app',
    data: {
      pokemons: [],
      pokemonImages: {},
      pokemonDetails: {},
      selectedPokemon1: '',
      selectedPokemon2: '',
      battleResult: '',
      showWinnerCard: false,
    },
    created() {
      this.fetchPokemonNames();
    },
    methods: {
      async fetchPokemonNames() {
        try {
          const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
          const data = await response.json();
          this.pokemons = data.results.map(pokemon => ({ name: pokemon.name }));

        } catch (error) {
          console.error('Error fetching Pokémon names:', error);
        }
      },
      
      async fetchPokemonData(pokemonName) {
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
          const data = await response.json();
  
          const details = {
            types: data.types.map(type => type.type.name),
            abilities: data.abilities.map(ability => ability.ability.name),
            imageUrl: data.sprites.front_default,
          };
         
          return details;
        } catch (error) {
          console.error(`Error fetching ${pokemonName} data:`, error);
          return {};
        }
      },

      async startBattle() {
        if (!this.selectedPokemon1 || !this.selectedPokemon2) {
          alert('Please select Pokémon for both players!');
          return;
        }

        const details1 = await this.fetchPokemonData(this.selectedPokemon1);
        const details2 = await this.fetchPokemonData(this.selectedPokemon2);
        this.pokemonDetails = { [this.selectedPokemon1]: details1, [this.selectedPokemon2]: details2 };
  
        this.pokemonImages = {
          [this.selectedPokemon1]: details1.imageUrl,
          [this.selectedPokemon2]: details2.imageUrl,
        };
  
        const winner = this.simulateBattle(this.selectedPokemon1, this.selectedPokemon2);
        this.battleResult = winner;
        this.showWinnerCard = true;
      },
      resetBattle() {
        this.battleResult = '';
        this.selectedPokemon1 = '';
        this.selectedPokemon2 = '';
        this.showWinnerCard = false;
      },
      simulateBattle(pokemon1, pokemon2) {
        return Math.random() < 0.5 ? pokemon1 : pokemon2;
      },
    }
  });
  