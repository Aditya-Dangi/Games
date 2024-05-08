var time = 60;
var score = 0;
var hitNumber;
var eventNumber;
var lastHit;
var gameStarted = false;
var timer;
var closeBtn = document.querySelector(".close");


function timerFunction()
{
  timer = setInterval(() => 
  {
    if(time > 0)
    {
      time--;
      document.querySelector('#timer-box').textContent = time;
    }
    else
    {
      clearInterval(timer);
      score = document.querySelector('#score-box').textContent;
      var modal = document.getElementById("modal");
      var scoreDialog = document.getElementById("score-dialog");
      scoreDialog.textContent = score;
      modal.style.display = "block";
    }
  },1000);
}

function generateRandomHit()
{
  const hitBox =  document.querySelector('#hit-box');
  hitNumber = Math.floor(Math.random() * 10);
  hitBox.textContent = hitNumber;
}

function numberBubbles()
{
  var clutter = "";
  for(var i=1; i<145; i++)
  {
    let x = Math.floor(Math.random() * 10);
    clutter += `<div class="numbers-button">${x}</div>`;
  }
  document.querySelector('#panel-bottom').innerHTML = clutter;
}

function updateScore()
{
  document.querySelector('#score-box').textContent = score;
  score += 10;
}

function eventBubbling() 
{
  document.querySelector('#panel-bottom').addEventListener("click", function(event) {
    if (!gameStarted) 
    {
      return; 
    }
    if (event.target.classList.contains('numbers-button')) 
    {
      eventNumber = Number(event.target.textContent);
      document.querySelector('#your-hit-box').textContent = eventNumber;
      if(eventNumber === hitNumber)
      {
        generateRandomHit();
        updateScore();
        numberBubbles();
      }
      lastHit = eventNumber; 
    } 
    else 
    {
      document.querySelector('#your-hit-box').textContent = lastHit;
    }
  });
}

function startGame() 
{
  document.getElementById('start').addEventListener("click", () => {
    if (!gameStarted) 
    {
        gameStarted = true;
        timerFunction();
        generateRandomHit();
        updateScore();
        eventBubbling();
    }
  });
}

function resetGame() 
{
  clearInterval(timer); 
  time = 60; 
  score = 0;
  eventNumber = null;
  lastHit = null;
  gameStarted = false;
  document.querySelector('#timer-box').textContent = time;
  document.querySelector('#your-hit-box').textContent = '';
  document.querySelector('#score-box').textContent = score;
  document.querySelector('#panel-bottom').removeEventListener("click", eventBubbling);
}

closeBtn.addEventListener("click", function() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
});

numberBubbles();
startGame();

document.getElementById('reset').addEventListener("click", resetGame);