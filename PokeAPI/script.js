const pokeAPIBaseUrl = "https://pokeapi.co/api/v2/pokemon/";

const loadPokemon = async () => {
    const randomIds = new Set();
    while (randomIds.size < 8) {
        randomIds.add(Math.ceil(Math.random() * 150));
    }
    console.log(...randomIds);

    
    const pokepromise = [...randomIds].map(id => fetch(pokeAPIBaseUrl + id));
    const responses = await Promise.all(pokepromise);
    return await Promise.all(responses.map(res => res.json())).then(pokemon => console.log(pokemon));
    
    
    /*
    const randomIdAr = [...randomIds];
    for (let i = 0; i < randomIds.size; i++) {

    const res = await fetch(pokeAPIBaseUrl + randomIdAr[i]);
        const pokemon = await res.json();
        console.log(pokemon);
    }
    */
}
const displayPokemon = (pokemon) => {
}
const resetGame = async () => {
}

loadPokemon();


