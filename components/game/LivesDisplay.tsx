'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './LivesDisplay.module.css';

interface LivesDisplayProps {
  lives: number;
  totalLives: number;
}

export default function LivesDisplay({ lives, totalLives }: LivesDisplayProps) {
  const [lostLifeIndex, setLostLifeIndex] = useState<number | null>(null);
  const [prevLives, setPrevLives] = useState(lives);

  useEffect(() => {
    if (prevLives > lives) {
      // Une vie a été perdue
      const lostIndex = lives;
      setLostLifeIndex(lostIndex);
      setTimeout(() => setLostLifeIndex(null), 1000);
    }
    setPrevLives(lives);
  }, [lives, prevLives]);

  return (
    <div className={styles.container} aria-label={`${lives} vies restantes sur ${totalLives}`}>
      <div className={styles.livesTitle}>Vies</div>
      <div className={styles.livesGrid}>
        {Array.from({ length: totalLives }).map((_, index) => {
          const isActive = index < lives;
          const isLosing = lostLifeIndex === index;
          
          return (
            <div
              key={index}
              className={`${styles.lifeIcon} ${isActive ? styles.active : styles.inactive} ${isLosing ? styles.losing : ''}`}
              aria-hidden="true"
            >
              <div className={styles.lifeWrapper}>
                <Image
                  src="/img/pika.png"
                  alt=""
                  width={40}
                  height={40}
                  className={styles.lifeImage}
                />
                {isLosing && (
                  <>
                    <div className={styles.particles}>
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className={styles.particle} />
                      ))}
                    </div>
                    <div className={styles.lifeLost}>💔</div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

