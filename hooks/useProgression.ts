"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  UserStats,
  GameResult,
  LEVEL_TIERS,
  LevelTier,
} from "@/types/progression";

const STORAGE_KEY = "pendu_pokemon_stats";

const initialStats: UserStats = {
  level: 1,
  currentXP: 0,
  totalXP: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  winStreak: 0,
  bestWinStreak: 0,
  pokemonFound: new Set(),
  typesCompleted: new Set(),
};

function loadStats(): UserStats {
  if (typeof window === "undefined") return initialStats;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialStats;

    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      pokemonFound: new Set(parsed.pokemonFound || []),
      typesCompleted: new Set(parsed.typesCompleted || []),
    };
  } catch {
    return initialStats;
  }
}

function saveStats(stats: UserStats): void {
  if (typeof window === "undefined") return;

  try {
    const toSave = {
      ...stats,
      pokemonFound: Array.from(stats.pokemonFound),
      typesCompleted: Array.from(stats.typesCompleted),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
  }
}

function calculateXP(result: GameResult): number {
  let xp = 0;

  // Base XP pour une victoire
  if (result.won) {
    xp += 50;

    // Bonus pour les vies restantes
    xp += result.livesRemaining * 5;

    // Bonus pour la longueur du nom (plus long = plus difficile)
    const nameLength = result.pokemonName.length;
    if (nameLength > 10) xp += 20;
    else if (nameLength > 7) xp += 10;
  } else {
    // XP réduite pour une défaite
    xp += 10;
  }

  return xp;
}

function calculateLevel(totalXP: number): number {
  // Parcourir les niveaux de haut en bas pour trouver le niveau maximum atteint
  let maxLevel = 1;
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_TIERS[i].xpRequired) {
      maxLevel = LEVEL_TIERS[i].level;
      break;
    }
  }
  return maxLevel;
}

function calculateCurrentXP(totalXP: number, level: number): number {
  const currentTier = LEVEL_TIERS.find((t) => t.level === level);
  if (!currentTier) return 0;
  return Math.max(0, totalXP - currentTier.xpRequired);
}

export function useProgression() {
  const [stats, setStats] = useState<UserStats>(() => {
    const loaded = loadStats();
    // Recalculer le niveau au chargement pour s'assurer qu'il est correct
    const correctLevel = calculateLevel(loaded.totalXP);
    const correctCurrentXP = calculateCurrentXP(loaded.totalXP, correctLevel);
    return {
      ...loaded,
      level: correctLevel,
      currentXP: correctCurrentXP,
    };
  });

  // Recalculer le niveau et currentXP si le totalXP change (sécurité supplémentaire)
  useEffect(() => {
    setStats((prev) => {
      const correctLevel = calculateLevel(prev.totalXP);
      const correctCurrentXP = calculateCurrentXP(prev.totalXP, correctLevel);

      // Mettre à jour si le niveau ou le currentXP a changé
      if (correctLevel !== prev.level || correctCurrentXP !== prev.currentXP) {
        return {
          ...prev,
          level: correctLevel,
          currentXP: correctCurrentXP,
        };
      }
      return prev;
    });
  }, [stats.totalXP]);

  // Sauvegarder à chaque changement
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  // Calculer le niveau actuel et le prochain palier
  const currentTier = useMemo(() => {
    return (
      LEVEL_TIERS.find((tier) => tier.level === stats.level) || LEVEL_TIERS[0]
    );
  }, [stats.level]);

  const nextTier = useMemo(() => {
    return LEVEL_TIERS.find((tier) => tier.level === stats.level + 1);
  }, [stats.level]);

  const progressToNextLevel = useMemo(() => {
    if (!nextTier) return 100;
    // Utiliser currentXP qui est déjà calculé correctement
    const xpNeededForNext = nextTier.xpRequired - currentTier.xpRequired;
    if (xpNeededForNext <= 0) return 100;
    const progress = (stats.currentXP / xpNeededForNext) * 100;
    return Math.min(100, Math.max(0, progress));
  }, [stats.currentXP, currentTier, nextTier]);

  const recordGameResult = useCallback((result: GameResult) => {
    setStats((prev) => {
      const xpGained = calculateXP(result);
      const newTotalXP = prev.totalXP + xpGained;
      const newLevel = calculateLevel(newTotalXP);
      const newCurrentXP = calculateCurrentXP(newTotalXP, newLevel);
      const currentTier = LEVEL_TIERS.find((t) => t.level === newLevel);
      const nextTier = LEVEL_TIERS.find((t) => t.level === newLevel + 1);

      const newPokemonFound = new Set(prev.pokemonFound);
      newPokemonFound.add(result.pokemonName.toLowerCase());

      const newTypesCompleted = new Set(prev.typesCompleted);
      if (result.pokemonType) {
        newTypesCompleted.add(result.pokemonType.toLowerCase());
      }

      let newWinStreak = prev.winStreak;
      let newBestWinStreak = prev.bestWinStreak;

      if (result.won) {
        newWinStreak = prev.winStreak + 1;
        newBestWinStreak = Math.max(prev.bestWinStreak, newWinStreak);
      } else {
        newWinStreak = 0;
      }

      const updatedStats = {
        ...prev,
        level: newLevel,
        currentXP: newCurrentXP,
        totalXP: newTotalXP,
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: result.won ? prev.gamesWon + 1 : prev.gamesWon,
        gamesLost: result.won ? prev.gamesLost : prev.gamesLost + 1,
        winStreak: newWinStreak,
        bestWinStreak: newBestWinStreak,
        pokemonFound: newPokemonFound,
        typesCompleted: newTypesCompleted,
      };

      // Calculer le pourcentage de progression vers le prochain niveau
      const progressPercent =
        nextTier && currentTier
          ? (
              (newCurrentXP / (nextTier.xpRequired - currentTier.xpRequired)) *
              100
            ).toFixed(1)
          : "100";

      // Debug log pour vérifier la progression
      console.log("🎮 Résultat enregistré:", {
        xpGained,
        newTotalXP,
        newLevel,
        newCurrentXP,
        tier: currentTier?.name,
        nextTier: nextTier?.name,
        progressToNext: `${progressPercent}%`,
        xpNeededForNext:
          nextTier && currentTier
            ? nextTier.xpRequired - currentTier.xpRequired
            : 0,
      });

      return updatedStats;
    });
  }, []);

  const resetStats = useCallback(() => {
    setStats(initialStats);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    stats,
    currentTier,
    nextTier,
    progressToNextLevel,
    recordGameResult,
    resetStats,
  };
}
