'use strict'
const pokemons = [];
const wrapperEL = document.querySelector('.wrapper');
const detailsWrapperEl = document.querySelector('.details-wrapper');

fetch('https://pokeapi.co/api/v2/pokemon?limit=12')
  .then(res => res.json())
  .then(data => parseResponse(data))
  .catch(err => console.console.error(err));

//PokemontypesToSelect
fetch('https://pokeapi.co/api/v2/type?limit=999')
  .then(ans => ans.json()
  .then(response => renderTypes(response.results)))
//PokemontypesToSelect

function parseResponse(response){
  const someVar = response.results.map(p => getPokemonData(p.url));
  
  Promise.all(someVar)
  .then(p => {
    pokemons.push(...p);
    renderPokemonList(p);
  })
}

function renderPokemonList(pokemons){
  
  pokemons.map(pokemon => renderPokemon(pokemon));
}

function getPokemonData(url){
  return fetch(url)
    .then(res => res.json())
    .catch(err => console.error(err));
} 

function createPokemonTemplate(pokemon) {
  const btns = pokemon.types.map(t => `<button class="btn ${t.type.name}">${t.type.name}</button>`).join('');
  return `<div class="card__image-wrapper">
            <img class="card__image" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
          <div>
          <div class="pokemon_name">
            <h3>${pokemon.name} # ${pokemon.id}</h3>
          </div>
          <div class="buttons_group">
              ${btns}
          </div>`
}

function renderPokemon(pokemon) {
   
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = createPokemonTemplate(pokemon);
  card.addEventListener('click', () => openDetails(pokemon));
  wrapperEL.appendChild(card);
}

function findStats(type, pokemon){
  const ability = pokemon.stats.find(item => item.stat.name === type);
  return ability.base_stat;
}

function detailTemplate(pokemon){
  const types = pokemon.types.map(t => t.type.name);
  return `
  <div class="details">
      <div class="card__image-wrapper">
        <img class="card__image" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      </div>
      <h2 class="details_title">${pokemon.name} #${pokemon.id}</h2>
    <table class="details_table">
      <tr>
        <td>Type</td>
        <td>${types}</td>
      </tr>
      <tr>
        <td>Attack</td>
        <td>${findStats('attack', pokemon)}</td>
      </tr>
      <tr>
        <td>Defense</td>
        <td>${findStats('defense', pokemon)}</td>
      </tr>
        <tr>
          <td>SP Attack</td>
          <td>${findStats('special-attack', pokemon)}</td>
        </tr>
        <tr>
          <td>SP Defense</td>
          <td>${findStats('special-defense', pokemon)}</td>
        </tr>
        <tr>
          <td>Weight</td>
          <td>${pokemon.weight}</td>
        </tr>
        <tr>
            <td>Total moves</td>
            <td>${pokemon.moves.length}</td>
        </tr>
    </table>
  </div>`
}


function openDetails(pokemon){
  const template = detailTemplate(pokemon);
  detailsWrapperEl.innerHTML = template;
}

// Load More
const loadMoreEl = document.querySelector('.more');
let offSetValue = 0;
function getNextPokemons(){

  offSetValue = offSetValue + 12;

  fetch(`https://pokeapi.co/api/v2/pokemon?limit=12&offset=${offSetValue}`)
  .then(res => res.json()
  .then(data => parseResponse(data)))
}
loadMoreEl.addEventListener('click', getNextPokemons);
// Load More ENDS

//Filter Pokemon types
function renderTypes (types) {

  const selectElement = document.querySelector('#pokemon_types');
  selectElement.addEventListener('change', typesFilter);
  for(let i = 0; i < types.length; i++){
    const optionElement = document.createElement('option');

    optionElement.innerHTML = types[i]['name'];
    selectElement.appendChild(optionElement);
  }
}

function typesFilter(e) {

  const inputValue = e.target.value;
  const fiteredPokemons = pokemons.filter(pokemon =>{
    return  pokemon.types.some(({type}) => type.name === inputValue )
  })
  wrapperEL.innerHTML = ''; /*Clear DOM*/
  renderPokemonList(fiteredPokemons);
}
//Filter Pokemon types




