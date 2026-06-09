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
ball.backgroundSize = "30px 30px";
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

function startGame() {
  console.log("start");
  window.requestAnimationFrame(update);
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
