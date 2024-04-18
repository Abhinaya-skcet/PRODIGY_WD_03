import React, { useState, useEffect } from 'react';
import Board from './Board';

const Game = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!xIsNext && !gameOver) {
      // AI's turn
      const timeout = setTimeout(() => {
        makeAIMove();
      }, 500); // Delay for a more natural feel
      return () => clearTimeout(timeout);
    }
  }, [squares, xIsNext, gameOver]);

  const handleClick = (index) => {
    if (gameOver || squares[index]) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[index] = 'X';
    setSquares(newSquares);
    setXIsNext(false);
    checkWinner(newSquares);
  };

  const makeAIMove = () => {
    const availableMoves = squares.reduce((acc, curr, index) => {
      if (!curr) {
        acc.push(index);
      }
      return acc;
    }, []);
    if (availableMoves.length === 0) {
        // No available moves left, game over
        setGameOver(true);
        return;
      }
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const aiMove = availableMoves[randomIndex];
    const newSquares = squares.slice();
    newSquares[aiMove] = 'O';
    setSquares(newSquares);
    setXIsNext(true);
    checkWinner(newSquares);
  };

  const checkWinner = (squares) => {
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
      [0, 4, 8], [2, 4, 6]              // Diagonal
    ];
  
    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinner(squares[a]);
        setGameOver(true);
        return;

      }
    }
  
    if (squares.every((square) => square !== null)) {
        setGameOver(true);
    }
  };
  

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="container">
    <div className="game">
      <div className="game-info">
        {gameOver && winner && <div className="status">Winner: {winner}</div>}
        {gameOver && !winner && <div className="status">It's a draw!</div>}
        {!gameOver && <div className="status">{xIsNext ? 'Player\'s turn' : 'AI\'s turn'}</div>}
      </div>
      <Board squares={squares} onClick={handleClick} />
      {gameOver && <button className="reset" onClick={resetGame}>New Game</button>}
    </div>
    </div>
  );
};

export default Game;
