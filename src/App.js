import { useState } from "react";

function Square({ value, onSquareClick, isHighlight }) {
  return (
    <button
      className={`square ${isHighlight ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i, row, col) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares, i, row, col);
  }

  const winnerInfo = calculateWinner(squares);
  let status;
  let winningLine = null;

  if (winnerInfo) {
    status = "Winner:" + winnerInfo.winner;
    winningLine = winnerInfo.winningLine;
  } else if (!squares.includes(null)) {
    status = "It's a draw!";
  } else {
    status = "Next player:" + (xIsNext ? "X" : "O");
  }
  const boardSize = 3;
  const boardRows = [];

  for (let row = 0; row < boardSize; row++) {
    const squaresInRow = [];
    for (let col = 0; col < boardSize; col++) {
      const index = row * boardSize + col;
      squaresInRow.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index, row, col)}
          isHighlight={winningLine && winningLine.includes(index)}
        />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }
  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), location: null },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, index, row, col) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      {
        squares: nextSquares,
        location: { row: row + 1, col: col + 1 },
      },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {move === currentMove ? <strong>{description}</strong> : description}
        </button>
      </li>
    );
  });
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const line = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < line.length; i++) {
    const [a, b, c] = line[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningLine: line[i],
      };
    }
  }
  return null;
}
