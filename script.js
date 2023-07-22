var originBoard;
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

const startgame = (() => {
  originBoard = Array.from(Array(9).keys());
  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
  });
})();

const restart = (() => {
  restartBtn.addEventListener("click", () => {
    document.querySelector("#x-score").textContent = "0";
    document.querySelector("#circle-score").textContent = "0";
    document.querySelector("#message").textContent = "";
    endRound.style.display = "none";
    startgame();
  });
})();

function handleClick(e) {
  const cell = e.target;
  const currentPlayer = aiTurn ? aiPlayer : huPlayer;
  console.log(currentPlayer);

  const cellId = e.target.id;

  placeMark(cell, currentPlayer, cellId);

  //check winner
  if (checkWinner(originBoard, currentPlayer)) {
    displayResult(currentPlayer);
  }

  //switch turns
  switchTurns();
}

//place marks on the cell
function placeMark(cell, currentPlayer, cellId) {
  cell.classList.remove("circle");
  cell.classList.remove("x");
  originBoard[cellId] = currentPlayer;

  if (currentPlayer == huPlayer) {
    cell.classList.add("circle");
  } else {
    cell.classList.add("x");
  }
}

// check winner
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
  updateScore(player);
}

function updateScore(player) {
  document.querySelector("#x-score").textContent = xScore;
  document.querySelector("#circle-score").textContent = circleScore;
  document.querySelector("#message").textContent = `${player} WINS THE ROUND`;
  endRound.style.display = "flex";
}

// switch turns between players
function switchTurns() {
  aiTurn = !aiTurn;
}
