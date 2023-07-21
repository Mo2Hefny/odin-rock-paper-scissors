const cardsPerRound = 5;
const SELECTIONS_PER_ROUND = 4;
const ROUNDS = 3;
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
const abilities = ['rock-ability', 'paper-ability', 'scissors-ability'];
let enemyAbilitiesUsed = [];
enemyAbilitiesUsed['rock-ability'] = false;
enemyAbilitiesUsed['paper-ability'] = false;
enemyAbilitiesUsed['scissors-ability'] = false;

let playerScore = document.querySelector('#player-score');
let enemyScore = document.querySelector('#enemy-score');

let playableCardsPerRound = 4;
let playedRounds = 0;
let usedAbility = false;

const startGameButton = document.querySelector('#start-game');
const resetGameButton = document.querySelector('#reset-game');
const nextRoundButton = document.querySelector('#next-round');
const playerDeckCards = document.querySelector('#deck');
const abilitySection = document.querySelector('.abilities');
const commentaryText = document.querySelector('.commentary');
startGameButton.addEventListener('click', startGame);
resetGameButton.addEventListener('click', resetGame);
nextRoundButton.addEventListener('click', nextRound);

function toggleEngrave() {
  startGameButton.classList.toggle('engraved-text');
  resetGameButton.classList.toggle('engraved-text');
  nextRoundButton.classList.add('engraved-text');
}

function startGame() {
  if (startGameButton.classList.contains('engraved-text')) return;
  toggleEngrave();

  generateDeck();
}

function resetGame() {
  if (resetGameButton.classList.contains('engraved-text')) return;

  playerDeckCards.innerHTML = "";
  resetBoard();

  /* Abilities */
  for (const ability of abilitySection.children)
    ability.classList.remove('used');

  for (const ability of enemyAbilitiesUsed)
    ability = false;
  toggleAbilitiesSection();

  /* Board scores */
  playerScore.textContent = 0;
  enemyScore.textContent = 0;
  playedRounds = 0;

  commentaryText.textContent = "Restarted Game!";
  toggleEngrave();
}

function nextRound() {
  if (nextRoundButton.classList.contains('engraved-text')) return;
  nextRoundButton.classList.toggle('engraved-text');
  resetBoard();
  toggleAbilitiesSection();

  playableCardsPerRound = SELECTIONS_PER_ROUND;
  generateDeck();
}

function resetBoard() {
  let playerMeleeScore = document.querySelector('#player-melee-score');
  let playerRangeScore = document.querySelector('#player-range-score');
  let playerSiegeScore = document.querySelector('#player-siege-score');
  let enemyMeleeScore = document.querySelector('#enemy-melee-score');
  let enemyRangeScore = document.querySelector('#enemy-range-score');
  let enemySiegeScore = document.querySelector('#enemy-siege-score');

  /* Board scores */
  playerMeleeScore.textContent = 0;
  playerRangeScore.textContent = 0;
  playerSiegeScore.textContent = 0;
  enemyMeleeScore.textContent = 0;
  enemyRangeScore.textContent = 0;
  enemySiegeScore.textContent = 0;

  /* Cards Sections */
  let enemyBoard = document.querySelector('.enemy');
  let playerBoard = document.querySelector('.player');
  for (const section of enemyBoard.children) {
    console.log(section.childNodes);
    section.querySelector('.cards').innerHTML = "";
  }
  for (const section of playerBoard.children)
    section.querySelector('.cards').innerHTML = "";

  /* Constants */
  playableCardsPerRound = SELECTIONS_PER_ROUND;
  usedAbility = false;
}

function generateDeck() {
  let cardsLeft = cardsPerRound;
  while (cardsLeft--) {
    let randomID;
    do {
      randomID = Math.floor(Math.random() * cardsID.length);
    } while (document.getElementById(cardsID[randomID]));
    let name = cardsID[randomID].replaceAll('-', ' ');
    name = name.replace(/\b\w/g, l => l.toUpperCase());
    const card = addCard(cardsID[randomID], cardsDamage[randomID], cardsType[randomID], name);
    playerDeckCards.appendChild(card);
  }
  commentaryText.textContent = 'Pick 4 Cards!';
}

function addCard(id, damage, type, name) {
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

  p.classList.add('name');
  p.textContent = name;


  infoDiv.appendChild(damageDiv);
  infoDiv.appendChild(typeDiv);
  card.appendChild(infoDiv);
  card.appendChild(p);
  const url = "./img/" + id + ".jpg";
  card.style.cssText = `background: url(${url});
  background-position: center; background-size: cover;`;

  return card;
}

playerDeckCards.addEventListener('click', game);

function game(event) {
  if (event.target === playerDeckCards) return;
  if (playableCardsPerRound <= 0) {
    commentaryText.textContent = `All 4 Cards Picked!`;
    return;
  }

  let enemySelection = undefined;
  let playerSelection = event.target.closest('.card-holder');

  if (playerSelection === undefined) return;
  playableCardsPerRound--;
  playCard(playerSelection, 'player');

  enemySelection = getComputerSelection();
  setTimeout(playCard(enemySelection, 'enemy'), 2000);
  console.log("Done!");

  if (playableCardsPerRound <= 0)
    toggleAbilitiesSection();
}

function toggleAbilitiesSection() {
  const abilitiesHeader = document.querySelector('.abilities-section h3');
  abilitiesHeader.classList.toggle('color-effect');
  for (const ability of abilitySection.children)
    ability.classList.toggle('locked');
}

function getComputerSelection() {
  const enemyBoard = document.querySelector('.enemy');
  let randomID;
  do {
    randomID = Math.floor(Math.random() * cardsID.length);
  } while (enemyBoard.querySelector('#' + cardsID[randomID]));
  let name = cardsID[randomID].replaceAll('-', ' ');
  name = name.replace(/\b\w/g, l => l.toUpperCase());
  commentaryText.textContent = `Enemy Picked ${name}!`;
  const enemyCard = addCard(cardsID[randomID], cardsDamage[randomID], cardsType[randomID], name);
  return enemyCard;
}



function playCard(card, side) {
  console.log(`${side} selected: ${card.lastChild.textContent}`);
  let cardType = card.firstChild.lastChild.textContent;
  cardType = (cardType == "M") ? "melee" : (cardType == "R") ? "range" : "siege";
  playRound(card, side, cardType);
  updateDeck(card, side, cardType);
}

function playRound(card, side, type) {
  let cardDamage = Number(card.firstChild.firstChild.textContent);
  let cardType = card.querySelector('.info .type').textContent[0];
  let score = document.querySelector(`#${side}-${type}-score`);
  
  score.textContent = Number(score.textContent) + cardDamage;
}

function updateDeck(card, side, type) {
  card.firstChild.style.cssText = 'justify-content: flex-start;';
  card.firstChild.removeChild(card.querySelector('.info .type'));
  card.removeChild(card.querySelector('.name'));
  
  let cardDeck = document.querySelector(`#${side}-${type}`);
  cardDeck.appendChild(card);
  console.log(`${side}'s card is in the #${side}-${type} deck`);
}

function updateScore() {
  let playerMeleeScore = Number(document.querySelector('#player-melee-score').textContent);
  let playerRangeScore = Number(document.querySelector('#player-range-score').textContent);
  let playerSiegeScore = Number(document.querySelector('#player-siege-score').textContent);
  let enemyMeleeScore = Number(document.querySelector('#enemy-melee-score').textContent);
  let enemyRangeScore = Number(document.querySelector('#enemy-range-score').textContent);
  let enemySiegeScore = Number(document.querySelector('#enemy-siege-score').textContent);

  let playerTotalPoints = playerMeleeScore + playerRangeScore + playerSiegeScore;
  let enemyTotalPoints = enemyMeleeScore + enemyRangeScore + enemySiegeScore;

  if (playerTotalPoints > enemyTotalPoints)
    playerScore.textContent = Number(playerScore.textContent) + 1;
  else if (playerTotalPoints < enemyTotalPoints)
    enemyScore.textContent = Number(enemyScore.textContent) + 1;

  //commentaryText.textContent = `Player ${playerTotalPoints} - Enemy ${enemyTotalPoints}`;
}

abilitySection.addEventListener('click', abilitySystem);

function abilitySystem(event) {
  if (event.target === abilitySection) return;
  if (playableCardsPerRound > 0) {
    commentaryText.textContent = `Play Your Cards First!`;
    return;
  }
  if (usedAbility) {
    if (playedRounds <= ROUNDS)
      commentaryText.textContent = `Go To Next Round!`;
    return;
  }
  let enemyAbility = undefined;
  let playerAbility = event.target;
  if (playerAbility === undefined) return;
  
  playerAbility.classList.add('used');
  enemyAbility = getComputerAbility();
  let playerAbilityType = playerAbility.getAttribute('id')[0];
  let enemyAbilityType = enemyAbility[0];

  activateAbility(playerAbilityType, 'player');
  activateAbility(enemyAbilityType, 'enemy');
  commentaryText.textContent = `Enemy used ${enemyAbility}!`;
  updateScore();
  playedRounds++;
  usedAbility = true;
  nextRoundButton.classList.toggle('engraved-text');
  if (playedRounds >= 3) setWinner();
}

function getComputerAbility() {
  let randomID;
  do {
    randomID = Math.floor(Math.random() * abilities.length);
  } while (enemyAbilitiesUsed[abilities[randomID]]);
  enemyAbilitiesUsed[abilities[randomID]] = true;
  return abilities[randomID];
}

function activateAbility(type, side) {
  console.log(`The ${side} chose ${type}`);
  let otherSide = (side === "player") ? "enemy" : "player";
  let otherBoard = document.querySelector(`.${otherSide}`);
  let affectedType = (type === 'r') ? 's' : (type === 's') ? 'p' : 'r';
  for (const section of otherBoard.children)
  {
    let cards = section.lastElementChild;
    let sectionScore = section.children[1];
    for (const card of cards.children)
    {
      let cardType = card.getAttribute('id')[0];
      if (cardType === affectedType)
      {
        let cardDamage = card.firstChild.firstChild;
        cardDamage.style.cssText = "background-color: rgb(255, 63, 29);";
        let newDamage = Math.ceil(Number(cardDamage.textContent) / 2);
        sectionScore.textContent = Number(sectionScore.textContent) - (Number(cardDamage.textContent) - newDamage);
        cardDamage.textContent = newDamage;
      }
    }
  }
}

function setWinner() {
  if (Number(playerScore.textContent) > Number(enemyScore.textContent))
    commentaryText.textContent = 'Player Won!';
  else if (Number(playerScore.textContent) < Number(enemyScore.textContent))
    commentaryText.textContent = 'Enemy Won!';
  else
    commentaryText.textContent = 'A Tie!';
}