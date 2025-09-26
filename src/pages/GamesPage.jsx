import React, { useState } from "react";
import BubbleBurstBliss from "../components/games/BubbleBurstBliss";
import MindMazeMatch from "../components/games/MindMazeMatch";
import ZenGardenPuzzle from "../components/games/ZenGardenPuzzle";
import ReactionRush from "../components/games/ReactionRushFixed";
import WordQuest from "../components/games/WordQuest";
import CardFlipChallenge from "../components/games/CardFlipChallenge";
import Navbar from "../components/Navbar";
import "../components/games/BubbleBurstBliss.css";
import "../components/games/MindMazeMatch.css";
import "../components/games/ZenGardenPuzzle.css";
import "../components/games/ReactionRush.css";
import "../components/games/WordQuest.css";
import "../components/games/CardFlipChallenge.css";
import "./GamesPage.css";

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: "bubble-burst",
      name: "Bubble Burst Bliss",
      description: "Relax by popping bubbles",
      component: BubbleBurstBliss,
    },
    {
      id: "mind-maze",
      name: "Mind Maze Match",
      description: "Memory challenge with cute cards",
      component: MindMazeMatch,
    },
    {
      id: "zen-garden",
      name: "Zen Garden Puzzle",
      description: "Peaceful sliding puzzle",
      component: ZenGardenPuzzle,
    },
    {
      id: "reaction-rush",
      name: "Reaction Rush",
      description: "Test your reflexes with targets",
      component: ReactionRush,
    },
    {
      id: "word-quest",
      name: "Word Quest",
      description: "Find wellness words in the grid",
      component: WordQuest,
    },
    {
      id: "card-flip",
      name: "Card Flip Challenge",
      description: "Concentration game with time limit",
      component: CardFlipChallenge,
    },
  ];

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return (
      <>
        {/* Hide navbar during gameplay by not rendering it */}
        <div
          className="games-container"
          style={{ paddingTop: "60px", position: "relative" }}
        >
          {/* Back to Games button just below navbar and above score/level */}
          <button
            onClick={() => setSelectedGame(null)}
            className="back-button"
            style={{
              position: "absolute",
              top: "-40px",
              left: "10px",
              zIndex: 1000,
            }}
          >
            Back to Games
          </button>
          <div className="game-controls" style={{ position: "relative" }}>
            {/* Additional controls can be added here: Pause, Resume, Stop, Score display */}
          </div>
          <button
            onClick={() => setSelectedGame(null)}
            className="back-button"
            aria-label="Back to Games"
            style={{
              position: "absolute",
              right: "calc(70.66% + 20px)", // Assuming Level is left third (33.33%), center is 50%, so 66.66% is right edge of level section
              top: "65px",
              zIndex: 1000,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "40px",
              color: "#fff",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Back to Games"
          >
            &#11013;
          </button>
          <GameComponent key={selectedGame.id} />
        </div>
      </>
    );
  }

  return (
    <div className="games-page">
      <Navbar />
      <h1>Games</h1>
      <p>Choose a game to play and relax your mind!</p>
      <div className="games-grid">
        {games.map((game) => (
          <div
            key={game.id}
            className="game-card"
            onClick={() => setSelectedGame(game)}
          >
            <h3>{game.name}</h3>
            <p>{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
