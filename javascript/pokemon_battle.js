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
  watch: {
    selectedPokemon1(newPokemon) {
      if (newPokemon) {
        this.loadPokemonData(newPokemon);
      }
    },
    selectedPokemon2(newPokemon) {
      if (newPokemon) {
        this.loadPokemonData(newPokemon);
      }
    },
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
          imageUrl: data.sprites.versions['generation-v']['black-white'].animated.front_shiny,
        };

        return details;
        
      } catch (error) {
        console.error(`Error fetching ${pokemonName} data:`, error);
        return {};
      }
    },
    async loadPokemonData(pokemonName) {
      const details = await this.fetchPokemonData(pokemonName);
      this.$set(this.pokemonDetails, pokemonName, details);
      this.$set(this.pokemonImages, pokemonName, details.imageUrl);
    },
    async startBattle() {
      if (!this.selectedPokemon1 || !this.selectedPokemon2) {
        alert('Please select Pokémon for both players!');
        return;
      }

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
