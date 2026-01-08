'use client';

import { useRouter } from 'next/navigation';
import { useProgression } from '@/hooks/useProgression';
import LevelDisplay from '@/components/progression/LevelDisplay';
import Image from 'next/image';
import styles from './stats.module.css';

export default function StatsPage() {
  const router = useRouter();
  const { stats, resetStats } = useProgression();

  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.title}>
          <h1 data-text="Statistiques">Statistiques</h1>
          <Image
            src="/img/pokemon.png"
            alt="Pokémon"
            width={100}
            height={100}
            className={styles.logo}
            priority
          />
        </div>
        <button
          onClick={() => router.push("/home")}
          className={styles.backButton}
        >
          ← Retour à l'accueil
        </button>
      </header>

      <main className={styles.main}>
        <LevelDisplay />

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Parties jouées</h3>
            <p className={styles.statValue}>{stats.gamesPlayed}</p>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Victoires</h3>
            <p className={styles.statValue}>{stats.gamesWon}</p>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Défaites</h3>
            <p className={styles.statValue}>{stats.gamesLost}</p>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Taux de victoire</h3>
            <p className={styles.statValue}>{winRate}%</p>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Série actuelle</h3>
            <p className={styles.statValue}>{stats.winStreak} 🔥</p>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Meilleure série</h3>
            <p className={styles.statValue}>{stats.bestWinStreak} 🔥</p>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Pokémon trouvés</h3>
            <p className={styles.statValue}>{stats.pokemonFound.size}</p>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Types complétés</h3>
            <p className={styles.statValue}>{stats.typesCompleted.size}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            onClick={resetStats} 
            className={styles.resetButton}
          >
            Réinitialiser les statistiques
          </button>
        </div>
      </main>
    </div>
  );
}

