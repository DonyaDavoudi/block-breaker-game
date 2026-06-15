const container = document.querySelector(".container");
let conDim = container.getBoundingClientRect();

const gameover = document.createElement("div");
gameover.textContent = "Start Game";
gameover.style.position = "absolute";
gameover.style.color = "black";
gameover.style.lineHeight = "100px";
gameover.style.textAlign = "center";
gameover.style.fontSize = "2em";
gameover.style.fontFamily = "monospace";
gameover.style.textTransform = "uppercase";
gameover.style.backgroundColor = "#B6EE16";
gameover.style.width = "100%";
gameover.addEventListener("click", startGame);
container.appendChild(gameover);

const ball = document.createElement("div");
ball.style.position = "absolute";
ball.style.width = "30px";
ball.style.height = "30px";
ball.style.backgroundColor = "white";
ball.style.borderRadius = "25px";
ball.style.backgroundImage = "url('ball.png')";
ball.style.backgroundSize = "30px 30px";
ball.style.top = "70%";
ball.style.left = "50%";
ball.style.display = "none";
container.appendChild(ball);

const paddle = document.createElement("div");
paddle.style.position = "absolute";
paddle.style.backgroundColor = "white";
paddle.style.width = "100px";
paddle.style.height = "20px";
paddle.style.bottom = "30px";
paddle.style.left = "45%";
paddle.style.borderRadius = "10px";
container.appendChild(paddle);

document.addEventListener("keydown", function (e) {
  //console.log(e.keyCode);
  if (e.keyCode === 37) paddle.left = true;
  if (e.keyCode === 39) paddle.right = true;
});

document.addEventListener("keyup", function (e) {
  //console.log(e.keyCode);
  if (e.keyCode === 37) paddle.left = false;
  if (e.keyCode === 39) paddle.right = false;
  if (e.keyCode === 38 && !player.inplay && !player.gameover) {
    player.inplay = true;
    player.ballDir = [2, -5];
  }
});

const player = {
  gameover: true,
};

function startGame() {
  if (player.gameover) {
    player.gameover = false;
    player.inplay = false;
    gameover.style.display = "none";
    player.score = 0;
    player.lives = 3;
    ball.style.display = "block";
    setupBricks(30);
    resetBall();
    scoreUpdate();
    window.requestAnimationFrame(update);
  }
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
  }

  scoreUpdate();
  resetBall();
}

function endGame() {
  player.gameover = true;
  player.inplay = false;
  ball.style.display = "none";
  gameover.style.display = "block";
  gameover.innerHTML = "GAME OVER<br>Your score: " + player.score;
  let bricks = document.querySelectorAll(".brick");
  for (let brick of bricks) {
    brick.remove();
  }
}

function nextLevel() {
  player.inplay = false;
  setupBricks(30);
  resetBall();
}

function setupBricks(num) {
  let row = {
    x: (conDim.width % 100) / 2,
    y: 50,
  };
  let skip = false;
  console.log(row);
  for (let x = 0; x < num; x++) {
    if (row.x > conDim.width - 100) {
      row.y += 50;
      if (row.y > conDim.height / 2) {
        skip = true;
      }
      row.x = (conDim.width % 100) / 2;
    }
    row.count = x;
    if (!skip) {
      createBrick(row);
    }
    row.x += 100;
  }
}

function createBrick(pos) {
  const div = document.createElement("div");
  div.setAttribute("class", "brick");
  div.style.backgroundColor = randomColor();
  div.textContent = pos.count + 1;
  div.style.left = pos.x + "px";
  div.style.top = pos.y + "px";
  container.appendChild(div);
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  //console.log(aRect);
  //console.log(bRect);
  return !(
    aRect.right < bRect.left ||
    aRect.left > bRect.right ||
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom
  );
}

function randomColor() {
  return "#" + Math.random().toString(16).substr(-6);
}

function scoreUpdate() {
  document.querySelector(".score").textContent = player.score;
  document.querySelector(".lives").textContent = player.lives;
}

function update() {
  if (!player.gameover) {
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
  }

  if (posBall.y < 0) {
    player.ballDir[1] *= -1;
  }
  if (posBall.x > conDim.width - 20 || posBall.x < 0) {
    player.ballDir[0] *= -1;
  }

  if (isCollide(paddle, ball)) {
    let temp = (posBall.x - (paddle.offsetLeft + paddle.offsetWidth / 2)) / 10;
    console.log("hit");
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
