// Winner Card Component
Vue.component('winner-card', {
    props: ['pokemon', 'image'],
    template: `
      <div class="winner-card">
        <h4>The Winner is</h4>
        <h2>{pokemon}</h2>
        <img :src="image" class="pokemon-image" alt="Winner Image"><br>
        <button @click="$emit('close')" class="btn btn-primary">Close</button>
      </div>
    `
  });
  