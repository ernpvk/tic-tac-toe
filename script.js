// Put it all in the content loaded
document.addEventListener("DOMContentLoaded", () => {
  // Define the elements after DOM has been loaded
  const nameModal = document.querySelector("#name-modal");
  const startGameButton = document.querySelector("#start-game-button");
  const player1Input = document.querySelector("#player1-name");
  const player2Input = document.querySelector("#player2-name");
  const cells = document.querySelectorAll(".cell");
  const resetButton = document.querySelector("#reset-button");
  const gameStatus = document.querySelector("#game-status");
  const confettiContainer = document.getElementById("confetti-container");

  // Player Factory Function instead of using the constructor
  const createPlayer = (name, symbol) => {
    return { name, symbol };
  };

  // gameBoard Module
  const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    const getBoard = () => board;
    const updateCell = (index, symbol) => {
      if (board[index] === "") {
        board[index] = symbol;
        return true;
      }
      return false;
    };
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

  // Game controller module
  const gameController = (() => {
    let currentPlayer = null;
    let gameOver = false;
    let players = [];

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

    const startGame = (player1, player2) => {
      players = [player1, player2];
      currentPlayer = players[0];
      gameOver = false;
      gameStatus.textContent = `Game started! ${currentPlayer.name}'s turn`;
    };

    const playTurn = (index) => {
      if (gameOver) {
        gameStatus.textContent = "Game is over. Please restart to play again.";
        return;
      }

      const moveSuccessful = gameBoard.updateCell(index, currentPlayer.symbol);
      if (!moveSuccessful) {
        gameStatus.textContent = "Cell is already taken! Choose another cell.";
        return;
      }

      checkWinner();
      if (!gameOver) {
        checkDraw();
      }
      if (!gameOver) {
        switchPlayer();
      }
    };

    const checkWinner = () => {
      const board = gameBoard.getBoard();
      for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          gameOver = true;
          gameStatus.textContent = `The winner is ${currentPlayer.name}!`;

          // Show the confetti animation
          confettiContainer.style.display = "block";

          return;
        }
      }
    };

    const checkDraw = () => {
      const board = gameBoard.getBoard();
      if (board.every((cell) => cell !== "")) {
        gameOver = true;
        gameStatus.textContent = "The game is a draw!";
      }
    };

    const switchPlayer = () => {
      currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
      gameStatus.textContent = `Now it's ${currentPlayer.name}'s turn.`;
    };

    const resetGame = () => {
      gameOver = false;
      currentPlayer = players[0];
      gameBoard.resetBoard();
      gameStatus.textContent = "The game has been restarted. Enter player names to start again.";
    };

    return {
      startGame,
      playTurn,
      resetGame,
    };
  })();

  // Show modal on load
  nameModal.style.display = "block";

  startGameButton.addEventListener("click", () => {
    const player1Name = player1Input.value.trim() || "Player 1";
    const player2Name = player2Input.value.trim() || "Player 2";

    const player1 = createPlayer(player1Name, "X");
    const player2 = createPlayer(player2Name, "O");

    gameController.startGame(player1, player2);
    nameModal.style.display = "none";

    cells.forEach((cell, index) => {
      cell.textContent = ""; // Clear the text content
      cell.onclick = () => {
        gameController.playTurn(index);
        const board = gameBoard.getBoard();
        cell.textContent = board[index];
      };
    });
  });

  resetButton.addEventListener("click", () => {
    gameController.resetGame();
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.onclick = null; // Remove existing event listeners to avoid conflict
    });
    player1Input.value = "";
    player2Input.value = "";
    gameStatus.textContent = "";
    confettiContainer.style.display = "none";
    nameModal.style.display = "block";
  });
});
