// =======================
// DOM ELEMENTS
// =======================
const container = document.querySelector(".container");
const startButton = document.querySelector(".start-button");
const howButton = document.querySelector(".how-button");
const quitButton = document.querySelector(".quit-button");
const exitButton = document.querySelector(".exit-button");

// =======================
// GAME AREA SIZE
// =======================
let conDim = {
  width: container.clientWidth,
  height: container.clientHeight,
};

// =======================
// CREATED UI AND GAME ELEMENTS
// =======================
const howPopup = document.createElement("div");
howPopup.className = "how-popup";
howPopup.innerHTML = `
  <div class="how-card">
    <button class="how-close" type="button">×</button>

    <h2>HOW TO PLAY</h2>

    <div class="how-controls">
      <div class="control-row">
        <div class="key-group">
          <span class="key">←</span>
          <span class="key">→</span>
        </div>
        <div>
          <strong>MOVE</strong>
          <p>Use left and right arrow keys to move the paddle.</p>
        </div>
      </div>

      <div class="control-row">
        <div class="key-group">
          <span class="key key-wide">↑</span>
        </div>
        <div>
          <strong>LAUNCH</strong>
          <p>Press up arrow when the ball is sitting on the paddle.</p>
        </div>
      </div>

      <div class="control-row">
        <div class="key-group">
          <span class="key key-wide">START</span>
        </div>
        <div>
          <strong>START GAME</strong>
          <p>Click START GAME to begin or retry after losing.</p>
        </div>
      </div>
    </div>

    <div class="how-goal">
      Break all bricks to reach the next level. Missing the ball removes one heart.
    </div>
  </div>
`;
document.body.appendChild(howPopup);

const gameover = document.createElement("div");
gameover.className = "gameover-banner";
gameover.style.display = "none";
container.appendChild(gameover);

const ball = document.createElement("div");
ball.className = "ball";
ball.style.display = "none";
container.appendChild(ball);

const paddle = document.createElement("div");
paddle.className = "paddle";
container.appendChild(paddle);

// =======================
// GAME STATE
// =======================
const player = {
  started: false,
  gameover: false,
};

// =======================
// EVENT LISTENERS
// =======================

// Menu buttons
startButton.addEventListener("click", startGame);

quitButton.addEventListener("click", function () {
  window.location.reload();
});

exitButton.addEventListener("click", function () {
  window.close();

  setTimeout(function () {
    alert("Your browser blocked closing this tab. Please close it manually.");
  }, 200);
});

howButton.addEventListener("click", function () {
  howPopup.style.display = "flex";
});

// Popup controls
howPopup.addEventListener("click", function (e) {
  if (e.target === howPopup || e.target.classList.contains("how-close")) {
    howPopup.style.display = "none";
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    howPopup.style.display = "none";
  }
});

// Keyboard controls
document.addEventListener("keydown", function (e) {
  if (e.keyCode === 37) paddle.left = true;
  if (e.keyCode === 39) paddle.right = true;
});

document.addEventListener("keyup", function (e) {
  if (e.keyCode === 37) paddle.left = false;
  if (e.keyCode === 39) paddle.right = false;

  if (
    e.keyCode === 38 &&
    player.started &&
    !player.inplay &&
    !player.gameover
  ) {
    player.inplay = true;
    let speed = 5 + player.level;
    player.ballDir = [2, -speed];
  }
});

// =======================
// GAME FLOW
// =======================
function startGame() {
  if (player.started && !player.gameover) {
    return;
  }

  player.started = true;
  player.gameover = false;
  player.inplay = false;

  gameover.style.display = "none";

  player.score = 0;
  player.lives = 5;
  player.level = 1;

  ball.style.display = "block";

  clearBricks();
  setupBricks(16);
  resetBall();
  scoreUpdate();

  window.requestAnimationFrame(update);
}

function resetBall() {
  player.inplay = false;
  ball.style.left =
    paddle.offsetLeft + paddle.offsetWidth / 2 - ball.offsetWidth / 2 + "px";
  ball.style.top = paddle.offsetTop - ball.offsetHeight - 5 + "px";
}

function fallOff() {
  player.lives--;

  if (player.lives <= 0) {
    player.lives = 0;
    scoreUpdate();
    endGame();
    return;
  }

  scoreUpdate();
  resetBall();
}

function endGame() {
  player.started = false;
  player.gameover = true;
  player.inplay = false;

  ball.style.display = "none";

  gameover.innerHTML = `
  <div class="gameover-card">
    <span class="gameover-label">GAME OVER</span>
    <strong>YOU LOST</strong>
    <span class="gameover-score">SCORE ${player.score}</span>
    <span class="gameover-hint">CLICK START TO RETRY</span>
  </div>
`;

  gameover.style.display = "flex";

  clearBricks();
}

function nextLevel() {
  player.level++;
  player.inplay = false;

  let brickAmount = 16 + player.level * 5;
  setupBricks(brickAmount);

  scoreUpdate();
  resetBall();
}

// =======================
// GAME LOOP
// =======================
function update() {
  if (player.started && !player.gameover) {
    let pCurrent = paddle.offsetLeft;

    if (paddle.left) {
      pCurrent -= 5;
    }

    if (paddle.right) {
      pCurrent += 5;
    }

    if (pCurrent < 0) {
      pCurrent = 0;
    }

    if (pCurrent > conDim.width - paddle.offsetWidth) {
      pCurrent = conDim.width - paddle.offsetWidth;
    }

    paddle.style.left = pCurrent + "px";

    if (player.inplay) {
      moveBall();
    } else {
      resetBall();
    }

    window.requestAnimationFrame(update);
  }
}

function moveBall() {
  let posBall = {
    x: ball.offsetLeft,
    y: ball.offsetTop,
  };

  if (posBall.y > conDim.height - ball.offsetHeight) {
    fallOff();
    return;
  }

  if (posBall.y < 0) {
    player.ballDir[1] *= -1;
  }

  if (posBall.x > conDim.width - 20 || posBall.x < 0) {
    player.ballDir[0] *= -1;
  }

  if (isCollide(paddle, ball)) {
    let temp = (posBall.x - (paddle.offsetLeft + paddle.offsetWidth / 2)) / 10;
    player.ballDir[0] = temp;
    player.ballDir[1] *= -1;
  }

  let bricks = document.querySelectorAll(".brick");

  for (let tBrick of bricks) {
    if (isCollide(tBrick, ball)) {
      player.ballDir[1] *= -1;
      tBrick.parentNode.removeChild(tBrick);
      player.score++;
      scoreUpdate();

      if (document.querySelectorAll(".brick").length === 0) {
        nextLevel();
      }
    }
  }

  posBall.y += player.ballDir[1];
  posBall.x += player.ballDir[0];

  ball.style.top = posBall.y + "px";
  ball.style.left = posBall.x + "px";
}

// =======================
// BRICKS
// =======================
function setupBricks(num) {
  conDim = {
    width: container.clientWidth,
    height: container.clientHeight,
  };

  const brickWidth = 104;
  const brickHeight = 34;
  const gapX = 8;
  const gapY = 10;
  const sidePadding = 34;
  const topPadding = 50;

  const availableWidth = conDim.width - sidePadding * 2;
  const columns = Math.floor((availableWidth + gapX) / (brickWidth + gapX));

  const totalRowWidth = columns * brickWidth + (columns - 1) * gapX;
  const startX = (conDim.width - totalRowWidth) / 2;

  for (let i = 0; i < num; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);

    const x = startX + col * (brickWidth + gapX);
    const y = topPadding + row * (brickHeight + gapY);

    if (y + brickHeight > conDim.height / 2) {
      return;
    }

    createBrick({
      x: x,
      y: y,
      count: i,
    });
  }
}

function createBrick(pos) {
  const div = document.createElement("div");

  const colors = [
    ["#ffc7dc", "#f27aaa", "#d85f91"], // pink
    ["#b8ccff", "#82a5f5", "#6377d7"], // blue
    ["#c9a7ff", "#a875e8", "#8058cf"], // purple
    ["#b8f0dc", "#83d8b5", "#57aa97"], // green
    ["#ffd18f", "#f6aa62", "#df7b61"], // orange
    ["#ffb8c4", "#f47f8f", "#dc626d"], // coral
  ];

  const color = colors[Math.floor(Math.random() * colors.length)];

  div.setAttribute("class", "brick");
  div.style.setProperty("--brick-top", color[0]);
  div.style.setProperty("--brick-mid", color[1]);
  div.style.setProperty("--brick-bottom", color[2]);

  div.style.left = pos.x + "px";
  div.style.top = pos.y + "px";

  container.appendChild(div);
}

function clearBricks() {
  let bricks = document.querySelectorAll(".brick");

  for (let brick of bricks) {
    brick.remove();
  }
}

// =======================
// COLLISION
// =======================
function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();

  return !(
    aRect.right < bRect.left ||
    aRect.left > bRect.right ||
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom
  );
}

// =======================
// HUD
// =======================
function scoreUpdate() {
  document.querySelector(".score").textContent = player.score;
  document.querySelector(".lives").textContent = "❤ "
    .repeat(player.lives)
    .trim();
  document.querySelector(".level").textContent = player.level;
}

/*var start = null;

function step(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  container.style.transform =
    "translateX(" + Math.min(progress / 10, 200) + "px)";
  if (progress < 2000) {
    console.log(progress);
    window.requestAnimationFrame(step);
  }
}
window.requestAnimationFrame(step);*/
