"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./ScoreDisplay.module.css";

interface ScoreDisplayProps {
  score: number;
  combo: number;
  lastScoreGain?: number;
}

export default function ScoreDisplay({
  score,
  combo,
  lastScoreGain = 0,
}: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [showGain, setShowGain] = useState(false);
  const [gainValue, setGainValue] = useState(0);
  const prevScoreRef = useRef(score);

  // S'assurer que l'hydratation est complète avant d'afficher le score
  useEffect(() => {
    setIsMounted(true);
    setDisplayScore(score);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (score !== prevScoreRef.current) {
      const diff = score - prevScoreRef.current;
      if (diff > 0) {
        setGainValue(diff);
        setShowGain(true);
        setTimeout(() => setShowGain(false), 2000);
      }
      prevScoreRef.current = score;
    }

    // Animation du score qui monte progressivement
    const diff = score - displayScore;
    if (Math.abs(diff) > 0) {
      const step = diff > 0 ? Math.ceil(diff / 10) : Math.floor(diff / 10);
      const timer = setInterval(() => {
        setDisplayScore((prev) => {
          const newValue = prev + step;
          if (
            (step > 0 && newValue >= score) ||
            (step < 0 && newValue <= score)
          ) {
            clearInterval(timer);
            return score;
          }
          return newValue;
        });
      }, 30);
      return () => clearInterval(timer);
    }
  }, [score, displayScore, isMounted]);

  const comboMultiplier = combo > 1 ? `x${combo}` : "";

  return (
    <div className={styles.container}>
      <div className={styles.scoreSection}>
        <div className={styles.scoreLabel}>Score</div>
        <div className={styles.scoreValue}>
          {isMounted ? displayScore.toLocaleString() : "0"}
          {showGain && isMounted && (
            <span className={styles.scoreGain} key={gainValue}>
              +{gainValue}
            </span>
          )}
        </div>
      </div>

      {combo > 1 && (
        <div className={styles.comboSection}>
          <div className={styles.comboLabel}>Combo</div>
          <div className={styles.comboValue}>
            {comboMultiplier}
            <span className={styles.comboFire}>🔥</span>
          </div>
        </div>
      )}
    </div>
  );
}
