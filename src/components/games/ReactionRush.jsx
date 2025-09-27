import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ReactionRush.css";

// Game configuration
const GAME_CONFIG = {
  levels: [
    {
      level: 1,
      rounds: 5,
      delayRange: [2000, 5000], // 2-5 seconds
      threshold: 350, // ms
      name: "Beginner",
    },
    {
      level: 2,
      rounds: 5,
      delayRange: [1000, 3000], // 1-3 seconds
      threshold: 300, // ms
      name: "Intermediate",
    },
    {
      level: 3,
      rounds: 5,
      delayRange: [500, 2000], // 0.5-2 seconds
      threshold: 250, // ms
      name: "Expert",
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
    color: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"][
      Math.floor(Math.random() * 5)
    ],
    size: Math.random() * 8 + 4,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
          }}
          initial={{ y: -10, opacity: 1 }}
          animate={{
            y: window.innerHeight + 10,
            opacity: 0,
            rotate: 360,
          }}
          transition={{
            duration: particle.duration,
            ease: "easeOut",
            delay: Math.random() * 0.5,
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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <motion.h2
            className="text-3xl font-bold text-center mb-6 text-gray-800"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            🎉 Level {level} Complete!
          </motion.h2>

          <div className="space-y-4 mb-8">
            <motion.div
              className="bg-gray-50 p-4 rounded-lg"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-semibold text-gray-700 mb-2">Your Stats:</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.fastest}ms
                  </div>
                  <div className="text-sm text-gray-500">Fastest</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.average}ms
                  </div>
                  <div className="text-sm text-gray-500">Average</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {stats.slowest}ms
                  </div>
                  <div className="text-sm text-gray-500">Slowest</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={`p-4 rounded-lg ${
                canProceed ? "bg-green-50" : "bg-yellow-50"
              }`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p
                className={`font-semibold ${
                  canProceed ? "text-green-700" : "text-yellow-700"
                }`}
              >
                {canProceed
                  ? `Great job! Average: ${stats.average}ms (Target: ${
                      GAME_CONFIG.levels[level - 1]?.threshold
                    }ms)`
                  : `Keep practicing! Average: ${stats.average}ms (Target: ${
                      GAME_CONFIG.levels[level - 1]?.threshold
                    }ms)`}
              </p>
            </motion.div>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={onRetry}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Retry Level
            </motion.button>

            {canProceed && level < GAME_CONFIG.levels.length && (
              <motion.button
                onClick={onNextLevel}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Next Level
              </motion.button>
            )}
          </div>
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
                  Test your reflexes across 3 challenging levels
                </p>
                <div className="level-previews">
                  {GAME_CONFIG.levels.map((level) => (
                    <div key={level.level} className="level-preview">
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
                    </div>
                  ))}
                </div>
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
                    marginTop: "1rem",
                    zIndex: 10,
                  }}
                >
                  Start Game
                </motion.button>
              </motion.div>
            )}

            {(gameState === "waiting" || gameState === "ready") && (
              <motion.div
                key="game"
                className={`game-screen ${
                  isGreen ? "green-screen" : "gray-screen"
                }`}
                onClick={handleClick}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
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
                        Wait for green...
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
