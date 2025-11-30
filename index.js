const pokeSearch = document.querySelector('.poke-search');
const baseEndpoint = 'https://pokeapi.co/api/v2';
// function cercaPokemon(event) {
//     event.preventDefault();
//     const baseEndpoint = 'https://pokeapi.co/api/v2';
//     const data = pulisciDati(event.target); 
//     fetch(`${baseEndpoint}/pokemon/${data[0]}`)
//     .then(response => {
//         if(!response.ok) {
//             throw new Error(`Impossibile recuperare il Pokèmon ${data[0]}. Esiste?`);
//         }
//         return response.json()
//     })
//     .then(pokeDati => {
//            if(pokeDati.count) {
//             throw new Error(`Nessun Pokèmon trovato`);
//         }
//         renderPokemon(pokeDati);
//         return fetch(`${baseEndpoint}/pokemon/${pokeDati.id + 1}`);
//     })
//         .then(response => response.json())
//         .then(pokeDati => {
//             inserisciPokemonVicino('successivo', pokeDati);
//             if (pokeDati.id - 2 >= 1) {
//                 return fetch(`${baseEndpoint}/pokemon/${pokeDati.id - 2}`)
//             }
//         })
//         .then(response => response.json())
//         .then(pokeDati => inserisciPokemonVicino('precedente', pokeDati))
//         .catch(e => {
//             alert(e);
//         })
// }

async function cercaPokemon(event) {
    event.preventDefault();
    const data = pulisciDati(event.target);
    const pokemon = await caricaPokemon(data[0]);
    console.log(pokemon);
}

async function caricaPokemon(pokemon) {
    try {
        const res = await fetch(`${baseEndpoint}/pokemon/${pokemon}`);
        if (!res.ok) {
            throw new Error(`Impossibile recuperare il Pokèmon ${pokemon}. Esiste?`);
        }

        const pokeDati = await res.json();
        if (pokeDati.count) {
            throw new Error(`Nessun Pokèmon trovato`);
        }
        renderPokemon(pokeDati);
        if (pokeDati.id + 1 < 100) {
            mostraPokemonVicino('successivo', pokeDati.id + 1);
        }
        if (pokeDati.id - 1 >= 1) {
            mostraPokemonVicino('precedente', pokeDati.id - 1);
        }
        return pokeDati;
    } catch (e) {
        console.log(e);
    } finally {
        console.log("Io vengo eseguito lo stesso");
    }
}

async function mostraPokemonVicino(posizione, id) {
    const res = await fetch(`${baseEndpoint}/pokemon/${id}`);
    const pokemon = await res.json();
    inserisciPokemonVicino(posizione, pokemon);
}


function inserisciPokemonVicino(posizione, dati) {
    const card = document.querySelector(".card");
    switch (posizione) {
        case 'successivo':
            card.insertAdjacentHTML('beforeend', `<div class= "next-pokemon"><img width="50" src= "${dati.sprites.front_default}" alt= "${dati.name}"/> ${dati.name}</div>`);
            break;
        case 'precedente':
            card.insertAdjacentHTML('afterbegin', `<div class= "prev-pokemon"><img width="50" src= "${dati.sprites.front_default}" alt= "${dati.name}"/> ${dati.name}</div>`);
    }
}

function renderPokemon(dati) {
    resetRisultati();
    const card = document.createElement('div');
    card.classList.add('card', dati.types[0].type.name);
    card.insertAdjacentHTML("afterbegin", `<div class="media"><img src="${dati.sprites.front_default}" alt="${dati.name}"/></div>
        <div class= "stats">
                <h2>${dati.name}</h2>
            <ul>
                <li><span>Punti Vita:</span> ${dati.stats[0].base_stat}</li>
                <li><span>Attacco:</span> ${dati.stats[1].base_stat}</li>
                <li><span>Difesa:</span> ${dati.stats[2].base_stat}</li>
            </ul>
        </div>`);
    pokeSearch.insertAdjacentElement('afterend', card);
}

function resetRisultati() {
    const card = pokeSearch.nextElementSibling;
    if (card?.classList.contains('card')) {
        card.remove();
    }
}

function pulisciDati(form) {
    const datiInviati = new FormData(form);
    const datiPuliti = [];
    for (let input of datiInviati.entries()) {
        datiPuliti.push(sanifica(input[1]));
    }
    return datiPuliti;
}

function sanifica(input) {
    return input.trim().toLowerCase();
}


pokeSearch.addEventListener("submit", cercaPokemon);


async function getJSON(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

async function trovaPokemon(p1, p2, p3) {
    const pokeData1 = await getJSON(`${baseEndpoint}/pokemon/${p1}`);
    const pokeData2 = await getJSON(`${baseEndpoint}/pokemon/${p2}`);
    const pokeData3 = await getJSON(`${baseEndpoint}/pokemon/${p3}`);

    const pokeData = await Promise.all([
        getJSON(`${baseEndpoint}/pokemon/${p1}`),
        getJSON(`${baseEndpoint}/pokemon/${p2}`),
        getJSON(`${baseEndpoint}/pokemon/${p3}`)
    ]);

    console.log(pokeData1.name, pokeData2.name, pokeData3.name);
    
    console.log(pokeData.name(pokemon => pokemon.name));
}


// trovaPokemon('charizard', 'torchic', 'mewtwo');

async function variePromise(p1,p2,p3){
    const pokeData = await Promise.race([
        getJSON(`${baseEndpoint}/pokemon/${p1}`),
        getJSON(`${baseEndpoint}/pokemon/${p2}`),
        getJSON(`${baseEndpoint}/pokemon/${p3}`)
    ]);
    console.log(pokeData);
}
    
// variePromise('pikachu','bulbasaur','squirtle');


// const timeout = function(ms) {
//     return new Promise((_, reject) => {
//         setTimeout(() => {
//             reject(new Error('La richiesta ci sta impiegando troppo tempo'));
//         }, ms)
//     })
// }

// Promise.race([
//     getJSON(`${baseEndpoint}/pokemon/charizard`),
//     timeout(60000)
// ]).then(res => console.log(res))
// .catch(error => console.error(error));




Promise.allSettled([
    Promise.resolve('Successo'),
    Promise.reject('Errore'),
    Promise.resolve('Altro successo')
])
.then(res => console.log(res))
.catch(error => console.error(error));

Promise.all([
    Promise.resolve('Successo'),
    Promise.reject('Errore'),
    Promise.resolve('Altro successo')
])
.then(res => console.log(res))
.catch(error => console.error(error));

Promise.any([
    Promise.resolve('Successo'),
    Promise.reject('Errore'),
    Promise.resolve('Altro successo')
])
.then(res => console.log(res))
.catch(error => console.error(error));