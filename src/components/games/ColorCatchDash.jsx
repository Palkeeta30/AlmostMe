import React, { useState, useEffect, useRef, useMemo } from "react";
import "./ColorCatchDash.css";

const ColorCatchDash = () => {
  const [catcher, setCatcher] = useState({ x: 50 });
  const [fallingObjects, setFallingObjects] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const gameAreaRef = useRef(null);
  const animationRef = useRef(null);
  const fallingObjectsRef = useRef([]);

  const colors = useMemo(
    () => ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#f093fb"],
    []
  );
  const levelSettings = [
    { speed: 2, spawnRate: 2000, targetColor: colors[0] },
    { speed: 3, spawnRate: 1500, targetColor: colors[1] },
    { speed: 4, spawnRate: 1200, targetColor: colors[2] },
    { speed: 5, spawnRate: 1000, targetColor: colors[3] },
    { speed: 6, spawnRate: 800, targetColor: colors[4] },
  ];

  const currentLevel =
    levelSettings[Math.min(level - 1, levelSettings.length - 1)];

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimer(0);
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const spawnInterval = setInterval(() => {
        const shapes = ["⬤", "▲", "■", "◆", "⬟", "⬛", "⬜", "⭐", "💎", "🔥"];
        const emojis = [
          "🍎",
          "🍇",
          "🍉",
          "🍒",
          "🍋",
          "🍑",
          "🍓",
          "🥝",
          "🍊",
          "🍍",
          "🥭",
          "🍌",
          "🍐",
          "🍊",
          "🍑",
        ];
        const objects = [
          "⚽",
          "🏀",
          "🎾",
          "🎱",
          "🏈",
          "⚾",
          "🎯",
          "🎲",
          "💎",
          "🔑",
          "⭐",
          "🌟",
          "💫",
          "✨",
        ];

        const objectTypes = [shapes, emojis, objects];
        const selectedType =
          objectTypes[Math.floor(Math.random() * objectTypes.length)];
        const symbol =
          selectedType[Math.floor(Math.random() * selectedType.length)];

        const newObject = {
          id: Date.now() + Math.random(),
          x: Math.random() * 85 + 5, // Keep objects within visible area
          y: 0, // Start at the very top (0%)
          symbol: symbol,
          color: currentLevel.targetColor,
          speed: currentLevel.speed + Math.random() * 0.5, // Add slight speed variation
          size: Math.random() * 0.5 + 0.8, // Random size variation
        };
        setFallingObjects((prev) => {
          const updated = [...prev, newObject];
          fallingObjectsRef.current = updated;
          return updated;
        });
      }, currentLevel.spawnRate);

      console.log("Starting animation loop...");
      const animate = () => {
        fallingObjectsRef.current = fallingObjectsRef.current
          .map((obj) => {
            const newY = obj.y + obj.speed;
            console.log(
              `Object ${obj.id}: y=${obj.y} -> y=${newY}, speed=${obj.speed}`
            );
            if (newY > 90) {
              console.log(`Object ${obj.id} fell off screen`);
              setLives((prev) => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                  setGameOver(true);
                }
                return newLives;
              });
              return null; // Mark for removal
            }
            return { ...obj, y: newY };
          })
          .filter(Boolean);

        setFallingObjects(fallingObjectsRef.current);
        animationRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        clearInterval(spawnInterval);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        fallingObjectsRef.current = [];
      };
    }
  }, [gameStarted, gameOver, currentLevel]);

  useEffect(() => {
    fallingObjectsRef.current = fallingObjectsRef.current.filter((obj) => {
      if (obj.y > 80 && obj.y < 90 && Math.abs(obj.x - catcher.x) < 10) {
        setScore((prev) => prev + 10);
        return false;
      }
      return true;
    });
    setFallingObjects(fallingObjectsRef.current);
  }, [fallingObjects, catcher]);

  useEffect(() => {
    if (score > 0 && score % 100 === 0) {
      setLevel((prev) => prev + 1);
    }
  }, [score]);

  const handleMouseMove = (e) => {
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setCatcher({ x: Math.max(0, Math.min(90, x)) });
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setLevel(1);
    setFallingObjects([]);
    fallingObjectsRef.current = [];
  };

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setLives(3);
    setLevel(1);
    setFallingObjects([]);
    fallingObjectsRef.current = [];
  };

  if (!gameStarted) {
    return (
      <div className="color-catch-container">
        <div className="game-menu">
          <h1>Color Catch Dash</h1>
          <p>Catch the falling objects of the target color!</p>
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="color-catch-container">
        <div className="level-complete">
          <h1>Game Over!</h1>
          <p>Final Score: {score}</p>
          <button onClick={restartGame} className="next-level-button">
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="color-catch-container">
      <div className="game-ui">
        <div className="level">Level: {level}</div>
        <div className="score">Score: {score}</div>
        <div className="lives">Lives: {lives}</div>
        <div className="timer">
          Time: {gameStarted && !gameOver ? timer : 0}s
        </div>
        <div className="debug">Objects: {fallingObjects.length}</div>
      </div>
      <div
        className="game-area"
        ref={gameAreaRef}
        onMouseMove={handleMouseMove}
      >
        {fallingObjects.map((obj) => (
          <div
            key={obj.id}
            className="falling-object"
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              color: obj.color,
              fontSize: `${3 * (obj.size || 1)}rem`,
              position: "absolute",
              userSelect: "none",
              zIndex: 10,
              textShadow:
                "0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)",
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${obj.color}40 0%, transparent 70%)`,
              borderRadius: "50%",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "40px",
              minHeight: "40px",
            }}
          >
            {obj.symbol}
          </div>
        ))}
        <div className="catcher" style={{ left: `${catcher.x}%` }} />
      </div>
    </div>
  );
};

export default ColorCatchDash;
