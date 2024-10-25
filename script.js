let pokemonElement = document.querySelector(".pokemon-cards")
let searchBar = document.getElementById("search")
let allPokemons

//Aggiunta dell'event listener alla searchbar per ogni input da tastiera
searchBar.addEventListener("keyup" , (e) => {
    let target = e.target.value;  //valore all'interno del textbox
    let result = allPokemons.filter(searchPokemon => {  //funzione che permette di filtrare un array in base ad una condizione, richiede sempre un return
        return searchPokemon.name.toLowerCase().includes(target) || searchPokemon.type.toLowerCase().includes(target)
        
    })
    //richiamo la funzione displayPokemon, con parametro di ritorno l'array di risultati filtrati
    displayPokemon(result)
})

async function fetchPokemon() {
    allPokemons = [];

    // Crea un array di promesse per tutte le fetch
    const pokemonPromises = [];
    //ogni chiamata viene inserita all'interno dell'array delle promises
    for (let i = 1; i <= 150; i++) {
        pokemonPromises.push(
            fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
                .then((res) => res.json())
                .then((data) => {
                // assegno all'oggetto pokemon i dati presi dall'API
                    let pokemon = {
                        name: data.name.toUpperCase(),
                        id: data.id,
                        image: data.sprites.front_default,
                        stats: data.stats.map((element) => `${element.stat.name}: ${element.base_stat}`).join(`<br>`),
                        type: data.types.map((element) => element.type.name).join(' - '),
                        
                    };
                    
                    return pokemon;
                    
                    
                })
        );
    }

    // Attendi che tutte le promesse siano completate
    allPokemons = await Promise.all(pokemonPromises);
    //richiamo la funzione displayPokemon() per far uscire sulla schermata ogni carta
    displayPokemon(allPokemons)
}

function displayPokemon(pokemon){
    //funzione map() per iterare su ogni pokemon e creare l'HTML per ognuno di esso
    let pokemonHtml = pokemon.map((pokemon) => (
        `
        <li class = "card">
        <div class = "pokemon-img">
         <img src = "${pokemon.image}"></img>
        </div
        <div>
        <p class = "pokemon-name">${pokemon.name}</p>
        <p class = "pokemon-type">${pokemon.type}</p>
        <p class = "pokemon-stats"><span>${pokemon.stats}<span></p>
        </div>
        </li>
        `
    )).join('')

    pokemonElement.innerHTML = pokemonHtml
   
    
}


fetchPokemon();
