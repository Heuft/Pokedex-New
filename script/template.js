function genCard(pokeCard) {
  return `
      <div class="poke-card ${pokeCard.types[0]} " onclick="openDialog(${
    pokeCard.id
  })">
      <div class="pokeImg">
      <img class="pokeImg2" src="${
        pokeCard.sprites
      }" class="card-img-top" alt="...">
      <h1 class="pokeNmb">#${pokeCard.id}</h1>
      </div>
              <div class="pokeNmb ${pokeCard[0]}"(${pokeCard.id})">
                <div class="card-body">
                  <p class="pokeName">${pokeCard.name}</p>
                </div>
                <div class="poke-types">
        ${generateTypeIcons(pokeCard.types)}
      </div>
              </div>
            </div>
                `;
}

function gendialog(pokeCard) {
  const statsHTML = pokeCard.stats
    .map(
      (stat) => `
    <div class="stat-row">
      <p>${stat.stat.name.toUpperCase()}</p>
        <div 
          class="progress-bar">
          <div class="progress-bar-fill" style="width: ${
            stat.base_stat
          }%"></div>
        </div>
     
    </div>
  `
    )
    .join("");

  return `
<div>
<div id="overlay" class="overlay d-none" onclick="closeDialog()">
  <div id="dialog" class="dialog" onclick="event.stopPropagation()">
<div class="dialog">
  <div class="dialogCloseButton">
        <button onclick="closeDialog()" class="closeBtn">X</button></div>
     <div class="dialogName"> <h1 class="pokeId">${
       pokeCard.name
     }<div class="poke-types">
        ${generateTypeIcons(pokeCard.types)}
      </div></h1></div>
      <img src="${pokeCard.sprites}" class="pokeImg3">
            <div id="noPreviousPokemonMessage" class="d-none">Es gibt kein vorheriges Pokémon.</div>
      <div class="underPokeImg"><button onclick="pokeBack(${
        pokeCard.id
      })" class="dialogBtn"><i class="arrow left"></i></button>
      <h2 class="iD-font">ID = #${
        pokeCard.id
      }</h2><button onclick="pokeForward(${
    pokeCard.id
  })" class="dialogBtn"><i class="arrow right"></i></button></div>
      <div class="dialogNavBar"><button class="btnDialogTwice" onclick="showBasicInfo()">Basic-Info</button><button class="btnDialogTwice" onclick="showStats()">Stats</button></div>
        <div id="basic-info" class="parameters">
          <div class="ability">
            <p>Weight:</p>
            <p>${pokeCard.weight}kg</p>
          </div>
          <div  class="ability">
            <p>Height:</p>
            <p>${pokeCard.height}m</p>
          </div>
        
        <div class="ability">
        <p>Abilities:</p>
        <p>${pokeCard.abilities
          .map((ability) => ability.ability.name)
          .join(", ")}</p>
          
        </div>
        </div>
        <div id="stats" class="d_none">
          <div>
          ${statsHTML}
        
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</div>
</div>`;
}
