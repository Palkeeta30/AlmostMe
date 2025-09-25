import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./CardFlipChallenge.css";

const CardFlipChallenge = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [theme, setTheme] = useState("flowers");

  const themes = useMemo(
    () => ({
      flowers: [
        "🌸",
        "🌺",
        "🌻",
        "🌷",
        "🌹",
        "🌼",
        "🌿",
        "🍀",
        "🌾",
        "🌱",
        "🌲",
        "🌳",
        "🌴",
        "🌵",
        "🌾",
        "🍄",
        "🌰",
        "🌸",
        "🌺",
        "🌻",
        "🌷",
        "🌹",
        "🌼",
        "🌿",
        "🍀",
        "🌾",
        "🌱",
        "🌲",
        "🌳",
        "🌴",
        "🌵",
        "🌾",
        "🍄",
        "🌰",
      ],
      animals: [
        "🐶",
        "🐱",
        "🐭",
        "🐹",
        "🐰",
        "🦊",
        "🐻",
        "🐼",
        "🐨",
        "🐯",
        "🦁",
        "🐸",
        "🐵",
        "🐔",
        "🐧",
        "🐦",
        "🐤",
        "🐣",
        "🐥",
        "🦆",
        "🦅",
        "🦉",
        "🦇",
        "🐺",
        "🐗",
        "🐴",
        "🦄",
        "🐝",
        "🐛",
        "🦋",
        "🐌",
        "🐞",
        "🐜",
        "🦗",
        "🕷️",
        "🦂",
        "🐢",
        "🐍",
        "🦎",
        "🐙",
        "🦑",
        "🦐",
        "🦞",
        "🦀",
        "🐡",
        "🐠",
        "🐟",
        "🐬",
        "🐳",
        "🐋",
        "🦈",
        "🐊",
        "🐅",
        "🐆",
        "🦓",
        "🦍",
        "🦧",
        "🐘",
        "🦛",
        "🦏",
        "🐪",
        "🐫",
        "🦒",
        "🦘",
        "🐃",
        "🐂",
        "🐄",
        "🐎",
        "🐖",
        "🐏",
        "🐑",
        "🦙",
        "🐐",
        "🦌",
        "🐕",
        "🐩",
        "🦮",
        "🐕‍🦺",
        "🐈",
        "🐈‍⬛",
        "🪶",
        "🐓",
        "🦃",
        "🦚",
        "🦜",
        "🦢",
        "🦩",
        "🕊️",
        "🐇",
        "🦝",
        "🦨",
        "🦡",
        "🦦",
        "🦥",
        "🐁",
        "🐀",
        "🐿️",
        "🦔",
      ],
    }),
    []
  );

  const cardSymbols = useMemo(() => themes[theme], [themes, theme]);

  const levelSettings = [
    { pairs: 6, time: 60 },
    { pairs: 8, time: 75 },
    { pairs: 10, time: 90 },
    { pairs: 12, time: 105 },
    { pairs: 15, time: 120 },
  ];

  const currentLevel =
    levelSettings[Math.min(level - 1, levelSettings.length - 1)];
  const totalPairs = currentLevel.pairs;

  const initializeGame = useCallback(() => {
    const selectedSymbols = cardSymbols.slice(0, totalPairs);
    const gameCards = [...selectedSymbols, ...selectedSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setTimeLeft(currentLevel.time);
    setGameWon(false);
    setGameOver(false);
  }, [cardSymbols, totalPairs, currentLevel.time]);

  useEffect(() => {
    if (gameStarted && !gameWon && !gameOver) {
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
  }, [gameStarted, gameWon, gameOver]);

  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [level, gameStarted, initializeGame]);

  const handleCardClick = (id) => {
    if (
      flippedCards.length === 2 ||
      cards[id].isFlipped ||
      cards[id].isMatched ||
      gameOver
    )
      return;

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, isFlipped: true } : card))
    );

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      const [first, second] = newFlippedCards;
      if (cards[first].symbol === cards[second].symbol) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatchedPairs((prev) => [...prev, cards[first].symbol]);
          setFlippedCards([]);
        }, 1000);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs.length === totalPairs && gameStarted) {
      setGameWon(true);
    }
  }, [matchedPairs, totalPairs, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
  };

  const nextLevel = () => {
    setLevel((prev) => prev + 1);
    setGameWon(false);
  };

  const restartGame = () => {
    setGameOver(false);
    initializeGame();
  };

  if (!gameStarted) {
    return (
      <div className="card-flip-container">
        <div className="game-menu">
          <h1>Card Flip Challenge</h1>
          <p>Flip cards to find matching pairs before time runs out!</p>
          <div className="theme-selector">
            <label htmlFor="theme-select">Choose Theme:</label>
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="theme-select"
            >
              <option value="flowers">🌸 Flowers</option>
              <option value="animals">🐶 Animals</option>
            </select>
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
      <div className="card-flip-container">
        <div className="level-complete">
          <h1>Level {level} Complete!</h1>
          <p>
            Moves: {moves} | Time: {currentLevel.time - timeLeft}s
          </p>
          <button onClick={nextLevel} className="next-level-button">
            Next Level
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="card-flip-container">
        <div className="level-complete">
          <h1>Time's Up!</h1>
          <p>
            You found {matchedPairs.length} out of {totalPairs} pairs
          </p>
          <button onClick={restartGame} className="next-level-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-flip-container">
      <div className="game-ui">
        <div className="level">Level: {level}</div>
        <div className="moves">Moves: {moves}</div>
        <div className="time">Time: {timeLeft}s</div>
        <div className="pairs">
          Pairs: {matchedPairs.length}/{totalPairs}
        </div>
      </div>
      <div
        className="cards-grid"
        style={{
          gridTemplateColumns: `repeat(${Math.ceil(
            Math.sqrt(totalPairs * 2)
          )}, 1fr)`,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${
              card.isFlipped || card.isMatched ? "flipped" : ""
            } ${card.isMatched ? "matched" : ""}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.symbol}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardFlipChallenge;
