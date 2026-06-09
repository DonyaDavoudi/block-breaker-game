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
  console.log(e.keyCode);
  if (e.keyCode === 37) paddle.left = true;
  if (e.keyCode === 39) paddle.right = true;
});

document.addEventListener("keyup", function (e) {
  console.log(e.keyCode);
  if (e.keyCode === 37) paddle.left = false;
  if (e.keyCode === 39) paddle.right = false;
});

const player = {
  gameover: true,
};

function startGame() {
  if (player.gameover) {
    player.gameover = false;
    gameover.style.display = "none";
    player.score = 0;
    player.lives = 3;
    ball.style.display = "block";
    setupBricks(10);
    scoreUpdate();
    window.requestAnimationFrame(update);
  }
}

function setupBricks(num) {
  let row = {
    x: (conDim.width % 100) / 2,
    y: 50,
  };
  console.log(row);
  for (let x = 0; x < num; x++) {
    if (row.x > conDim.width - 100) {
      row.y += 50;
      row.x = (conDim.width % 100) / 2;
    }
    row.count = x;
    createBrick(row);
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

function randomColor() {
  return "#" + Math.random().toString(16).substr(-6);
}

function scoreUpdate() {
  document.querySelector(".score").textContent = player.score;
  document.querySelector(".lives").textContent = player.lives;
}

function update() {
  let pCurrent = paddle.offsetLeft;
  console.log(pCurrent);
  if (paddle.left) {
    pCurrent -= 5;
  }
  if (paddle.right) {
    pCurrent += 5;
  }
  paddle.style.left = pCurrent + "px";
  window.requestAnimationFrame(update);
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
