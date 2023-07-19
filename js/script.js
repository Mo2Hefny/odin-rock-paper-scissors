const cardsPerRound = 5;
const cardsID = ['paper-archers', 'paper-ballista', 'paper-cannon',
  'paper-ninja', 'paper-peasants', 'paper-rhinos', 'rock-ballista',
  'rock-builders', 'rock-dwarfs', 'rock-forts', 'rock-giants', 'rock-golems',
  'rock-shaolin', 'scissors-bandits', 'scissors-barber-master',
  'scissors-boomerang', 'scissors-cavalry', 'scissors-soldier',
  'scissors-wall-grappler'];
const cardsType = ['R', 'S', 'S', 'R', 'M', 'M', 'S', 'S', 'M', 'M', 'R', 'M',
'R', 'M', 'M', 'R', 'M', 'M', 'S'];
const cardsDamage = [3, 4, 6, 3, 1, 5, 4, 1, 2, 4, 4, 2,
6, 2, 6, 3, 4, 1, 7];

let playerScore = document.querySelector('#player-score');
let enemyScore = document.querySelector('#enemy-score');

const startGameButton = document.querySelector('#start-game');
const resetGameButton = document.querySelector('#reset-game');

startGameButton.addEventListener('click', startGame);
resetGameButton.addEventListener('click', resetGame);

function startGame() {
  const playerDeckCards = document.querySelector('.deck .cards');
  console.log(playerDeckCards.firstChild);
  if (playerDeckCards.firstChild) return;

  let cardsLeft = cardsPerRound;
  while (cardsLeft--) {
    let randomCardNumber;
    do {
      randomID = Math.floor(Math.random() * cardsID.length);
    } while (document.getElementById(cardsID[randomID]));
    let name = cardsID[randomID].replaceAll('-', ' ');
    name = name.replace(/\b\w/g, l => l.toUpperCase());
    console.log(cardsID[randomID]);
    console.log(cardsType[randomID]);
    console.log(cardsDamage[randomID]);
    console.log(name);
    const card = AddCard(cardsID[randomID], cardsDamage[randomID], cardsType[randomID], name);
    playerDeckCards.appendChild(card);
  }
}

function resetGame() {
  console.log("Game Restarted!");
  const playerDeckCards = document.querySelector('.deck .cards');
  while (playerDeckCards.firstChild)
    playerDeckCards.removeChild(playerDeckCards.lastChild);
  playerScore.textContent = 0;
  enemyScore.textContent = 0;
  startGame();
}

function AddCard(id, damage, type, name) {
  const card = document.createElement('div');
  const infoDiv = document.createElement('div');
  const damageDiv = document.createElement('div');
  const typeDiv = document.createElement('div');
  const p = document.createElement('p');
  card.setAttribute('id', id);
  card.classList.add('card-holder');

  infoDiv.classList.add('info');
  damageDiv.classList.add('damage');
  damageDiv.textContent = damage;
  typeDiv.classList.add('type');
  typeDiv.textContent = type;
  infoDiv.appendChild(damageDiv);
  infoDiv.appendChild(typeDiv);

  p.classList.add('name');
  p.textContent = name;

  card.appendChild(infoDiv);
  card.appendChild(p);
  const url = "../img/" + id + ".jpeg";
  card.style.cssText = `background: url(${url});
  background-position: center; background-size: cover;`;

  return card;
}