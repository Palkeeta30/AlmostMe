import React, { useState, useEffect, useCallback } from "react";
import "./ZenGardenPuzzle.css";

const ZenGardenPuzzle = () => {
  const [puzzle, setPuzzle] = useState([]);
  const [emptyTile, setEmptyTile] = useState(null);
  const [level, setLevel] = useState(1);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const gridSizes = [
    { size: 3, tiles: 8 }, // Level 1: 3x3 with 8 tiles
    { size: 4, tiles: 15 }, // Level 2: 4x4 with 15 tiles
    { size: 5, tiles: 24 }, // Level 3: 5x5 with 24 tiles
  ];

  const currentGrid = gridSizes[Math.min(level - 1, gridSizes.length - 1)];
  const gridSize = currentGrid.size;

  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const initializePuzzle = useCallback(() => {
    const tiles = Array.from(
      { length: gridSize * gridSize - 1 },
      (_, i) => i + 1
    );
    tiles.push(null); // Empty tile
    const shuffled = shuffleArray(tiles);
    setPuzzle(shuffled);
    setEmptyTile(shuffled.indexOf(null));
    setMoves(0);
    setGameWon(false);
  }, [gridSize, shuffleArray]);

  useEffect(() => {
    if (gameStarted) {
      initializePuzzle();
    }
  }, [level, gameStarted, initializePuzzle]);

  const moveTile = (index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyTile / gridSize);
    const emptyCol = emptyTile % gridSize;

    if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1) {
      const newPuzzle = [...puzzle];
      [newPuzzle[index], newPuzzle[emptyTile]] = [
        newPuzzle[emptyTile],
        newPuzzle[index],
      ];
      setPuzzle(newPuzzle);
      setEmptyTile(index);
      setMoves((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (gameStarted && puzzle.length > 0) {
      const isSolved =
        puzzle.slice(0, -1).every((tile, index) => tile === index + 1) &&
        puzzle[puzzle.length - 1] === null;
      if (isSolved) {
        setGameWon(true);
      }
    }
  }, [puzzle, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
  };

  const nextLevel = () => {
    setLevel((prev) => prev + 1);
    setGameWon(false);
  };

  if (!gameStarted) {
    return (
      <div className="zen-garden-container">
        <div className="game-menu">
          <h1>Zen Garden Puzzle</h1>
          <p>Slide tiles to restore the peaceful garden path.</p>
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameWon) {
    return (
      <div className="zen-garden-container">
        <div className="level-complete">
          <h1>Level {level} Complete!</h1>
          <p>Moves: {moves}</p>
          <button onClick={nextLevel} className="next-level-button">
            Next Level
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="zen-garden-container">
      <div className="game-ui">
        <div className="level">Level: {level}</div>
        <div className="moves">Moves: {moves}</div>
      </div>
      <div
        className="puzzle-grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 80px)`,
          gridTemplateRows: `repeat(${gridSize}, 80px)`,
          justifyContent: "center",
          margin: "0 auto",
          width: `${gridSize * 80}px`,
          height: `${gridSize * 80}px`,
          display: "grid",
          gridGap: "2px",
        }}
      >
        {puzzle.map((tile, index) => (
          <div
            key={index}
            className={`puzzle-tile ${tile === null ? "empty" : ""}`}
            onClick={() => moveTile(index)}
            style={{
              backgroundColor: tile !== null ? "#1e3a5f" : "#b0b0b0",
              backgroundImage:
                tile !== null
                  ? "none"
                  : "none",
              width: "80px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              cursor: "pointer",
              userSelect: "none",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              color: "white",
              boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
              borderRadius: 4,
            }}
          >
            {tile}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZenGardenPuzzle;
