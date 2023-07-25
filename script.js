// Game variables
let originBoard;
let huTurn = true;
let xScore = 0;
let circleScore = 0;
let gameMode = "computer";
const huPlayer = "X";
const aiPlayer = "O";
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

// DOM elements
const cellElements = document.querySelectorAll(".data-cell");
const endRound = document.querySelector(".end-round");
const endGame = document.querySelector(".end-game");
const restartBtn = document.getElementById("restart-btn");
const startBtn = document.getElementById("start");

// Event listeners
restartBtn.addEventListener("click", restart);
document.getElementById("single").addEventListener("click", () => {
  gameMode = "computer";
});
document.getElementById("multi").addEventListener("click", () => {
  gameMode = "multi-player";
});

// Game functions
function startGame() {
  originBoard = Array.from(Array(9).keys());
  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
  });
}

function handleClick(e) {
  const cell = e.target;
  const cellId = e.target.id;
  const currentPlayer = huTurn ? huPlayer : aiPlayer;

  placeMark(cell, currentPlayer, cellId);

  if (checkWinner(originBoard, currentPlayer)) displayResult(currentPlayer);
  if (!checkWinner(originBoard, currentPlayer)) checkDraw();
  switchTurns();

  if (gameMode === "computer" && !huTurn) {
    let aiMove = bestSpot();
    console.log(aiMove);
    makeComputerMove(aiMove);
  }
}

function placeMark(cell, currentPlayer, cellId) {
  originBoard[cellId] = currentPlayer;
  console.log(currentPlayer);

  if (currentPlayer == huPlayer) {
    cell.classList.add("x");
  } else {
    cell.classList.add("circle");
  }
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
  return huTurn ? huPlayer : aiPlayer;
}

function switchTurns() {
  huTurn = !huTurn;
  switchDash();
}

function switchDash() {
  document.querySelector(".icon.circle").classList.toggle("dash");
  document.querySelector(".icon.x").classList.toggle("dash");
}

function checkDraw() {
  emptySpaces(originBoard);
  if (emptySpaces(originBoard).length === 0) {
    updateScore("IT'S A DRAW");
  }
}

function emptySpaces(board) {
  return board.filter((arr) => typeof arr === "number");
}

function makeComputerMove(cellId) {
  originBoard[cellId] = aiPlayer;
  document.getElementById(cellId).classList.add("circle");
}

function bestSpot() {
  return minimax(originBoard, aiPlayer).index;
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

// the main minimax function
function minimax(newBoard, player) {
  //available spots
  var availSpots = emptySpaces(newBoard);

  if (checkWinner(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWinner(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  // an array to collect all the objects
  var moves = [];

  // loop through available spots
  for (var i = 0; i < availSpots.length; i++) {
    //create an object for each and store the index of that spot that was stored as a number in the object's index key
    var move = {};
    move.index = newBoard[availSpots[i]];

    // set the empty spot to the current player
    newBoard[availSpots[i]] = player;

    //if collect the score resulted from calling minimax on the opponent of the current player
    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    //reset the spot to empty
    newBoard[availSpots[i]] = move.index;

    // push the object to the array
    moves.push(move);
  }

  // if it is the computer's turn loop over the moves and choose the move with the highest score
  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    // else loop over the moves and choose the move with the lowest score
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  // return the chosen move (object) from the array to the higher depth

  return moves[bestMove];
}

// Start the game initially
startBtn.addEventListener("click", () => {
  document.querySelector(".intro").style.display = "none";
  document.querySelector(".container").style.display = "flex";
  startGame();
});

// Quit the game
endGame.addEventListener("click", () => {
  restart();
  document.querySelector(".intro").style.display = "flex";
  document.querySelector(".container").style.display = "none";
});
