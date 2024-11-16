// Player Factory Function instead of using the constructor
const createPlayer = (name, symbol) => {
  return { name, symbol };
};

// gameBoard Module (IIFE)
const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  // Method to get the current board state
  const getBoard = () => board;

  // Method to update the board's cell
  const updateCell = (index, symbol) => {
    if (board[index] === "") {
      board[index] = symbol;
      return true;
    }
    return false;
  };

  // Reset the board
  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return {
    getBoard,
    updateCell,
    resetBoard,
  };
})();

// Game Controller Module (IIFE)
const gameController = (() => {
  // Key Variables
  let currentPlayer = null;
  let gameOver = false;
  let players = [];

  // Winning combinations (rows, columns, diagonals)
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Start the game with the order of the player
  const startGame = (player1, player2) => {
    players = [player1, player2];
    currentPlayer = players[0];
    gameOver = false;
  };

  // Play a turn
  const playTurn = (index) => {
    if (gameOver) {
      console.log("Game is over. Please restart to play again.");
      return;
    }

    // Update the board with the play of the current player
    const moveSuccessful = gameBoard.updateCell(index, currentPlayer.symbol);
    if (!moveSuccessful) {
      console.log("Cell is already taken. Choose another cell.");
      return;
    }
    // Check that the current winner is win or not
    checkWinner();

    if (!gameOver) {
      checkDraw();
    }

    if (!gameOver) {
      switchPlayer();
    }
  };

  // Check if the current player has won
  const checkWinner = () => {
    const board = gameBoard.getBoard();
    // Loop all possible combination
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        console.log(`Player ${currentPlayer.name} wins!`);
        gameOver = true;
        return;
      }
    }
  };

  // Check if the game is a draw
  const checkDraw = () => {
    const board = gameBoard.getBoard();
    if (board.every((cell) => cell !== "")) {
      console.log("The game is a draw!");
      gameOver = true;
    }
  };

  // Switch to the next player
  const switchPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    console.log(`Now it's ${currentPlayer.name}'s turn.`);
  };

  const resetGame = () => {
    gameOver = false;
    currentPlayer = players[0];
    gameBoard.resetBoard();
    console.log("The game is restarted");
  };
  // Expose public methods
  return {
    startGame,
    playTurn,
    resetGame,
  };
})();
