import React, { useState, useEffect, useCallback } from "react";
import "./MindMazeMatch.css";

const MindMazeMatch = () => {
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [goalPos, setGoalPos] = useState({ x: 0, y: 0 });
  const [path, setPath] = useState([]);
  const [showPath, setShowPath] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [memorizeTime, setMemorizeTime] = useState(5);

  const mazeSizes = [
    { width: 5, height: 5 }, // Level 1
    { width: 7, height: 7 }, // Level 2
    { width: 9, height: 7 }, // Level 3
    { width: 9, height: 9 }, // Level 4
    { width: 11, height: 9 }, // Level 5
  ];

  const currentMazeSize = mazeSizes[Math.min(level - 1, mazeSizes.length - 1)];

  const generateMaze = useCallback(() => {
    const { width, height } = currentMazeSize;
    const newMaze = Array(height)
      .fill()
      .map(() => Array(width).fill(0));

    // Create walls randomly
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          newMaze[y][x] = 1; // Wall
        } else if (Math.random() < 0.3) {
          newMaze[y][x] = 1; // Random wall
        }
      }
    }

    // Ensure start and goal are accessible
    newMaze[1][1] = 0; // Start position
    newMaze[height - 2][width - 2] = 0; // Goal position

    // Create a simple path from start to goal
    let currentX = 1;
    let currentY = 1;
    const visited = new Set();
    const path = [{ x: currentX, y: currentY }];

    while (currentX !== width - 2 || currentY !== height - 2) {
      visited.add(`${currentX},${currentY}`);

      const directions = [
        { dx: 0, dy: 1 }, // down
        { dx: 1, dy: 0 }, // right
        { dx: 0, dy: -1 }, // up
        { dx: -1, dy: 0 }, // left
      ];

      let moved = false;
      for (const dir of directions.sort(() => Math.random() - 0.5)) {
        const newX = currentX + dir.dx;
        const newY = currentY + dir.dy;

        if (
          newX >= 0 &&
          newX < width &&
          newY >= 0 &&
          newY < height &&
          !visited.has(`${newX},${newY}`)
        ) {
          currentX = newX;
          currentY = newY;
          path.push({ x: currentX, y: currentY });
          newMaze[currentY][currentX] = 0; // Clear path
          moved = true;
          break;
        }
      }

      if (!moved) break;
    }

    setMaze(newMaze);
    setPlayerPos({ x: 1, y: 1 });
    setGoalPos({ x: width - 2, y: height - 2 });
    setPath(path);
    setShowPath(true);
    setTimeLeft(30 + level * 10);
    setMemorizeTime(5 + level);
  }, [currentMazeSize, level]);

  useEffect(() => {
    if (gameStarted && !showPath) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameStarted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, showPath]);

  useEffect(() => {
    if (showPath && memorizeTime > 0) {
      const timer = setTimeout(() => {
        setMemorizeTime((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showPath && memorizeTime === 0) {
      setShowPath(false);
    }
  }, [showPath, memorizeTime]);

  useEffect(() => {
    if (playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
      setGameWon(true);
    }
  }, [playerPos, goalPos]);

  const movePlayer = useCallback(
    (direction) => {
      if (showPath || gameWon) return;

      const { x, y } = playerPos;
      let newX = x;
      let newY = y;

      switch (direction) {
        case "up":
          newY = y - 1;
          break;
        case "down":
          newY = y + 1;
          break;
        case "left":
          newX = x - 1;
          break;
        case "right":
          newX = x + 1;
          break;
        default:
          return;
      }

      if (
        newX >= 0 &&
        newX < currentMazeSize.width &&
        newY >= 0 &&
        newY < currentMazeSize.height &&
        maze[newY][newX] !== 1
      ) {
        setPlayerPos({ x: newX, y: newY });
      }
    },
    [showPath, gameWon, playerPos, currentMazeSize, maze]
  );

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          movePlayer("up");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          movePlayer("down");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          movePlayer("left");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          movePlayer("right");
          break;
        default:
          break;
      }
    };

    if (gameStarted && !showPath) {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [gameStarted, showPath, movePlayer]);

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    setGameWon(false);
    generateMaze();
  };

  const nextLevel = () => {
    setLevel((prev) => prev + 1);
    setGameWon(false);
    generateMaze();
  };

  const restartLevel = () => {
    setPlayerPos({ x: 1, y: 1 });
    setShowPath(true);
    setMemorizeTime(5 + level);
    setTimeLeft(30 + level * 10);
  };

  if (!gameStarted) {
    return (
      <div className="mind-maze-container">
        <div className="game-menu">
          <h1>Mind Maze Match</h1>
          <p>
            Navigate through the maze using memory! Memorize the path, then find
            your way to the goal!
          </p>
          <div className="instructions">
            <h3>How to Play:</h3>
            <ul>
              <li>Memorize the highlighted path</li>
              <li>Use arrow keys or WASD to move</li>
              <li>Reach the goal before time runs out</li>
              <li>Avoid the walls!</li>
            </ul>
          </div>
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameWon) {
    return (
      <div className="mind-maze-container">
        <div className="level-complete">
          <h1>Level {level} Complete!</h1>
          <p>Time remaining: {timeLeft}s</p>
          <button onClick={nextLevel} className="next-level-button">
            Next Level
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mind-maze-container">
      <div className="game-ui">
        <div className="level">Level: {level}</div>
        <div className="time">Time: {timeLeft}s</div>
        <div className="memorize">
          {showPath ? `Memorize: ${memorizeTime}s` : "Navigate!"}
        </div>
        <button onClick={restartLevel} className="restart-button">
          Restart Level
        </button>
      </div>
      <div
        className="maze-grid"
        style={{
          gridTemplateColumns: `repeat(${currentMazeSize.width}, 1fr)`,
          gridTemplateRows: `repeat(${currentMazeSize.height}, 1fr)`,
        }}
      >
        {maze.map((row, y) =>
          row.map((cell, x) => {
            const isPlayer = playerPos.x === x && playerPos.y === y;
            const isGoal = goalPos.x === x && goalPos.y === y;
            const isPath = showPath && path.some((p) => p.x === x && p.y === y);
            const isWall = cell === 1;

            return (
              <div
                key={`${x}-${y}`}
                className={`maze-cell ${isWall ? "wall" : "path"} ${
                  isPlayer ? "player" : ""
                } ${isGoal ? "goal" : ""} ${isPath ? "highlighted-path" : ""}`}
              >
                {isPlayer && "🧠"}
                {isGoal && "🏁"}
                {isWall && "🧱"}
              </div>
            );
          })
        )}
      </div>
      <div className="controls">
        <div className="control-buttons">
          <button onClick={() => movePlayer("up")} className="control-btn">
            ↑
          </button>
        </div>
        <div className="control-buttons">
          <button onClick={() => movePlayer("left")} className="control-btn">
            ←
          </button>
          <button onClick={() => movePlayer("down")} className="control-btn">
            ↓
          </button>
          <button onClick={() => movePlayer("right")} className="control-btn">
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MindMazeMatch;
