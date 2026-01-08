"use client";

import { useState, useEffect } from "react";
import { useProgression } from "@/hooks/useProgression";
import styles from "./LevelDisplay.module.css";

export default function LevelDisplay() {
  const { stats, currentTier, nextTier, progressToNextLevel } =
    useProgression();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debug: afficher les infos de progression (doit être avant le return conditionnel)
  useEffect(() => {
    if (isMounted) {
      console.log("📊 Progression actuelle:", {
        level: stats.level,
        totalXP: stats.totalXP,
        currentXP: stats.currentXP,
        tierName: currentTier.name,
        nextTierName: nextTier?.name || "Max",
        nextTierXP: nextTier?.xpRequired || "Max",
        currentTierXP: currentTier.xpRequired,
        progressToNext: `${Math.round(progressToNextLevel)}%`,
        xpNeededForNext: nextTier
          ? nextTier.xpRequired - currentTier.xpRequired
          : 0,
      });
    }
  }, [
    isMounted,
    stats.level,
    stats.totalXP,
    stats.currentXP,
    currentTier,
    nextTier,
    progressToNextLevel,
  ]);

  if (!isMounted) {
    return (
      <div className={styles.container}>
        <div className={styles.levelInfo}>
          <div className={styles.levelBadge} style={{ background: "#94a3b8" }}>
            <span className={styles.levelNumber}>Niveau 1</span>
            <span className={styles.levelName}>Débutant</span>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>XP Total</span>
              <span className={styles.statValue}>0</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Victoires</span>
              <span className={styles.statValue}>0</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Série</span>
              <span className={styles.statValue}>0 🔥</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.levelInfo}>
        <div
          className={styles.levelBadge}
          style={{ background: currentTier.color }}
        >
          <span className={styles.levelNumber}>Niveau {stats.level}</span>
          <span className={styles.levelName}>{currentTier.name}</span>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>XP Total</span>
            <span className={styles.statValue}>{stats.totalXP}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Victoires</span>
            <span className={styles.statValue}>{stats.gamesWon}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Série</span>
            <span className={styles.statValue}>{stats.winStreak} 🔥</span>
          </div>
        </div>
      </div>

      {nextTier && (
        <div className={styles.progressBar}>
          <div className={styles.progressLabel}>
            <span>Prochain niveau: {nextTier.name}</span>
            <span>{Math.round(progressToNextLevel)}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{
                width: `${progressToNextLevel}%`,
                background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})`,
              }}
            />
          </div>
          <div className={styles.progressXP}>
            {stats.currentXP} / {nextTier.xpRequired - currentTier.xpRequired}{" "}
            XP
          </div>
        </div>
      )}
    </div>
  );
}
