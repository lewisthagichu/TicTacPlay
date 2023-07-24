let originBoard;
let aiTurn = true;
let xScore = 0;
let circleScore = 0;
const aiPlayer = "X";
const huPlayer = "O";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

const cellElements = document.querySelectorAll(".data-cell");
const endRound = document.querySelector(".end-round");
const restartBtn = document.getElementById("restart-btn");

restartBtn.addEventListener("click", restart);
startGame();

function startGame() {
  originBoard = Array.from(Array(9).keys());
  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
  });
}

function handleClick(e) {
  const cell = e.target;
  const currentPlayer = aiTurn ? aiPlayer : huPlayer;
  const cellId = e.target.id;

  placeMark(cell, currentPlayer, cellId);

  if (checkWinner(originBoard, currentPlayer)) {
    displayResult(currentPlayer);
  }
  checkDraw();

  switchTurns();
}

function placeMark(cell, currentPlayer, cellId) {
  cell.classList.remove("circle");
  cell.classList.remove("x");
  originBoard[cellId] = currentPlayer;

  if (currentPlayer == huPlayer) cell.classList.add("circle");
  cell.classList.add("x");
}

function checkWinner(board, player) {
  const plays = board.reduce(
    (acc, arr, i) => (arr === player ? acc.concat(i) : acc),
    []
  );

  return winCombos.some((combination) => {
    return combination.every((index) => plays.includes(index));
  });
}

function displayResult(player) {
  player == huPlayer ? circleScore++ : xScore++;
  updateScore(`${getCurrentPlayer()} WINS THE ROUND`);
}

function updateScore(message) {
  document.querySelector("#x-score").textContent = xScore;
  document.querySelector("#circle-score").textContent = circleScore;
  declareWinner(message);
  endRound.style.display = "flex";
}

function declareWinner(message) {
  document.querySelector("#message").textContent = message;
}

function getCurrentPlayer() {
  return aiTurn ? aiPlayer : huPlayer;
}

function switchTurns() {
  aiTurn = !aiTurn;
  switchDash();
}

function switchDash() {
  document.querySelector(".icon.circle").classList.toggle("dash");
  document.querySelector(".icon.x").classList.toggle("dash");
}

function checkDraw() {
  availSpaces(originBoard);
  if (availSpaces(originBoard) === 0) {
    updateScore("IT'S A DRAW");
  }
}

function availSpaces(board) {
  return board.reduce((acc, arr) => {
    return typeof arr === "number" ? acc + 1 : acc;
  }, 0);
}

function restart() {
  xScore = 0;
  circleScore = 0;
  document.querySelector("#x-score").textContent = 0;
  document.querySelector("#circle-score").textContent = 0;
  document.querySelector("#message").textContent = "";
  endRound.style.display = "none";

  cellElements.forEach((cell) => {
    cell.classList.remove("circle");
    cell.classList.remove("x");
  });
  startGame();
}
