"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGame } from "@/hooks/useGame";
import { useProgression } from "@/hooks/useProgression";
import Letters from "@/components/letters/Letters";
import PokemonSelector from "@/components/pokemon/PokemonSelector";
import LivesDisplay from "@/components/game/LivesDisplay";
import ScoreDisplay from "@/components/game/ScoreDisplay";
import GameModal from "@/components/game/GameModal";
import LevelDisplay from "@/components/progression/LevelDisplay";
import ChangePokemonButton from "@/components/game/ChangePokemonButton";
import Image from "next/image";
import { INITIAL_LIVES } from "@/utils/game";
import styles from "../page.module.css";

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const limit = parseInt(searchParams.get("limit") || "1302", 10);
  const typeParam = searchParams.get("type");

  const {
    gameState,
    selectLetter,
    selectPokemon,
    resetGame,
    nextPokemon,
    maskedWord,
    isGameActive,
    score,
    totalScore,
    combo,
  } = useGame();
  const { recordGameResult, stats } = useProgression();
  const [showModal, setShowModal] = useState(false);
  const [hasRecordedResult, setHasRecordedResult] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [shouldFetchNewPokemon, setShouldFetchNewPokemon] = useState(false);

  const gameStatus = gameState.gameStatus;
  const shouldShowModal =
    (gameStatus === "won" || gameStatus === "lost") && showModal;

  // Calculer l'XP gagné
  const calculateXP = (won: boolean, livesRemaining: number, pokemonName: string) => {
    let xp = 0;
    if (won) {
      xp += 50;
      xp += livesRemaining * 5;
      const nameLength = pokemonName.length;
      if (nameLength > 10) xp += 20;
      else if (nameLength > 7) xp += 10;
    } else {
      xp += 10;
    }
    return xp;
  };

  // Enregistrer le résultat du jeu
  useEffect(() => {
    if ((gameStatus === "won" || gameStatus === "lost") && !hasRecordedResult && gameState.selectedPokemonName) {
      const pokemonType = gameState.selectedPokemon?.type || typeParam || undefined;
      const xp = calculateXP(gameStatus === "won", gameState.lives, gameState.selectedPokemonName);
      
      setXpGained(xp);
      
      recordGameResult({
        won: gameStatus === "won",
        pokemonName: gameState.selectedPokemonName,
        pokemonType: pokemonType,
        xpGained: xp,
        livesRemaining: gameState.lives,
        timestamp: Date.now(),
      });
      
      setHasRecordedResult(true);
    }
  }, [gameStatus, gameState.selectedPokemonName, gameState.selectedPokemon, gameState.lives, hasRecordedResult, recordGameResult, typeParam]);

  // Ouvrir la modal automatiquement quand le jeu se termine
  useEffect(() => {
    if (gameStatus === "won" || gameStatus === "lost") {
      setShowModal(true);
    }
  }, [gameStatus]);

  const handlePokemonSelected = useCallback(
    (pokemon: any) => {
      selectPokemon(pokemon);
    },
    [selectPokemon]
  );

  const handleRestart = () => {
    resetGame();
    setShowModal(false);
    setHasRecordedResult(false);
    setXpGained(0);
  };

  const handleNext = useCallback(async () => {
    setShowModal(false);
    setHasRecordedResult(false);
    setXpGained(0);
    // Réinitialiser le jeu d'abord
    nextPokemon();
    // Puis déclencher le fetch d'un nouveau Pokémon
    setShouldFetchNewPokemon(true);
  }, [nextPokemon]);

  const handleChangePokemon = useCallback(() => {
    // Réinitialiser la partie en cours (garde le score total)
    nextPokemon();
    setShowModal(false);
    setHasRecordedResult(false);
    setXpGained(0);
    // Déclencher le fetch d'un nouveau Pokémon
    setShouldFetchNewPokemon(true);
  }, [nextPokemon]);


  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title} data-text="Pendu Pokémon">Pendu Pokémon</h1>
        <button
          onClick={() => router.push("/home")}
          className={styles.backButton}
        >
          ← Accueil
        </button>
      </header>

      <main className={styles.container}>
        <aside className={styles.sidebar}>
          <LevelDisplay />
          <ScoreDisplay 
            score={totalScore} 
            combo={combo}
            lastScoreGain={gameState.lastScoreGain}
          />
          <LivesDisplay lives={gameState.lives} totalLives={INITIAL_LIVES} />
          <ChangePokemonButton 
            onClick={handleChangePokemon}
            disabled={!gameState.selectedPokemonName}
          />
        </aside>
        
        <div className={styles.gameArea}>
          <div className={styles.topSection}>

          <PokemonSelector
            onPokemonSelected={handlePokemonSelected}
            disabled={isGameActive}
            limit={limit}
            type={typeParam as any}
            shouldFetchNew={shouldFetchNewPokemon}
            onPokemonFetched={() => setShouldFetchNewPokemon(false)}
          />

          <div className={styles.maskedWord}>
            {gameState.selectedPokemonName && (
              <p className={styles.word}>{maskedWord}</p>
            )}
          </div>
        </div>

          <div className={styles.lettersSection}>
            <Letters
              onLetterSelected={selectLetter}
              usedLetters={gameState.usedLetters}
              incorrectLetters={gameState.incorrectLetters}
              disabled={!isGameActive}
            />
          </div>
        </div>
      </main>

      <GameModal
        isOpen={shouldShowModal}
        type={gameStatus === "won" ? "won" : "lost"}
        pokemonName={gameState.selectedPokemonName}
        xpGained={xpGained}
        score={score}
        totalScore={totalScore}
        combo={combo}
        onClose={() => setShowModal(false)}
        onRestart={handleRestart}
        onNext={handleNext}
      />
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Chargement...</div>}>
      <GameContent />
    </Suspense>
  );
}

