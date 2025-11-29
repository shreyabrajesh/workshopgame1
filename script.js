const player = document.getElementById('player');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const overlay = document.getElementById('overlay');
const overlayClose = document.getElementById('overlayClose');
const overlayTitle = document.getElementById('overlayTitle');
const overlayText = document.getElementById('overlayText');
const lightIndicator = document.getElementById('lightIndicator');
const progressEl = document.getElementById('progress');
const livesEl = document.getElementById('lives');
const log = document.getElementById('log');
const moveBtn = document.getElementById('moveBtn');

let progress = 0;
let lives = 3;
let isMoving = false;
let gameActive = false;
let currentLight = 'GREEN';
let lightTimer = null;
let moveInterval = null;

function logMsg(text){
  const p = document.createElement('div');
  p.textContent = text;
  log.prepend(p);
}

function setLight(color){
  currentLight = color;
  lightIndicator.textContent = color;

  if(color === 'GREEN'){
    lightIndicator.classList.add("green");
    lightIndicator.classList.remove("red");
  } else {
    lightIndicator.classList.add("red");
    lightIndicator.classList.remove("green");
  }
}

function random(min, max){
  return Math.random() * (max - min) + min;
}

function startLightCycle(){
  function cycle(){
    setLight('GREEN');
    logMsg("GREEN — you may move");
    setTimeout(()=>{

      setLight('RED');
      logMsg("RED — STOP!");

      setTimeout(()=>{
        if(gameActive) cycle();
      }, random(1500, 3500));

    }, random(2000, 4000));
  }
  cycle();
}

function startGame(){
  progress = 0;
  lives = 3;
  gameActive = true;
  overlay.classList.add("hidden");
  startLightCycle();
  updateAll();
  logMsg("Game started");
}

function resetGame(){
  progress = 0;
  lives = 3;
  gameActive = false;
  overlay.classList.add("hidden");
  updateAll();
  setLight("GREEN");
}

function updatePlayer(){
  const field = document.querySelector('.field');
  const maxTravel = field.clientHeight - 120;
  const y = (progress / 100) * maxTravel;
  player.style.bottom = (8 + y) + "px";
}

function updateAll(){
  progressEl.textContent = Math.round(progress);
  livesEl.textContent = lives;
  updatePlayer();
}

function startMoving(){
  if(!gameActive) return;
  if(isMoving) return;
  isMoving = true;

  moveInterval = setInterval(()=>{
    if(currentLight === "RED"){
      loseLife("Moved on RED");
      stopMoving();
      return;
    }
    progress += 0.5;
    if(progress >= 100){
      progress = 100;
      winGame();
      stopMoving();
    }
    updateAll();
  }, 30);
}

function stopMoving(){
  isMoving = false;
  clearInterval(moveInterval);
}

function loseLife(reason){
  lives--;
  logMsg("❌ " + reason + ". Lives left: " + lives);
  updateAll();

  if(lives <= 0){
    endGame(false);
  }
}

function winGame(){
  endGame(true);
}

function endGame(won){
  gameActive = false;
  clearTimeout(lightTimer);
  stopMoving();

  overlay.classList.remove("hidden");

  if(won){
    overlayTitle.textContent = "You Win!";
    overlayText.textContent = "Great job! Press reset to play again.";
  } else {
    overlayTitle.textContent = "Game Over";
    overlayText.textContent = "You lost all lives. Try again!";
  }
}

// EVENTS
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
overlayClose.addEventListener("click", ()=>overlay.classList.add("hidden"));

moveBtn.addEventListener("pointerdown", startMoving);
moveBtn.addEventListener("pointerup", stopMoving);
moveBtn.addEventListener("pointerleave", stopMoving);

window.addEventListener("keydown", (e)=>{
  if(e.key === "ArrowUp") startMoving();
});
window.addEventListener("keyup", (e)=>{
  if(e.key === "ArrowUp") stopMoving();
});

resetGame();
