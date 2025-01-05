'use strict';

const checkButton = document.querySelector('.check');
const message = document.querySelector('.message');
const score = document.querySelector('.score');
const guessNumber = document.querySelector('.number');
const highScore = document.querySelector('.highscore');
const playAgainButton = document.querySelector('.again');
const body = document.querySelector('body');

// console.log(number.style)
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let totalScore = 20;
let currentHighScore = 0;


checkButton.addEventListener('click', () => {

    const value = Number(document.querySelector('.guess').value);

    if (totalScore < 2) {
        message.textContent = "🧨 You Lost The Game";
        return;
    }

    if (!value) message.textContent = "⛔ No Number"
    else if (value === secretNumber) {
        
        message.textContent = "🎉 Congratulation";
        guessNumber.textContent = secretNumber;
        body.style.backgroundColor = '#60b347';
        guessNumber.style.width = '30rem';
        score.textContent = totalScore;

        if (totalScore > currentHighScore) {
            currentHighScore = totalScore;
            highScore.textContent = currentHighScore;
        }

    } else if (value < secretNumber) {
        totalScore--;
        message.textContent = "📉 Low Number";
        score.textContent = totalScore;
    }
    else if (value > secretNumber) {
        totalScore--;
        message.textContent = "📈 High Number";
        score.textContent = totalScore;
    }
});


playAgainButton.addEventListener('click',()=>{

    secretNumber = Math.trunc(Math.random() * 20) + 1;
    message.textContent = "Start guessing...";
    score.textContent = 20;
    guessNumber.textContent = '?';
    document.querySelector('.guess').value = '';
    body.style.backgroundColor='#222';
    guessNumber.style.width = '15rem';

});