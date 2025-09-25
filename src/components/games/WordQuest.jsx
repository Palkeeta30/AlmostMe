import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import "./WordQuest.css";

const WordQuest = ({ onGameStart }) => {
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [level, setLevel] = useState(1);
  const [difficulty, setDifficulty] = useState("Easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [lineStart, setLineStart] = useState(null);
  const [lineEnd, setLineEnd] = useState(null);
  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    // Load unlocked levels from localStorage or initialize with only level 1 unlocked per difficulty
    const saved = localStorage.getItem("wordQuestUnlockedLevels");
    if (saved) {
      return JSON.parse(saved);
    } else {
      return {
        Easy: [1],
        Medium: [1],
        Hard: [1],
      };
    }
  });
  const gridRef = useRef(null);

  const levelSettings = useMemo(() => {
    const levels = [];
    const difficulties = ["Easy", "Medium", "Hard"];
    difficulties.forEach((diff) => {
      for (let i = 1; i <= 15; i++) {
        let size, wordCount;
        if (diff === "Easy") {
          size = 8;
          wordCount = 5;
        } else if (diff === "Medium") {
          size = 10;
          wordCount = 7;
        } else {
          size = 12;
          wordCount = 10;
        }
        levels.push({
          difficulty: diff,
          level: i,
          size,
          wordCount,
          locked: !unlockedLevels[diff]?.includes(i),
        });
      }
    });
    return levels;
  }, [unlockedLevels]);

  const wellnessWords = useMemo(() => {
    return {
      Easy: [
        ["CAT", "DOG", "SUN", "BALL", "TREE"],
        ["BOOK", "STAR", "FISH", "GAME", "MILK"],
        ["CUP", "PEN", "BAT", "CAR", "EGG"],
        ["SHIP", "BIRD", "FROG", "KITE", "NEST"],
        ["RING", "DRUM", "MOON", "LAMP", "DESK"],
        ["CORN", "LEAF", "CAKE", "BELL", "DOOR"],
        ["HAT", "SHOE", "SOCK", "BOAT", "DUCK"],
        ["DOLL", "MAP", "WALL", "SOAP", "RICE"],
        ["NOSE", "HAND", "LEG", "EYE", "HAIR"],
        ["KING", "RAIN", "HILL", "ROAD", "FARM"],
        ["FLAG", "BARN", "GOLD", "ROCK", "SAND"],
        ["WOOD", "POND", "ROPE", "JUMP", "PLAY"],
        ["SPIN", "WALK", "RUN", "PARK", "BED"],
        ["RUG", "FOX", "ANT", "BEE", "PIG"],
        ["COW", "GOAT", "PEAR", "MANGO", "PLUM"],
      ],
      Medium: [
        ["PLANET", "TIGER", "SCHOOL", "GARDEN", "ROCKET", "YELLOW", "CIRCLE"],
        ["FOREST", "WINTER", "FLOWER", "SILVER", "MONKEY", "ORANGE", "LAPTOP"],
        ["WINDOW", "DESERT", "JUNGLE", "CANDLE", "MOTHER", "FATHER", "SISTER"],
        ["CASTLE", "DRAGON", "MIRROR", "PILLOW", "HAMMER", "BOTTLE", "MARKET"],
        ["OCEAN", "RABBIT", "LADDER", "SOCCER", "CRICKET", "HOCKEY", "CAMERA"],
        ["GUITAR", "VIOLIN", "BASKET", "DOCTOR", "NURSE", "POLICE", "HUNTER"],
        ["RIDER", "FARMER", "DRIVER", "PAINTER", "SINGER", "MAGNET", "TICKET"],
        ["ERASER", "FOLDER", "PACKET", "TRAVEL", "SUMMER", "AUTUMN", "SPRING"],
        ["LITTLE", "MIDDLE", "HAPPY", "FUNNY", "ANGRY", "SLEEPY", "BRIDGE"],
        ["PALACE", "TUNNEL", "SUBWAY", "ISLAND", "STREET", "CORNER", "AVENUE"],
        ["SHADOW", "ANIMAL", "CIRCUS", "ENGINE", "WALLET", "MARKER", "FRIEND"],
        ["NATURE", "PLANET", "FOREST", "MEMORY", "FAMILY", "HEALTH", "SPIRIT"],
        ["WISDOM", "CUSTOM", "MARKET", "FARMER", "RIDER", "HUNTER", "DESERT"],
        ["LAPTOP", "SINGER", "DRIVER", "CASTLE", "JUNGLE", "DOCTOR", "HOCKEY"],
        ["RABBIT", "LADDER", "VIOLIN", "GUITAR", "CRICKET", "SOCCER", "BOTTLE"],
      ],
      Hard: [
        [
          "MOUNTAIN",
          "CANYON",
          "DESERT",
          "VALLEY",
          "GLACIER",
          "FOREST",
          "JUNGLE",
          "ISLAND",
          "RIVER",
          "OCEAN",
        ],
        [
          "LAGOON",
          "VOLCANO",
          "MEADOW",
          "PRAIRIE",
          "SAVANNA",
          "TUNDRA",
          "BAMBOO",
          "CEDAR",
          "MAPLE",
          "OAK",
        ],
        [
          "PALM",
          "WILLOW",
          "CACTUS",
          "CORAL",
          "MOSSES",
          "KELP",
          "LOTUS",
          "DAISY",
          "ORCHID",
          "TULIP",
        ],
        [
          "GALAXY",
          "COSMOS",
          "NEBULA",
          "ORBIT",
          "COMET",
          "METEOR",
          "ECLIPSE",
          "PLANET",
          "SATURN",
          "JUPITER",
        ],
        [
          "VENUS",
          "MARS",
          "EARTH",
          "PLUTO",
          "URANUS",
          "NEPTUNE",
          "ROCKET",
          "MODULE",
          "LUNAR",
          "CRATER",
        ],
        [
          "ASTEROID",
          "GRAVITY",
          "STARLIT",
          "CLUSTER",
          "SOLAR",
          "COSMIC",
          "PHOTON",
          "PLASMA",
          "STELLAR",
          "QUANTUM",
        ],
        [
          "WIZARD",
          "KNIGHT",
          "CASTLE",
          "DRAGON",
          "SORCERER",
          "POTION",
          "RELIC",
          "GOBLIN",
          "FAIRY",
          "TROLL",
        ],
        [
          "GIANT",
          "OGRE",
          "ELF",
          "MERMAID",
          "UNICORN",
          "GRIFFIN",
          "PHOENIX",
          "HYDRA",
          "CHIMERA",
          "ORACLE",
        ],
        [
          "PROPHET",
          "SEER",
          "MYSTIC",
          "HEALER",
          "SPIRIT",
          "RELICS",
          "TEMPLE",
          "SHRINE",
          "LEGEND",
          "RUNE",
        ],
        [
          "CAPTAIN",
          "WARRIOR",
          "SOLDIER",
          "RANGER",
          "HUNTER",
          "PIRATE",
          "SAILOR",
          "VOYAGER",
          "NOMAD",
          "ARCHER",
        ],
        [
          "GUARDIAN",
          "FIGHTER",
          "HERO",
          "OUTLAW",
          "KNIGHTLY",
          "CRUSADE",
          "MISSION",
          "QUEST",
          "JOURNEY",
          "TRAVEL",
        ],
        [
          "EXPLORE",
          "CLIMB",
          "RESCUE",
          "BATTLE",
          "SIEGE",
          "SHIELD",
          "DAGGER",
          "SWORD",
          "HELMET",
          "ARMOR",
        ],
        [
          "PHANTOM",
          "SHADOW",
          "SPIRIT",
          "ZOMBIE",
          "VAMPIRE",
          "GHOSTLY",
          "SPECTER",
          "GHOUL",
          "BANSHEE",
          "MUMMY",
        ],
        [
          "WEREWOLF",
          "DEMON",
          "ANGELIC",
          "CURSED",
          "OMEN",
          "ORACLE",
          "VISION",
          "DESTINY",
          "RITUAL",
          "SHRINE",
        ],
        [
          "HAUNTED",
          "EERIE",
          "SPOOKY",
          "PORTAL",
          "HIDDEN",
          "CRYPTIC",
          "PUZZLE",
          "ENIGMA",
          "SECRET",
          "PROPHECY",
        ],
      ],
    };
  }, []);

  const currentLevelIndex = useMemo(() => {
    return levelSettings.findIndex(
      (lvl) => lvl.difficulty === difficulty && lvl.level === level
    );
  }, [difficulty, level, levelSettings]);

  const currentLevel = levelSettings[currentLevelIndex] || levelSettings[0];
  const gridSize = currentLevel.size;

  const getWordsForLevel = useCallback(() => {
    const allWords = wellnessWords[difficulty] || [];
    const levelIndex = level - 1;
    if (allWords[levelIndex]) {
      return allWords[levelIndex];
    }
    // fallback to first level words if not found
    return allWords[0] || [];
  }, [difficulty, level, wellnessWords]);

  const canPlaceWord = useCallback(
    (grid, word, startRow, startCol, direction) => {
      for (let i = 0; i < word.length; i++) {
        const row = startRow + i * direction[0];
        const col = startCol + i * direction[1];

        if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
          return false;
        }

        if (grid[row][col] !== "" && grid[row][col] !== word[i]) {
          return false;
        }
      }
      return true;
    },
    [gridSize]
  );

  const isWordInGrid = useCallback(
    (grid, word) => {
      const directions = [
        [0, 1], // right
        [1, 0], // down
        [1, 1], // diagonal down-right
        [1, -1], // diagonal down-left
        [0, -1], // left
        [-1, 0], // up
        [-1, -1], // diagonal up-left
        [-1, 1], // diagonal up-right
      ];

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          for (const [dr, dc] of directions) {
            let found = true;
            for (let i = 0; i < word.length; i++) {
              const r = row + i * dr;
              const c = col + i * dc;
              if (
                r < 0 ||
                r >= gridSize ||
                c < 0 ||
                c >= gridSize ||
                grid[r][c] !== word[i]
              ) {
                found = false;
                break;
              }
            }
            if (found) {
              return true;
            }
          }
        }
      }
      return false;
    },
    [gridSize]
  );

  const createGrid = useCallback(
    (words) => {
      let attempts = 0;
      const maxAttempts = 200; // Increased attempts
      let grid;
      let success = false;

      do {
        grid = Array(gridSize)
          .fill()
          .map(() => Array(gridSize).fill(""));

        // Sort words by length (longest first) for better placement
        const sortedWords = [...words].sort((a, b) => b.length - a.length);
        let allPlaced = true;

        for (let i = 0; i < sortedWords.length; i++) {
          const word = sortedWords[i];
          let placed = false;
          let wordAttempts = 0;
          const maxWordAttempts = 200; // More attempts per word

          while (!placed && wordAttempts < maxWordAttempts) {
            const directions = [
              [0, 1],
              [1, 0],
              [1, 1],
              [1, -1],
              [0, -1],
              [-1, 0],
              [-1, -1],
              [-1, 1], // All 8 directions
            ];
            const direction =
              directions[Math.floor(Math.random() * directions.length)];
            const startRow = Math.floor(Math.random() * gridSize);
            const startCol = Math.floor(Math.random() * gridSize);

            if (canPlaceWord(grid, word, startRow, startCol, direction)) {
              for (let j = 0; j < word.length; j++) {
                const row = startRow + j * direction[0];
                const col = startCol + j * direction[1];
                grid[row][col] = word[j];
              }
              placed = true;
            }
            wordAttempts++;
          }

          if (!placed) {
            allPlaced = false;
            break;
          }
        }

        if (allPlaced) {
          // Verify all words are actually in the grid
          const currentGrid = grid;
          const allWordsPlaced = words.every((word) =>
            isWordInGrid(currentGrid, word)
          );
          if (allWordsPlaced) {
            success = true;
            break;
          }
        }
        attempts++;
      } while (attempts < maxAttempts && !success);

      // If we couldn't place all words, use a fallback approach
      if (!success) {
        console.warn("Could not place all words optimally, using fallback");
        // Fallback: place words in a simple pattern
        grid = Array(gridSize)
          .fill()
          .map(() => Array(gridSize).fill(""));

        for (let index = 0; index < words.length; index++) {
          const word = words[index];
          const row = Math.floor(index / 2) * 2;
          const col = (index % 2) * Math.max(0, gridSize - word.length);
          for (let j = 0; j < Math.min(word.length, gridSize - col); j++) {
            grid[row][col + j] = word[j];
          }
        }
      }

      // Fill empty cells with random letters
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (grid[i][j] === "") {
            grid[i][j] = String.fromCharCode(
              65 + Math.floor(Math.random() * 26)
            );
          }
        }
      }

      return grid;
    },
    [gridSize, canPlaceWord, isWordInGrid]
  );

  const initializeGame = useCallback(() => {
    const selectedWords = getWordsForLevel();
    const newGrid = createGrid(selectedWords);
    setGrid(newGrid);
    setWords(selectedWords);
    setFoundWords([]);
    setSelectedCells([]);
    setGameWon(false);
  }, [getWordsForLevel, createGrid]);

  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [level, difficulty, gameStarted, initializeGame]);

  // Remove unused functions to fix eslint warnings

  const handleMouseDown = (e) => {
    e.preventDefault();
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const cellSizeX = rect.width / gridSize;
    const cellSizeY = rect.height / gridSize;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate cell row and col
    const col = Math.floor(x / cellSizeX);
    const row = Math.floor(y / cellSizeY);

    // Calculate center coordinates of the cell
    const centerX = col * cellSizeX + cellSizeX / 2;
    const centerY = row * cellSizeY + cellSizeY / 2;

    setLineStart({ x: centerX, y: centerY, row, col });
    setLineEnd({ x: centerX, y: centerY, row, col });
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    if (!lineStart) return;
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const cellSizeX = rect.width / gridSize;
    const cellSizeY = rect.height / gridSize;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate cell row and col
    const col = Math.floor(x / cellSizeX);
    const row = Math.floor(y / cellSizeY);

    // Calculate center coordinates of the cell
    const centerX = col * cellSizeX + cellSizeX / 2;
    const centerY = row * cellSizeY + cellSizeY / 2;

    setLineEnd({ x: centerX, y: centerY, row, col });
  };

  const handleMouseUp = () => {
    if (!lineStart || !lineEnd) return;

    // Use the stored row and col from lineStart and lineEnd for precise cell indices
    const start = { row: lineStart.row, col: lineStart.col };
    const end = { row: lineEnd.row, col: lineEnd.col };

    // Calculate cells along the line using row and col instead of pixel coordinates
    const cells = [];
    const dx = end.col - start.col;
    const dy = end.row - start.row;
    const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
    const stepY = dy === 0 ? 0 : dy / Math.abs(dy);

    // Validate direction
    if (
      !(
        (stepX === 0 && stepY !== 0) ||
        (stepX !== 0 && stepY === 0) ||
        (Math.abs(stepX) === 1 && Math.abs(stepY) === 1)
      )
    ) {
      setSelectedCells([]);
      setLineStart(null);
      setLineEnd(null);
      return;
    }

    let currentRow = start.row;
    let currentCol = start.col;

    while (
      currentRow >= 0 &&
      currentRow < gridSize &&
      currentCol >= 0 &&
      currentCol < gridSize
    ) {
      cells.push(currentRow * gridSize + currentCol);
      if (currentRow === end.row && currentCol === end.col) {
        break;
      }
      currentRow += stepY;
      currentCol += stepX;
    }

    setSelectedCells(cells);
    checkWord(cells);
    setLineStart(null);
    setLineEnd(null);
  };

  const checkWord = (cells) => {
    if (cells.length < 2) {
      setSelectedCells([]);
      return;
    }

    const word = cells
      .map((index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        return grid[row][col];
      })
      .join("");

    const reversedWord = word.split("").reverse().join("");

    const foundWord = words.find((w) => w === word || w === reversedWord);

    if (foundWord && !foundWords.includes(foundWord)) {
      setFoundWords((prev) => [...prev, foundWord]);
      // Keep the selection to show the found word
    } else {
      setSelectedCells([]);
    }
  };

  useEffect(() => {
    if (foundWords.length === words.length && gameStarted && words.length > 0) {
      setGameWon(true);
    }
  }, [foundWords, words, gameStarted]);

  useEffect(() => {
    if (!gameStarted && onGameStart) {
      onGameStart(false);
    }
  }, [gameStarted, onGameStart]);

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    if (onGameStart) onGameStart(true);
  };

  const nextLevel = () => {
    if (level < 15) {
      const nextLvl = level + 1;
      setLevel(nextLvl);
      // Unlock next level
      setUnlockedLevels((prev) => {
        const updated = { ...prev };
        if (!updated[difficulty]) updated[difficulty] = [];
        if (!updated[difficulty].includes(nextLvl)) {
          updated[difficulty].push(nextLvl);
          localStorage.setItem(
            "wordQuestUnlockedLevels",
            JSON.stringify(updated)
          );
        }
        return updated;
      });
    } else {
      const difficulties = ["Easy", "Medium", "Hard"];
      const currentIndex = difficulties.indexOf(difficulty);
      if (currentIndex < difficulties.length - 1) {
        setDifficulty(difficulties[currentIndex + 1]);
        setLevel(1);
      } else {
        setGameWon(true);
      }
    }
    setGameWon(false);
  };

  const shuffleGrid = () => {
    const newGrid = createGrid(words);
    setGrid(newGrid);
    setFoundWords([]);
    setSelectedCells([]);
    setGameWon(false);
  };

  const replayLevel = () => {
    const newGrid = createGrid(words);
    setGrid(newGrid);
    setFoundWords([]);
    setSelectedCells([]);
    setGameWon(false);
  };

  if (!gameStarted) {
    return (
      <div className="word-quest-container">
        <div className="game-menu">
          <h1>Word Quest</h1>
          <p>Find wellness words in the grid!</p>
          <div className="difficulty-select">
            <label>
              Difficulty:
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  setLevel(1);
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
          </div>
          <div className="level-select">
            <label>Level:</label>
            <div className="levels-list">
              {[...Array(15)].map((_, idx) => {
                const lvl = idx + 1;
                const isLocked = !unlockedLevels[difficulty]?.includes(lvl);
                return (
                  <button
                    key={lvl}
                    disabled={isLocked}
                    className={`level-button ${lvl === level ? "active" : ""} ${
                      isLocked ? "locked" : ""
                    }`}
                    onClick={() => {
                      if (!isLocked) setLevel(lvl);
                    }}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
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
      <div className="word-quest-container">
        <div className="level-complete">
          <h1>
            {difficulty} Level {level} Complete!
          </h1>
          <p>Found all {words.length} words!</p>
          <button onClick={nextLevel} className="next-level-button">
            Next Level
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="word-quest-container">
      <div className="game-ui">
        <div className="level">
          Difficulty: {difficulty} - Level: {level}
        </div>
        <div className="found">
          Found: {foundWords.length}/{words.length}
        </div>
        <div className="game-controls">
          <button onClick={shuffleGrid} className="shuffle-button">
            Shuffle
          </button>
          <button onClick={replayLevel} className="replay-button">
            Replay
          </button>
        </div>
      </div>
      <div className="game-area">
        <div
          ref={gridRef}
          className="word-grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {grid.flat().map((letter, index) => {
            const isSelected = selectedCells.includes(index);
            return (
              <div
                key={index}
                className={`grid-cell ${isSelected ? "selected" : ""}`}
                // Remove click handler to disable clicking
                // Add pointer events only for drag selection
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
              >
                {letter}
              </div>
            );
          })}
        </div>
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {lineStart && lineEnd && (
            <line
              x1={lineStart.x}
              y1={lineStart.y}
              x2={lineEnd.x}
              y2={lineEnd.y}
              stroke="red"
              strokeWidth="2"
            />
          )}
        </svg>
        <div className="words-list">
          <h3>Words to find:</h3>
          <ul>
            {words &&
              words.length > 0 &&
              words.map((word, index) => (
                <li
                  key={word + index}
                  className={foundWords.includes(word) ? "found" : ""}
                >
                  {word}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WordQuest;
