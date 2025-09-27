"use client";

import React, { useState, useEffect, useRef } from "react";

const HealthyHustleGame = () => {
  const [gameStats, setGameStats] = useState({
    score: 0,
    level: 1,
    fruits: 0,
    time: 0,
    distance: 0,
  });

  const [isGameActive, setIsGameActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [characterFitness, setCharacterFitness] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      name: "First Steps",
      description: "Collect your first fruit",
      icon: "🍎",
      unlocked: false,
      requirement: 1,
    },
    {
      id: 2,
      name: "Fruit Lover",
      description: "Collect 10 fruits",
      icon: "🍓",
      unlocked: false,
      requirement: 10,
    },
    {
      id: 3,
      name: "Speed Runner",
      description: "Reach level 3",
      icon: "⚡",
      unlocked: false,
      requirement: 3,
    },
    {
      id: 4,
      name: "Marathon",
      description: "Run for 60 seconds",
      icon: "🏃‍♂️",
      unlocked: false,
      requirement: 60,
    },
    {
      id: 5,
      name: "Fitness Guru",
      description: "Reach 100% fitness",
      icon: "💪",
      unlocked: false,
      requirement: 100,
    },
    {
      id: 6,
      name: "Fruit Master",
      description: "Collect 25 fruits",
      icon: "👑",
      unlocked: false,
      requirement: 25,
    },
  ]);

  const gameIntervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const startGame = () => {
    setIsGameActive(true);
    setIsPaused(false);
    setGameStats({ score: 0, level: 1, fruits: 0, time: 0, distance: 0 });
    setCharacterFitness(0);
    setGameSpeed(1);
    startTimeRef.current = Date.now();

    gameIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        setGameStats((prev) => {
          const newTime = prev.time + 1;
          const newDistance = prev.distance + gameSpeed;
          const newFruits = prev.fruits + Math.random() > 0.7 ? 1 : 0;
          const newScore = prev.score + Math.floor(Math.random() * 15) + 5;
          const newLevel = Math.floor(newTime / 20) + 1;

          return {
            ...prev,
            time: newTime,
            distance: newDistance,
            fruits: newFruits,
            score: newScore,
            level: newLevel,
          };
        });

        setCharacterFitness((prev) => Math.min(prev + 1.5, 100));
        setGameSpeed((prev) => Math.min(prev + 0.02, 3));
      }
    }, 1000);
  };

  const pauseGame = () => {
    setIsPaused(true);
  };

  const resumeGame = () => {
    setIsPaused(false);
  };

  const stopGame = () => {
    setIsGameActive(false);
    setIsPaused(false);
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }
  };

  const resetGame = () => {
    stopGame();
    setGameStats({ score: 0, level: 1, fruits: 0, time: 0, distance: 0 });
    setCharacterFitness(0);
    setGameSpeed(1);
  };

  // Check achievements
  useEffect(() => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        let currentValue = 0;
        switch (achievement.id) {
          case 1:
          case 2:
          case 6:
            currentValue = gameStats.fruits;
            break;
          case 3:
            currentValue = gameStats.level;
            break;
          case 4:
            currentValue = gameStats.time;
            break;
          case 5:
            currentValue = characterFitness;
            break;
        }
        return {
          ...achievement,
          unlocked: currentValue >= achievement.requirement,
        };
      })
    );
  }, [gameStats, characterFitness]);

  return (
    <div className="healthy-hustle-game">
      {/* Hero Section */}
      <section className="game-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="game-title">
              Healthy <span className="neon-text">Hustle</span>
            </h1>
            <p className="game-subtitle">
              Run, collect fruits, and transform your character from chubby to
              fit!
            </p>
          </div>
        </div>
      </section>

      {/* Game Interface */}
      <section className="game-interface-section">
        <div className="container">
          {/* Score Panel */}
          <div className="score-panel">
            <div className="stat-card neon-blue">
              <div className="stat-icon">
                <i className="fas fa-trophy"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{gameStats.score}</span>
                <span className="stat-label">Score</span>
              </div>
              <div className="card-glow"></div>
            </div>

            <div className="stat-card neon-orange">
              <div className="stat-icon">
                <i className="fas fa-apple-alt"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{gameStats.fruits}</span>
                <span className="stat-label">Fruits</span>
              </div>
              <div className="card-glow"></div>
            </div>

            <div className="stat-card neon-green">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{gameStats.time}s</span>
                <span className="stat-label">Time</span>
              </div>
              <div className="card-glow"></div>
            </div>

            <div className="stat-card neon-purple">
              <div className="stat-icon">
                <i className="fas fa-level-up-alt"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{gameStats.level}</span>
                <span className="stat-label">Level</span>
              </div>
              <div className="card-glow"></div>
            </div>

            <div className="stat-card neon-pink">
              <div className="stat-icon">
                <i className="fas fa-route"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">
                  {Math.floor(gameStats.distance)}m
                </span>
                <span className="stat-label">Distance</span>
              </div>
              <div className="card-glow"></div>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="game-main">
            <div className="game-track">
              <div
                className={`game-background ${isGameActive ? "scrolling" : ""}`}
              >
                <div className="track-lines"></div>
                <div className="speed-lines"></div>
              </div>

              {/* Character Display */}
              <div className="character-container">
                <div
                  className={`game-character fitness-${Math.floor(
                    characterFitness / 25
                  )} ${isGameActive && !isPaused ? "running" : ""}`}
                >
                  <div className="character-body">
                    <div className="character-arms">
                      <div className="arm left-arm"></div>
                      <div className="arm right-arm"></div>
                    </div>
                  </div>
                  <div className="character-head">
                    <div className="character-eyes"></div>
                    <div className="character-mouth"></div>
                  </div>
                  <div className="character-legs">
                    <div className="leg left-leg"></div>
                    <div className="leg right-leg"></div>
                  </div>
                </div>

                {/* Floating Fruits */}
                {isGameActive && (
                  <div className="floating-fruits">
                    <div className="fruit apple">🍎</div>
                    <div className="fruit banana">🍌</div>
                    <div className="fruit orange">🍊</div>
                    <div className="fruit grape">🍇</div>
                    <div className="fruit strawberry">🍓</div>
                    <div className="fruit watermelon">🍉</div>
                  </div>
                )}

                {/* Power-up Effects */}
                {isGameActive && gameStats.fruits > 0 && (
                  <div className="power-up-effects">
                    <div className="particle-explosion"></div>
                  </div>
                )}
              </div>

              {/* Fitness Progress */}
              <div className="fitness-display">
                <div className="fitness-label">Fitness Transformation</div>
                <div className="fitness-progress">
                  <div
                    className="fitness-fill"
                    style={{ width: `${characterFitness}%` }}
                  ></div>
                  <div className="fitness-glow"></div>
                </div>
                <div className="fitness-percentage">
                  {Math.floor(characterFitness)}%
                </div>
              </div>

              {/* Pause Overlay */}
              {isPaused && (
                <div className="pause-overlay">
                  <div className="pause-content">
                    <h3>Game Paused</h3>
                    <button
                      className="btn-resume neon-button"
                      onClick={resumeGame}
                    >
                      <i className="fas fa-play"></i>
                      Resume
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Game Controls */}
            <div className="game-controls">
              {!isGameActive ? (
                <button
                  className="btn-start-game neon-button pulse"
                  onClick={startGame}
                >
                  <i className="fas fa-play"></i>
                  <span>Start Game</span>
                  <div className="button-shine"></div>
                </button>
              ) : (
                <div className="control-buttons">
                  {!isPaused ? (
                    <button
                      className="btn-pause neon-button"
                      onClick={pauseGame}
                    >
                      <i className="fas fa-pause"></i>
                      Pause
                    </button>
                  ) : (
                    <button
                      className="btn-resume neon-button"
                      onClick={resumeGame}
                    >
                      <i className="fas fa-play"></i>
                      Resume
                    </button>
                  )}
                  <button className="btn-stop neon-button" onClick={stopGame}>
                    <i className="fas fa-stop"></i>
                    Stop
                  </button>
                </div>
              )}
              <button className="btn-reset neon-button" onClick={resetGame}>
                <i className="fas fa-redo"></i>
                Reset
              </button>
            </div>
          </div>

          {/* Side Panel - Fruits & Achievements */}
          <div className="side-panel">
            <div className="fruit-collection">
              <h3>Fruit Collection</h3>
              <div className="fruit-grid">
                <div className="fruit-item">
                  <span className="fruit-icon">🍎</span>
                  <span className="fruit-name">Apple</span>
                  <span className="fruit-points">+10</span>
                </div>
                <div className="fruit-item">
                  <span className="fruit-icon">🍌</span>
                  <span className="fruit-name">Banana</span>
                  <span className="fruit-points">+15</span>
                </div>
                <div className="fruit-item">
                  <span className="fruit-icon">🍊</span>
                  <span className="fruit-name">Orange</span>
                  <span className="fruit-points">+12</span>
                </div>
                <div className="fruit-item">
                  <span className="fruit-icon">🍇</span>
                  <span className="fruit-name">Grapes</span>
                  <span className="fruit-points">+20</span>
                </div>
                <div className="fruit-item">
                  <span className="fruit-icon">🍓</span>
                  <span className="fruit-name">Strawberry</span>
                  <span className="fruit-points">+25</span>
                </div>
                <div className="fruit-item">
                  <span className="fruit-icon">🍉</span>
                  <span className="fruit-name">Watermelon</span>
                  <span className="fruit-points">+30</span>
                </div>
              </div>
            </div>

            <div className="achievements">
              <h3>Achievements</h3>
              <div className="achievement-list">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`achievement-item ${
                      achievement.unlocked ? "unlocked" : ""
                    }`}
                  >
                    <span className="achievement-icon">{achievement.icon}</span>
                    <div className="achievement-info">
                      <span className="achievement-name">
                        {achievement.name}
                      </span>
                      <span className="achievement-desc">
                        {achievement.description}
                      </span>
                    </div>
                    {achievement.unlocked && (
                      <div className="unlock-glow"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Instructions */}
      <section className="game-instructions">
        <div className="container">
          <h2 className="section-title">
            How to <span className="gradient-text">Play</span>
          </h2>

          <div className="instructions-grid">
            <div className="instruction-card">
              <div className="instruction-icon neon-green">
                <i className="fas fa-running"></i>
              </div>
              <h3>Run & Collect</h3>
              <p>
                Your character automatically runs and collects fruits to improve
                fitness
              </p>
            </div>

            <div className="instruction-card">
              <div className="instruction-icon neon-orange">
                <i className="fas fa-apple-alt"></i>
              </div>
              <h3>Get Healthier</h3>
              <p>
                Each fruit makes your character fitter and increases your score
              </p>
            </div>

            <div className="instruction-card">
              <div className="instruction-icon neon-blue">
                <i className="fas fa-trophy"></i>
              </div>
              <h3>Level Up</h3>
              <p>
                Reach fitness milestones to unlock new levels and achievements
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HealthyHustleGame;
