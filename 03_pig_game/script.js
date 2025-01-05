"use strict";

// selecting elements
const score0 = document.getElementById('score--0');
const score1 = document.getElementById('score--1');
// let dice = document.getElementsByClassName('dice'); // if take element by className, the type will be array of html collection
const dice = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');

let currentScore = 0;
let activePlayer = 0;
let scores = [0, 0];

// starting condition
score0.textContent = 0;
score1.textContent = 0;

dice.classList.add('hidden');

function resetGame() {
  
    activePlayer = 0;
    currentScore = 0;
    scores = [0, 0];
    score0.textContent = 0;
    score1.textContent = 0;
    document.getElementById(`current--0`).textContent = 0;
    document.getElementById(`current--1`).textContent = 0;
    dice.classList.add('hidden');
    player0.classList.add('player--active');
    player1.classList.remove('player--active', 'player--winner');
}

function switchPlayer() {
    scores[activePlayer] = scores[activePlayer] + currentScore;
    document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];
    currentScore = 0;
    if (scores[activePlayer] >= 20) {
        // document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
        alert(`Congratulation🎉. Player ${activePlayer + 1} won.`)
        resetGame();
        return;
    }
    document.getElementById(`current--${activePlayer}`).textContent = currentScore;
    activePlayer = activePlayer === 0 ? 1 : 0;
    player0.classList.toggle('player--active');
    player1.classList.toggle('player--active');
}

// rolling dice 
btnRoll.addEventListener('click', () => {
    // 1. generating random dice roll
    const diceNumber = Math.trunc(Math.random() * 6) + 1;

    // 2. display the dice
    dice.src = 'dice-' + diceNumber + '.png';  // we can also use setAttribute()
    dice.classList.remove('hidden');

    // 3. Check for rolled 1 , if true switch player.
    if (diceNumber !== 1) {
        currentScore += diceNumber;
        document.getElementById(`current--${activePlayer}`).textContent = currentScore;
    } else {
        switchPlayer();
    }

});

btnHold.addEventListener('click', () => {
    switchPlayer();

});

btnNew.addEventListener('click', () => {
    resetGame();
})

