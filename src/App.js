import { useState } from 'react';

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [currentSquare, setCurrentSquare] = useState([]);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  // 3 - Add a toggle button that lets you sort the moves in either ascending or descending order
  const [listDirection, setListDirection] = useState(false);
  // 5 - Display the location for each move in the format (col, row) in the move history list.
  function changeCurrentSquare(i) {
    let col;
    let row;
    i < 3 ? row = 1 : i < 6 ? row = 2 : row = 3;
    if (i === 0 || i % 3 === 0) col = 1;
    else if (i === 1 || i === 4 || i === 7) col = 2;
    else col = 3;
    setCurrentSquare([...currentSquare.slice(0, currentMove), `(${col}, ${row})`]);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  // 3
  function reverseList() {
    setListDirection(!listDirection);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} history={history} changeCurrentSquare={changeCurrentSquare} />
      </div>
      <div className="game-info">
        <button onClick={reverseList}>
          Reverse order
        </button>
        <MoveList history={history} onClick={jumpTo} direction={listDirection} currentSquare={currentSquare} />
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay, history, changeCurrentSquare }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    xIsNext ? nextSquares[i] = 'X' : nextSquares[i] = 'O';
    // 5
    changeCurrentSquare(i);
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  winner ? status = `Winner: ${winner[0]}` : status = `Next player: ${xIsNext ? "X" : "O"}`;
  // 4 - When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw)
  if (!winner && history.length === 10) status = 'Draw';

  // 2 - Rewrite Board to use two loops to make the squares instead of hardcoding them
  let boardy = [];
  
  for (let i = 0; i <= 6; i += 3) {
    let squary = [];
    
    for (let j = 1; j <= 3; j++) {
      // 4
      if (winner && winner[1].includes(i + j - 1)) {
        squary.push(<Square key={(j + i) - 1} value={squares[(j + i) - 1]} onSquareClick={() => handleClick((j + i) - 1)} winna={true} />);
      } else squary.push(<Square key={(j + i) - 1} value={squares[(j + i) - 1]} onSquareClick={() => handleClick((j + i) - 1)} />);
    } 

    boardy.push(<div key={i} className="board-row">{squary}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardy}
    </>
  );
}

function Square({ value, onSquareClick, winna }) {
  // 4
  if (winna) {
    return (
    <button className="square winna" onClick={onSquareClick}>
      {value}
    </button>
    );
  } else return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// 3
function MoveList({ history, onClick, direction, currentSquare }) {
  let moves = history.map((squares, move) => {
    let description;
    // 5
    move > 0 ? description = `Go to move #${move} ${currentSquare[move - 1]}` : description = 'Go to game start';
    // 1 - For the current move only, show “You are at move #…” instead of a button
    if (history.length === move + 1) {
      return (
      <li key={move}>
        You are on move #{move + 1} {currentSquare[move - 1]}
      </li>
      );
    }
    return (
      <li key={move}>
        <button onClick={() => onClick(move)}>{description}</button>
      </li>
    );
  });
  
  if (direction) moves.reverse();

  return (
    <>
      <ol>{moves}</ol>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i=0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return [squares[a], lines[i]];
  }

  return null;
}