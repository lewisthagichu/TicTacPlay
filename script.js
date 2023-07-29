// Game variables
let originBoard;
let huTurn = true;
let xScore = 0;
let circleScore = 0;
let gameMode = "";

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
const difficultyOptions = {
  easy: "easy",
  medium: "medium",
  unbeatable: "unbeatable",
};
let difficulty = difficultyOptions.easy;

// DOM elements
const cellElements = document.querySelectorAll(".data-cell");
const endRound = document.querySelector(".end-round");
const endGame = document.querySelector(".end-game");
const restartBtn = document.getElementById("restart-btn");
const startBtn = document.getElementById("start");
const p1Name = document.getElementById("p1-name");
const p2Name = document.getElementById("p2-name");
const player1 = document.getElementById("player-1");
const player2 = document.getElementById("player-2");

// Event listeners
restartBtn.addEventListener("click", restart);

function startGame() {
  chooseGameMode();
  gameDifficulty();
  originBoard = Array.from(Array(9).keys());
  makeComputerFirstMove();
  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
  });
}

// Choose a game mode
function chooseGameMode() {
  document.getElementById("single").addEventListener("click", () => {
    gameMode = "computer";
    document.querySelector(".mode").style.display = "none";
    document.querySelector(".difficulty").style.display = "flex";
    p2Name.textContent = "AI";
    p2Name.placeholder = "AI";
    p2Name.readOnly = true;
  });
  document.getElementById("multi").addEventListener("click", () => {
    gameMode = "multi-player";
    document.querySelector(".mode").style.display = "none";
    document.querySelector(".names").style.display = "flex";
  });
}

// Choose difficulty
function gameDifficulty() {
  document.getElementById("easy").addEventListener("click", () => {
    difficulty = difficultyOptions.easy;
    showName();
  });
  document.getElementById("medium").addEventListener("click", () => {
    difficulty = difficultyOptions.medium;
    showName();
  });
  document.getElementById("unbeatable").addEventListener("click", () => {
    difficulty = difficultyOptions.unbeatable;
    showName();
  });
}

function showName() {
  document.querySelector(".difficulty").style.display = "none";
  document.querySelector(".names").style.display = "flex";
}

function setName() {
  const p1NameValue = p1Name.value.trim();
  const p2NameValue = p2Name.value.trim();
  console.log(p1NameValue);

  if (p1NameValue === "") {
    player1.textContent = "Player 1";
  } else if (p2NameValue === "") {
    player2.textContent = "Player 2";
  } else {
    player1.textContent = p1NameValue;
    player2.textContent = p2NameValue;
  }
}

// Game functions
function handleClick(e) {
  const cell = e.target;
  const cellId = e.target.id;
  const currentPlayer = huTurn ? huPlayer : aiPlayer;

  if (gameMode === "multi-player") {
    placeMark(cell, currentPlayer, cellId);
    if (!checkWinner(originBoard, currentPlayer)) checkDraw(currentPlayer);
    switchTurns();
  }

  if (gameMode === "computer") {
    if (huTurn && typeof originBoard[cellId] === "number") {
      placeMark(cell, currentPlayer, cellId);
      switchTurns();
      if (
        !checkWinner(originBoard, currentPlayer) &&
        !checkDraw(currentPlayer) &&
        !huTurn
      ) {
        makeComputerMove(bestSpot());
        checkDraw(currentPlayer);
        switchTurns();
      }
    }
  }
}

function placeMark(cell, currentPlayer, cellId) {
  originBoard[cellId] = currentPlayer;

  currentPlayer == huPlayer
    ? cell.classList.add("x")
    : cell.classList.add("circle");

  let gameWon = checkWinner(originBoard, currentPlayer);
  if (gameWon) gameOver(currentPlayer);
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
  player == huPlayer ? xScore++ : circleScore++;
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
}

function checkDraw(player) {
  emptySpaces(originBoard);
  if (
    emptySpaces(originBoard).length === 0 &&
    !checkWinner(originBoard, player)
  ) {
    updateScore("IT'S A DRAW");
    return true;
  }
  return false;
}

function emptySpaces(board) {
  return board.filter((arr) => typeof arr === "number");
}

function makeComputerMove(cellId) {
  originBoard[cellId] = aiPlayer;
  document.getElementById(cellId).classList.add("circle");

  let gameWon = checkWinner(originBoard, aiPlayer);
  if (gameWon) gameOver(aiPlayer);
}

function makeComputerFirstMove() {
  if (gameMode === "computer" && !huTurn) {
    makeComputerMove(bestSpot());
    switchTurns();
  }
}

function bestSpot() {
  if (difficulty === difficultyOptions.easy) {
    return easyAI();
  } else if (difficulty === difficultyOptions.medium) {
    return mediumAI(originBoard, aiPlayer);
  } else if (difficulty === difficultyOptions.unbeatable)
    return minimax(originBoard, aiPlayer).index;
}

function easyAI() {
  let arr = emptySpaces(originBoard);
  const randomIndex = Math.floor(Math.random() * arr.length);
  console.log(arr);
  console.log(arr[randomIndex]);
  return arr[randomIndex];
}

function mediumAI(board, player) {
  // Check for a winning move for the AI (aiPlayer)
  for (let i = 0; i < 9; i++) {
    if (board[i] === i) {
      board[i] = player;
      if (checkWinner(board, player)) {
        board[i] = i; // Reset the board state
        return i; // Return the winning move index
      }
      board[i] = i; // Reset the board state
    }
  }

  // Check for a winning move for the opponent (huPlayer)
  const opponentPlayer = player === huPlayer ? aiPlayer : huPlayer;
  for (let i = 0; i < 9; i++) {
    if (board[i] === i) {
      board[i] = opponentPlayer;
      if (checkWinner(board, opponentPlayer)) {
        board[i] = i; // Reset the board state
        return i; // Return the blocking move index
      }
      board[i] = i; // Reset the board state
    }
  }

  // If no winning moves are available, make a random move
  const emptyCells = emptySpaces(board);
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
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

function gameOver(player) {
  cellElements.forEach((cell) => {
    cell.removeEventListener("click", handleClick, { once: true });
  });
  displayResult(player);
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

startGame();
