// Player Factory Function instead of using the constructor
const createPlayer = (name, symbol) => {
  return { name, symbol };
};

// gameBoard Module (IIFE)
const gameBoard = (() => {
  // Array to store the game state
  const board = ["", "", "", "", "", "", "", "", ""];

  // Method to get the current board state
  const getBoard = () => board;

  // Update the cell (9 cells)
  const updateCell = (index, symbol) => {
    // if the index is empty then update to that index
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

  // Expose the methods we need
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
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6], // Diagonal from top-right to bottom-left
  ];

  // Start the game
  const startGame = (player1, player2) => {
    players = [player1, player2];
    currentPlayer = players[0];
    gameOver = false; // Game just started, so it's not over

    // Logging to verify in the console
    console.log("Game has started!");
    console.log(`Player 1: ${players[0].name}, Symbol: ${players[0].symbol}`);
    console.log(`Player 2: ${players[1].name}, Symbol: ${players[1].symbol}`);
    console.log(`Current Player: ${currentPlayer.name}`);
  };

  // Play a turn
  const playTurn = (index) => {
    if (gameOver) {
      console.log("Game is over. Please restart to play again.");
      return;
    }

    // Attempt to update the board
    const moveSuccessful = gameBoard.updateCell(index, currentPlayer.symbol);
    if (!moveSuccessful) {
      console.log("Cell is already taken. Choose another cell.");
      return;
    }

    // Log the move
    console.log(`Player ${currentPlayer.name} placed ${currentPlayer.symbol} at index ${index}`);

    // Check for a winner
    checkWinner();

    // Check for a draw if no winner
    if (!gameOver) {
      checkDraw();
    }

    // Switch player if game is not over
    if (!gameOver) {
      switchPlayer();
    }
  };

  // Check if the current player has won
  const checkWinner = () => {
    const board = gameBoard.getBoard();
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


