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
const form = document.getElementById("form");
const cellElements = document.querySelectorAll(".data-cell");
const endRound = document.querySelector(".end-round");
const endGame = document.querySelector(".end-game");
const restartBtn = document.getElementById("restart-btn");
const startBtn = document.getElementById("start");
const p1Name = document.getElementById("p1-name");
const p2Name = document.getElementById("p2-name");
const player1 = document.getElementById("player-1");
const player2 = document.getElementById("player-2");
const board = document.getElementById("board");

// Event listeners
restartBtn.addEventListener("click", restart);

function startGame() {
  chooseGameMode();
  gameDifficulty();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setName();
  });

  originBoard = Array.from(Array(9).keys());
  setBoardHoverClass();
  makeComputerFirstMove();
  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
  });
}

// Choose a game mode
function chooseGameMode() {
  document.getElementById("single").addEventListener("click", () => {
    gameMode = "computer";
    removeCard(".mode");
    setTimeout(() => {
      document.querySelector(".mode").style.display = "none";
      document.querySelector(".difficulty").style.display = "flex";
      addCard(".difficulty");
    }, 1000);

    p2Name.style.cursor = "not-allowed";
    p2Name.value = "AI";
    p2Name.placeholder = "AI";
    p2Name.readOnly = true;
  });
  document.getElementById("multi").addEventListener("click", () => {
    p2Name.placeholder = "Player 2";
    p2Name.readOnly = false;
    gameMode = "multi-player";
    removeCard(".mode");
    setTimeout(() => {
      document.querySelector(".mode").style.display = "none";
      document.querySelector(".names").style.display = "flex";
      addCard(".names");
    }, 1000);
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
  removeCard(".difficulty");
  setTimeout(() => {
    document.querySelector(".difficulty").style.display = "none";
    document.querySelector(".names").style.display = "flex";
    addCard(".names");
  }, 1000);
}

function setName() {
  const p1NameValue = p1Name.value.trim();
  const p2NameValue = p2Name.value.trim();
  const small1 = document.getElementById("small-1");
  const small2 = document.getElementById("small-2");

  if (p1NameValue.length > 10) {
    small1.textContent = "Name should have maximum 10 characters";
  } else if (p2NameValue > 10) {
    small2.textContent = "Name should have maximum 10 characters";
  } else {
    player1.textContent = p1NameValue;
    player2.textContent = p2NameValue;
  }

  if (small1.textContent == "" && small2.textContent == "") {
    removeCard(".names");
    setTimeout(() => {
      document.querySelector(".names").style.display = "none";
      document.querySelector(".start-game").style.display = "flex";
      addCard(".start-game");
    }, 1000);
  }
}

// Game functions
function handleClick(e) {
  const cell = e.target;
  const cellId = e.target.id;
  const currentPlayer = huTurn ? huPlayer : aiPlayer;

  if (gameMode === "multi-player") {
    placeMark(cell, currentPlayer, cellId);
    if (!checkWinner(originBoard, currentPlayer)) checkDraw();
    switchTurns();
    setBoardHoverClass();
  }

  if (gameMode === "computer") {
    if (huTurn && typeof originBoard[cellId] === "number") {
      placeMark(cell, currentPlayer, cellId);
      switchTurns();
      setBoardHoverClass();
      if (!checkWinner(originBoard, currentPlayer) && !checkDraw() && !huTurn) {
        makeComputerMove(bestSpot());
        checkDraw();
        switchTurns();
        setBoardHoverClass();
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
  if (player == huPlayer) {
    updateScore(
      `Congratulations ${player1.textContent.toUpperCase()}, you've mastered the board!`
    );
  }
  if (player == aiPlayer) {
    updateScore(
      `Resistance is futile! ${player2.textContent.toUpperCase()} trumphs over all challengers!`
    );
  }
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

function setBoardHoverClass() {
  board.classList.remove("x");
  board.classList.remove("circle");

  if (huTurn) {
    board.classList.add("x");
  } else {
    board.classList.add("circle");
  }
}

function checkDraw() {
  const isBoardFull = emptySpaces(originBoard).length === 0;
  const isAiWinner = checkWinner(originBoard, aiPlayer);
  const isHuWinner = checkWinner(originBoard, huPlayer);

  if (isBoardFull && !isAiWinner && !isHuWinner) {
    updateScore("IT'S A DRAW");
    return true;
  }

  return false;
}

function emptySpaces(board) {
  return board.filter((arr) => typeof arr === "number");
}

function makeComputerMove(cellId) {
  setTimeout(() => {
    originBoard[cellId] = aiPlayer;
    document.getElementById(cellId).classList.add("circle");

    let gameWon = checkWinner(originBoard, aiPlayer);
    if (gameWon) gameOver(aiPlayer);
  }, 600);
}

function makeComputerFirstMove() {
  if (gameMode === "computer" && !huTurn) {
    makeComputerMove(bestSpot());
    switchTurns();
    setBoardHoverClass();
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
  p1Name.value = "";
  p2Name.value = "";
  document.querySelector(".landing").style.display = "none";
  document.querySelector(".mode").style.display = "flex";

  startBtnAnimation();
  setTimeout(() => {
    document.querySelector(".intro").style.display = "none";
    document.querySelector(".start-game").style.display = "none";
    document.querySelector(".container").style.display = "flex";
  }, 1000);
});

// Quit the game
endGame.addEventListener("click", () => {
  gameMode = "";

  document.querySelector(".container").style.display = "none";
  document.querySelector(".landing").style.display = "flex";
  landingAnimation();
  restart();
});

// ANIMATIONS
function landingAnimation() {
  const landingTL = gsap.timeline();

  landingTL
    .to(".big-text", { duration: 1, y: "0%", stagger: 0.25 })
    .to(".slider", { duration: 2, y: "-100%", delay: 0.5 })
    .to(".landing", { duration: 1, y: "-100%" }, "-=1.5")
    .to(".intro", { duration: 1, opacity: 1 })
    .fromTo(".top", { y: "-100%" }, { duration: 1, y: "0%", ease: "bounce" });
}

function removeCard(card) {
  const TL = gsap.timeline();

  TL.fromTo(card, { opacity: 1 }, { opacity: 0, duration: 1 });
}

function addCard(card) {
  const TL = gsap.timeline();

  TL.fromTo(card, { opacity: 0 }, { opacity: 1, duration: 1 });
}

function startBtnAnimation() {
  const TL = gsap.timeline({ defaults: { ease: "sine" } });

  TL.fromTo(".top", { y: "0%" }, { y: "-100%", duration: 1 }).to(
    ".start-game",
    { y: "100%", duration: 1 }
  );
}

window.onload = () => {
  landingAnimation();
  startGame();
};
