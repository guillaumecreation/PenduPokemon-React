'use client';

import { useProgression } from '@/hooks/useProgression';
import styles from './GameModal.module.css';

interface GameModalProps {
  isOpen: boolean;
  type: 'won' | 'lost';
  pokemonName: string | null;
  xpGained?: number;
  score?: number;
  totalScore?: number;
  combo?: number;
  onClose: () => void;
  onRestart: () => void;
  onNext: () => void;
}

export default function GameModal({ isOpen, type, pokemonName, xpGained, score = 0, totalScore = 0, combo = 0, onClose, onRestart, onNext }: GameModalProps) {
  const { currentTier, nextTier, progressToNextLevel } = useProgression();
  
  if (!isOpen) return null;

  const handleRestart = () => {
    onRestart();
    onClose();
  };

  const handleNext = () => {
    onNext();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          {type === 'won' ? (
            <>
              <h2 className={styles.title}>🎉 Victoire !</h2>
              <p className={styles.message}>Vous avez trouvé le Pokémon !</p>
              
              <div className={styles.scoreSection}>
                <div className={styles.finalScore}>
                  <span className={styles.scoreLabel}>Score de la partie</span>
                  <span className={styles.scoreValue}>{score.toLocaleString()}</span>
                </div>
                {totalScore > 0 && (
                  <div className={styles.totalScore}>
                    <span className={styles.totalScoreLabel}>Score total</span>
                    <span className={styles.totalScoreValue}>{totalScore.toLocaleString()}</span>
                  </div>
                )}
                {combo > 1 && (
                  <div className={styles.comboBadge}>
                    Combo max: x{combo} 🔥
                  </div>
                )}
              </div>
              
              {xpGained !== undefined && (
                <div className={styles.xpGained}>
                  <span className={styles.xpLabel}>XP gagné :</span>
                  <span className={styles.xpValue}>+{xpGained}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className={styles.title}>😢 Défaite</h2>
              <p className={styles.message}>
                Le Pokémon était : <strong>{pokemonName}</strong>
              </p>
              {xpGained !== undefined && xpGained > 0 && (
                <div className={styles.xpGained}>
                  <span className={styles.xpLabel}>XP gagné :</span>
                  <span className={styles.xpValue}>+{xpGained}</span>
                </div>
              )}
            </>
          )}
          
          {nextTier && (
            <div className={styles.levelProgress}>
              <div className={styles.levelInfo}>
                <span className={styles.currentLevel}>{currentTier.name}</span>
                <span className={styles.nextLevel}>→ {nextTier.name}</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${progressToNextLevel}%` }}
                />
              </div>
              <span className={styles.progressText}>{Math.round(progressToNextLevel)}%</span>
            </div>
          )}
          
          <div className={styles.actions}>
            <button onClick={handleNext} className={styles.nextButton}>
              Pokémon suivant →
            </button>
            <button onClick={handleRestart} className={styles.restartButton}>
              Nouvelle partie
            </button>
            <button onClick={onClose} className={styles.closeButton}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

