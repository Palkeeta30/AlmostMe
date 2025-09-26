import React, { useState, useEffect, useRef, useCallback } from "react";
import "./BubbleBurstBliss.css";

const BubbleBurstBliss = () => {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef(null);

  const bubbleCount = 5 + level * 2; // Reduced bubble count for better gameplay
  const bubbleSpeed = 0.5 + level * 0.3; // Reduced base speed and level multiplier for slower movement

  const generateBubbles = useCallback(() => {
    const newBubbles = [];
    for (let i = 0; i < bubbleCount; i++) {
      const size = Math.random() * 50 + 30; // Increased minimum size for better clickability
      const isSpecial = Math.random() < 0.15; // Slightly increased special bubble chance
      newBubbles.push({
        id: Date.now() + i,
        x: Math.random() * (gameAreaRef.current?.clientWidth - size || 400),
        y: gameAreaRef.current?.clientHeight + size || 600,
        size,
        speed: bubbleSpeed + Math.random() * 2,
        isSpecial,
        popped: false,
      });
    }
    setBubbles((prev) => [...prev, ...newBubbles]);
  }, [bubbleCount, bubbleSpeed]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      generateBubbles();
      const interval = setInterval(generateBubbles, 3000); // Increased interval for better gameplay
      return () => clearInterval(interval);
    }
  }, [level, gameStarted, gameOver, generateBubbles]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const moveBubbles = () => {
        setBubbles((prev) =>
          prev
            .map((bubble) => ({
              ...bubble,
              y: bubble.y - bubble.speed,
            }))
            .filter((bubble) => bubble.y > -bubble.size)
        );
      };
      const interval = setInterval(moveBubbles, 50);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver]);

  const popBubble = (id) => {
    setBubbles((prev) =>
      prev.map((bubble) =>
        bubble.id === id ? { ...bubble, popped: true } : bubble
      )
    );
    setTimeout(() => {
      setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
    }, 300);
    setScore(
      (prev) => prev + (bubbles.find((b) => b.id === id)?.isSpecial ? 50 : 10)
    );
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setBubbles([]);
  };

  const nextLevel = () => {
    setLevel((prev) => prev + 1);
    setTimeLeft(60);
    setBubbles([]);
  };

  if (!gameStarted) {
    return (
      <div className="bubble-game-container">
        <div className="game-menu">
          <h1>Bubble Burst Bliss</h1>
          <p>
            Pop bubbles to relieve stress! Special rainbow bubbles give bonus
            points.
          </p>
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="bubble-game-container">
        <div className="game-over">
          <h1>Game Over!</h1>
          <p>Score: {score}</p>
          <p>Level: {level}</p>
          <button onClick={startGame} className="start-button">
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bubble-game-container">
      <div className="game-ui">
        <div className="score">Score: {score}</div>
        <div className="level">Level: {level}</div>
        <div className="timer">Time: {timeLeft}s</div>
      </div>
      <div
        ref={gameAreaRef}
        className="game-area"
        onClick={(e) => {
          e.stopPropagation();
          const rect = gameAreaRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const bubble = bubbles.find(
            (b) =>
              x >= b.x && x <= b.x + b.size && y >= b.y && y <= b.y + b.size
          );
          if (bubble) popBubble(bubble.id);
        }}
      >
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className={`bubble ${bubble.isSpecial ? "special" : ""} ${
              bubble.popped ? "popped" : ""
            }`}
            style={{
              left: bubble.x,
              top: bubble.y,
              width: bubble.size,
              height: bubble.size,
            }}
          />
        ))}
      </div>
      {timeLeft === 0 && !gameOver && (
        <div className="level-complete">
          <h2>Level {level} Complete!</h2>
          <button onClick={nextLevel} className="next-level-button">
            Next Level
          </button>
        </div>
      )}
    </div>
  );
};

export default BubbleBurstBliss;
