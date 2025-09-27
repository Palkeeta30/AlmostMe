import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ReactionRushFixed.css";

// Game configuration
const GAME_CONFIG = {
  levels: [
    {
      level: 1,
      rounds: 5,
      delayRange: [2000, 5000], // 2-5 seconds
      threshold: 350, // ms
      name: "Beginner",
      color: "green",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      bgColor: "#10b981",
    },
    {
      level: 2,
      rounds: 5,
      delayRange: [1000, 3000], // 1-3 seconds
      threshold: 300, // ms
      name: "Intermediate",
      color: "blue",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      bgColor: "#3b82f6",
    },
    {
      level: 3,
      rounds: 5,
      delayRange: [500, 2000], // 0.5-2 seconds
      threshold: 250, // ms
      name: "Expert",
      color: "purple",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      bgColor: "#8b5cf6",
    },
    {
      level: 4,
      rounds: 5,
      delayRange: [300, 1500], // 0.3-1.5 seconds
      threshold: 200, // ms
      name: "Master",
      color: "red",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      bgColor: "#ef4444",
    },
    {
      level: 5,
      rounds: 5,
      delayRange: [200, 1000], // 0.2-1 seconds
      threshold: 150, // ms
      name: "Legend",
      color: "orange",
      gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      bgColor: "#f97316",
    },
    {
      level: 6,
      rounds: 5,
      delayRange: [100, 800], // 0.1-0.8 seconds
      threshold: 100, // ms
      name: "Godlike",
      color: "pink",
      gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
      bgColor: "#ec4899",
    },
  ],
};

// Animation variants
const gameVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3 },
  },
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const ConfettiAnimation = ({ isActive }) => {
  if (!isActive) return null;

  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    color: [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#ffeaa7",
      "#f093fb",
      "#f5576c",
      "#4facfe",
      "#00f2fe",
      "#43e97b",
    ][Math.floor(Math.random() * 10)],
    size: Math.random() * 8 + 4,
    duration: Math.random() * 3 + 2,
    shape: Math.random() > 0.5 ? "circle" : "square",
    rotationSpeed: Math.random() * 720 + 180,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${
            particle.shape === "circle" ? "rounded-full" : "rotate-45"
          }`}
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size}px ${particle.color}40`,
          }}
          initial={{ y: -10, opacity: 1, rotate: 0 }}
          animate={{
            y: "100vh",
            opacity: 0,
            rotate: particle.rotationSpeed,
            scale: [1, 1.2, 0.8, 1.1, 0],
          }}
          transition={{
            duration: particle.duration,
            ease: "easeOut",
            delay: Math.random() * 1,
            times: [0, 0.2, 0.4, 0.6, 1],
          }}
        />
      ))}
    </div>
  );
};

const LevelCompleteModal = ({
  isOpen,
  level,
  stats,
  onNextLevel,
  onRetry,
  canProceed,
}) => {
  if (!isOpen) return null;

  const getPerformanceRating = (average, threshold) => {
    if (average <= threshold * 0.8)
      return { rating: "Lightning Fast!", icon: "⚡", color: "#fbbf24" };
    if (average <= threshold)
      return { rating: "Excellent!", icon: "🌟", color: "#10b981" };
    if (average <= threshold * 1.2)
      return { rating: "Good Job!", icon: "👍", color: "#3b82f6" };
    return { rating: "Keep Practicing!", icon: "💪", color: "#f59e0b" };
  };

  const performance = getPerformanceRating(
    stats.average,
    GAME_CONFIG.levels[level - 1]?.threshold
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-purple-200"
          initial={{ scale: 0.7, opacity: 0, rotateY: -15 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.7, opacity: 0, rotateY: 15 }}
          transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.95) 50%, rgba(243,244,246,0.95) 100%)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2)",
          }}
        >
          {/* Celebration Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🎉
            </motion.div>
            <motion.h2
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              Level {level} Complete!
            </motion.h2>
            <motion.div
              className="text-xl font-semibold"
              style={{ color: performance.color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {performance.icon} {performance.rating}
            </motion.div>
          </motion.div>

          {/* Animated Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Fastest",
                value: stats.fastest,
                icon: "🚀",
                color: "from-green-400 to-emerald-500",
              },
              {
                label: "Average",
                value: stats.average,
                icon: "⚡",
                color: "from-blue-400 to-blue-500",
              },
              {
                label: "Slowest",
                value: stats.slowest,
                icon: "🐌",
                color: "from-orange-400 to-red-500",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-lg`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.3 + index * 0.1,
                  type: "spring",
                  bounce: 0.5,
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                }}
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold mb-1">{stat.value}ms</div>
                <div className="text-xs opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Performance Indicator */}
          <motion.div
            className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 mb-8 border border-purple-200"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-700">Performance</span>
              <span className="text-sm text-gray-500">
                Target: {GAME_CONFIG.levels[level - 1]?.threshold}ms
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      (stats.average /
                        (GAME_CONFIG.levels[level - 1]?.threshold * 1.5)) *
                        100,
                      100
                    )}%`,
                  }}
                  transition={{ delay: 0.9, duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <motion.div
                className="absolute top-0 left-0 h-3 w-1 bg-white rounded-full"
                initial={{ x: 0 }}
                animate={{
                  x: `${Math.min(
                    (stats.average /
                      (GAME_CONFIG.levels[level - 1]?.threshold * 1.5)) *
                      100,
                    100
                  )}%`,
                }}
                transition={{ delay: 0.9, duration: 1.5, ease: "easeOut" }}
                style={{
                  boxShadow: "0 0 10px rgba(255,255,255,0.8)",
                  marginLeft: "-2px",
                }}
              />
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Your Average</span>
              <motion.span
                className="font-bold text-lg"
                style={{ color: performance.color }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.1, type: "spring" }}
              >
                {stats.average}ms
              </motion.span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={onRetry}
              className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 border border-gray-300"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              🔄 Retry Level
            </motion.button>

            {canProceed && level < GAME_CONFIG.levels.length && (
              <motion.button
                onClick={onNextLevel}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(147, 51, 234, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                🚀 Next Level
              </motion.button>
            )}
          </div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          <motion.div
            className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"
            animate={{
              rotate: -360,
              scale: [1, 1.3, 1],
            }}
            transition={{
              rotate: { duration: 6, repeat: Infinity, ease: "linear" },
              scale: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              },
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ReactionRush = () => {
  // Game state
  const [gameState, setGameState] = useState("menu"); // menu, waiting, ready, active, result, levelComplete
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [currentReactionTime, setCurrentReactionTime] = useState(0);
  const [isGreen, setIsGreen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Refs for timing
  const greenTimeRef = useRef(0);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const currentLevelConfig = GAME_CONFIG.levels[currentLevel - 1];

  // Calculate stats
  const stats = {
    fastest: reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0,
    slowest: reactionTimes.length > 0 ? Math.max(...reactionTimes) : 0,
    average:
      reactionTimes.length > 0
        ? Math.round(
            reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
          )
        : 0,
  };

  const canProceed =
    stats.average > 0 && stats.average <= currentLevelConfig.threshold;

  // Start game
  const startGame = useCallback(() => {
    setGameState("waiting");
    setReactionTimes([]);
    setCurrentRound(1);
    setCurrentReactionTime(0);
    setIsGreen(false);
    setShowConfetti(false);
  }, []);

  // Start next round
  const startRound = useCallback(() => {
    setGameState("waiting");
    setIsGreen(false);
    setCurrentReactionTime(0);

    const delay =
      Math.random() *
        (currentLevelConfig.delayRange[1] - currentLevelConfig.delayRange[0]) +
      currentLevelConfig.delayRange[0];

    timeoutRef.current = setTimeout(() => {
      setIsGreen(true);
      setGameState("ready");
      greenTimeRef.current = Date.now();
    }, delay);
  }, [currentLevelConfig]);

  // Handle click/tap
  const handleClick = useCallback(() => {
    const now = Date.now();

    if (gameState === "waiting") {
      // Too soon - clicked before green
      setGameState("result");
      setCurrentReactionTime("TOO_SOON");

      // Auto-restart round after 2 seconds
      setTimeout(() => {
        startRound();
      }, 2000);
    } else if (gameState === "ready" && isGreen) {
      // Valid click - calculate reaction time
      const reactionTime = now - greenTimeRef.current;
      setCurrentReactionTime(reactionTime);
      setReactionTimes((prev) => [...prev, reactionTime]);
      setGameState("result");

      // Check if level is complete
      if (currentRound >= currentLevelConfig.rounds) {
        setGameState("levelComplete");
        setShowConfetti(true);

        // Hide confetti after 3 seconds
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        // Next round after 2 seconds
        setTimeout(() => {
          setCurrentRound((prev) => prev + 1);
          startRound();
        }, 2000);
      }
    }
  }, [gameState, isGreen, currentRound, currentLevelConfig.rounds, startRound]);

  // Next level
  const nextLevel = useCallback(() => {
    if (currentLevel < GAME_CONFIG.levels.length) {
      setCurrentLevel((prev) => prev + 1);
      setCurrentRound(1);
      setReactionTimes([]);
      setGameState("menu");
    }
  }, [currentLevel]);

  // Retry level
  const retryLevel = useCallback(() => {
    setCurrentRound(1);
    setReactionTimes([]);
    setGameState("menu");
  }, []);

  // Progress bar width
  const progressWidth = (currentRound / currentLevelConfig.rounds) * 100;

  // Cleanup on unmount
  useEffect(() => {
    const timeout = timeoutRef.current;
    const interval = intervalRef.current;

    return () => {
      if (timeout) clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div className="reaction-rush-container">
      <ConfettiAnimation isActive={showConfetti} />

      <motion.div
        className="game-content"
        variants={gameVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <div className="game-header">
          <h1 className="game-title">Reaction Rush</h1>
          <div className="level-info">
            <span className="level-badge">Level {currentLevel}</span>
            <span className="level-name">{currentLevelConfig.name}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              style={{ width: `${progressWidth}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progressWidth}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="progress-text">
            Round {currentRound} of {currentLevelConfig.rounds}
          </div>
        </div>

        {/* Game Area */}
        <div className="game-area">
          <AnimatePresence mode="wait">
            {gameState === "menu" && (
              <motion.div
                key="menu"
                className="game-screen menu-screen"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="menu-title">Welcome to Reaction Rush!</h2>
                <p className="menu-description">
                  Test your reflexes across 6 challenging levels
                </p>
                <div className="level-previews">
                  {GAME_CONFIG.levels.map((level) => (
                    <motion.div
                      key={level.level}
                      className="level-preview"
                      onClick={() => {
                        setCurrentLevel(level.level);
                        startGame();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        cursor: "pointer",
                        background:
                          level.level === currentLevel
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "rgba(255, 255, 255, 0.1)",
                        color:
                          level.level === currentLevel ? "white" : "inherit",
                        border:
                          level.level === currentLevel
                            ? "2px solid rgba(255, 255, 255, 0.3)"
                            : "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <div className="level-number">{level.level}</div>
                      <div className="level-details">
                        <div className="level-name">{level.name}</div>
                        <div className="level-timing">
                          {level.delayRange[0] / 1000}-
                          {level.delayRange[1] / 1000}s delay
                        </div>
                        <div className="level-target">
                          Target: ≤{level.threshold}ms
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* START BUTTONS */}
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "2rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <motion.button
                    className="start-button"
                    onClick={startGame}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      padding: "1rem 2rem",
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      borderRadius: "2rem",
                      cursor: "pointer",
                      minWidth: "150px",
                      zIndex: 10,
                      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                    }}
                  >
                    🎮 Start Game
                  </motion.button>

                  <motion.button
                    className="quick-start-button"
                    onClick={startGame}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      border: "none",
                      padding: "1rem 2rem",
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      borderRadius: "2rem",
                      cursor: "pointer",
                      minWidth: "150px",
                      zIndex: 10,
                      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
                    }}
                  >
                    ⚡ Quick Start
                  </motion.button>
                </div>
              </motion.div>
            )}

            {(gameState === "waiting" || gameState === "ready") && (
              <motion.div
                key="game"
                className={`game-screen ${
                  isGreen ? `${currentLevelConfig.color}-screen` : "gray-screen"
                }`}
                onClick={handleClick}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: isGreen ? currentLevelConfig.gradient : undefined,
                }}
              >
                <motion.div
                  className="game-circle"
                  variants={pulseVariants}
                  animate={gameState === "waiting" ? "pulse" : "none"}
                >
                  <div className="circle-content">
                    {gameState === "waiting" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="waiting-text"
                      >
                        Wait for {currentLevelConfig.color}...
                      </motion.div>
                    )}
                    {gameState === "ready" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ready-text"
                      >
                        CLICK NOW!
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {gameState === "result" && (
              <motion.div
                key="result"
                className="game-screen result-screen"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="result-content">
                  {currentReactionTime === "TOO_SOON" ? (
                    <motion.div
                      className="too-soon-result"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <div className="result-icon">⚠️</div>
                      <div className="result-text">Too Soon!</div>
                      <div className="result-subtitle">
                        Wait for the green color
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="success-result"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <div className="result-icon">⚡</div>
                      <div className="result-time">{currentReactionTime}ms</div>
                      <div className="result-subtitle">
                        {currentReactionTime <= currentLevelConfig.threshold
                          ? "Excellent!"
                          : "Good try!"}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats */}
        {reactionTimes.length > 0 && (
          <motion.div
            className="stats-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{stats.fastest}</div>
                <div className="stat-label">Fastest</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.average}</div>
                <div className="stat-label">Average</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.slowest}</div>
                <div className="stat-label">Slowest</div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Level Complete Modal */}
      <LevelCompleteModal
        isOpen={gameState === "levelComplete"}
        level={currentLevel}
        stats={stats}
        onNextLevel={nextLevel}
        onRetry={retryLevel}
        canProceed={canProceed}
      />
    </div>
  );
};

export default ReactionRush;
