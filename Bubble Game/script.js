let time = 60;
let score = 0;
let hitNumber;
let lastHit;
let gameStarted = false;
let timer;

const panelBottom = document.querySelector('#panel-bottom');
const timerBox = document.querySelector('#timer-box');
const hitBox = document.querySelector('#hit-box');
const yourHitBox = document.querySelector('#your-hit-box');
const scoreBox = document.querySelector('#score-box');
const modal = document.getElementById("modal");
const scoreDialog = document.getElementById("score-dialog");
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const closeButton = document.querySelector(".close");

function numberBubbles() {
  const panelBottom = document.querySelector('#panel-bottom');
  const viewportWidth = window.innerWidth;
  let maxBubbles;
  
  if (viewportWidth > 2000) {
    maxBubbles = 128; 
  } else if (viewportWidth >= 1440) {
    maxBubbles = 105; 
  } else if (viewportWidth >= 1024) {
    maxBubbles = 126; 
  } else if (viewportWidth >= 768) {
    maxBubbles = 100; 
  } else {
    maxBubbles = 84; 
  }

  let clutter = "";
  for (let i = 0; i < maxBubbles; i++) {
    let x = Math.floor(Math.random() * 10);
    clutter += `<div class="numbers-button">${x}</div>`;
  }
  panelBottom.innerHTML = clutter;
}

function startGame() {
  startButton.addEventListener("click", () => {
    if (!gameStarted) {
      gameStarted = true;
      timerFunction();
      generateRandomHit();
      updateScore();
      eventBubbling();
    }
  });
}

function resetGame() {
  clearInterval(timer); 
  time = 60; 
  score = 0;
  hitNumber = null;
  lastHit = null;
  gameStarted = false;
  timerBox.textContent = time;
  yourHitBox.textContent = '';
  scoreBox.textContent = score;
  panelBottom.innerHTML = '';
  panelBottom.removeEventListener("click", eventBubbling);
  numberBubbles();
}

function timerFunction() {
  timer = setInterval(() => {
    if (time > 0) {
      time--;
      timerBox.textContent = time;
    } else {
      clearInterval(timer);
      score = scoreBox.textContent;
      scoreDialog.textContent = score;
      modal.style.display = "block";
    }
  }, 1000);
}

function generateRandomHit() {
  hitNumber = Math.floor(Math.random() * 10);
  hitBox.textContent = hitNumber;
}

function updateScore() {
  score += 10;
  scoreBox.textContent = score;
}

function eventBubbling() {
  panelBottom.addEventListener("click", function(event) {
    if (!gameStarted) {
      return;
    }
    if (event.target.classList.contains('numbers-button')) {
      const eventNumber = Number(event.target.textContent);
      yourHitBox.textContent = eventNumber;
      if (eventNumber === hitNumber) {
        generateRandomHit();
        updateScore();
        numberBubbles();
      }
      lastHit = eventNumber;
    } else {
      yourHitBox.textContent = lastHit;
    }
  });
}

window.addEventListener('resize', numberBubbles);

closeButton.addEventListener("click", function() {
  modal.style.display = "none";
});

numberBubbles();
startGame();

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
