'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import TypeFilter from '@/components/filters/TypeFilter';
import { PokemonType } from '@/types/progression';
import styles from './home.module.css';

// Images représentatives pour chaque région (starters de chaque génération)
const REGION_IMAGES = {
  all: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', // Pikachu
  kanto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png', // Bulbasaur
  johto: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png', // Chikorita
  hoenn: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/252.png', // Treecko
  sinnoh: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/387.png', // Turtwig
  unova: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/495.png', // Snivy
};

// Images représentatives pour les icônes de section
const SECTION_IMAGES = {
  type: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', // Charizard (feu/vol)
  region: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png', // Dragonite
  stats: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png', // Snorlax
  pokedex: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', // Pikachu
  game: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png', // Dragonite
};

const GAME_MODES = [
  { id: 'all', name: 'Tous les Pokémon', limit: 1302, description: 'Jouez avec tous les Pokémon disponibles', imageUrl: REGION_IMAGES.all },
  { id: 'kanto', name: 'Kanto', limit: 151, description: '1ère génération - Les 151 premiers Pokémon', imageUrl: REGION_IMAGES.kanto },
  { id: 'johto', name: 'Johto', limit: 251, description: '2ème génération - Les 251 premiers Pokémon', imageUrl: REGION_IMAGES.johto },
  { id: 'hoenn', name: 'Hoenn', limit: 386, description: '3ème génération - Les 386 premiers Pokémon', imageUrl: REGION_IMAGES.hoenn },
  { id: 'sinnoh', name: 'Sinnoh', limit: 493, description: '4ème génération - Les 493 premiers Pokémon', imageUrl: REGION_IMAGES.sinnoh },
  { id: 'unova', name: 'Unova', limit: 649, description: '5ème génération - Les 649 premiers Pokémon', imageUrl: REGION_IMAGES.unova },
];

export default function HomePage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<PokemonType | null>(null);
  const [selectedView, setSelectedView] = useState<'pokedex' | 'game' | null>(null);

  const handleStartGame = (limit: number, type: PokemonType | null = null) => {
    if (type) {
      router.push(`/game?type=${type}`);
    } else {
      router.push(`/game?limit=${limit}`);
    }
  };

  const handleTypeSelect = (type: PokemonType | null) => {
    setSelectedType(type);
    if (type) {
      handleStartGame(1302, type);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.titleWrapper}>
            <Image
              src="/img/pokemon.png"
              alt="Pokémon"
              width={120}
              height={120}
              className={styles.logo}
              priority
            />
            <div className={styles.titleContent}>
              <h1 className={styles.mainTitle}>
                <span className={styles.titleWord}>Pendu</span>
                <span className={styles.titleWord}>Pokémon</span>
              </h1>
              <p className={styles.tagline}>Devinez le nom du Pokémon avant de perdre toutes vos vies !</p>
            </div>
          </div>
        </div>
        <Link href="/stats" className={styles.statsLink}>
          <Image
            src={SECTION_IMAGES.stats}
            alt="Statistiques"
            width={24}
            height={24}
            className={styles.statsIcon}
          />
          <span>Statistiques</span>
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          {/* Section Choix initial */}
          {!selectedView && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>🎮</span>
                  Choisissez votre mode
                </h2>
                <p className={styles.sectionDescription}>
                  Explorez le Pokédex ou lancez-vous dans une partie
                </p>
              </div>
              <div className={styles.sectionContent}>
                <div className={styles.choiceGrid}>
                  <button
                    className={styles.choiceCard}
                    onClick={() => router.push('/pokedex')}
                  >
                    <div className={styles.choiceIcon}>
                      <Image
                        src={SECTION_IMAGES.pokedex}
                        alt="Pokédex"
                        width={100}
                        height={100}
                        className={styles.choiceImage}
                      />
                    </div>
                    <div className={styles.choiceContent}>
                      <h3 className={styles.choiceName}>Pokédex</h3>
                      <p className={styles.choiceDescription}>
                        Explorez tous les Pokémon disponibles et leurs informations
                      </p>
                    </div>
                  </button>
                  <button
                    className={styles.choiceCard}
                    onClick={() => setSelectedView('game')}
                  >
                    <div className={styles.choiceIcon}>
                      <Image
                        src={SECTION_IMAGES.game}
                        alt="Jeu"
                        width={100}
                        height={100}
                        className={styles.choiceImage}
                      />
                    </div>
                    <div className={styles.choiceContent}>
                      <h3 className={styles.choiceName}>Jouer</h3>
                      <p className={styles.choiceDescription}>
                        Lancez une partie et devinez le nom du Pokémon
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Section Filtre par Type - Affichée seulement si "game" est sélectionné */}
          {selectedView === 'game' && (
            <>
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <Image
                      src={SECTION_IMAGES.type}
                      alt="Type"
                      width={40}
                      height={40}
                      className={styles.sectionIcon}
                    />
                    Filtrer par Type
                  </h2>
                  <p className={styles.sectionDescription}>
                    Choisissez un type de Pokémon spécifique pour un défi ciblé
                  </p>
                </div>
                <div className={styles.sectionContent}>
                  <TypeFilter 
                    selectedType={selectedType} 
                    onTypeSelect={handleTypeSelect}
                  />
                </div>
              </section>

              {/* Section Modes de Jeu par Région - Affichée seulement si "game" est sélectionné */}
              <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Image
                  src={SECTION_IMAGES.region}
                  alt="Région"
                  width={40}
                  height={40}
                  className={styles.sectionIcon}
                />
                Modes de Jeu par Région
              </h2>
              <p className={styles.sectionDescription}>
                Sélectionnez une région pour jouer avec les Pokémon de cette génération
              </p>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.modesGrid}>
                {GAME_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    className={`${styles.modeCard} ${selectedMode === mode.id ? styles.selected : ''}`}
                    onClick={() => {
                      setSelectedMode(mode.id);
                      setSelectedType(null);
                      handleStartGame(mode.limit);
                    }}
                  >
                    <div className={styles.modeIcon}>
                      <Image
                        src={mode.imageUrl}
                        alt={mode.name}
                        width={80}
                        height={80}
                        className={styles.modeImage}
                      />
                    </div>
                    <div className={styles.modeContent}>
                      <h3 className={styles.modeName}>{mode.name}</h3>
                      <p className={styles.modeDescription}>{mode.description}</p>
                      <div className={styles.modeFooter}>
                        <span className={styles.modeLimit}>{mode.limit} Pokémon</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
              </section>
            </>
          )}

          {/* Section Pokédex - Affichée seulement si "pokedex" est sélectionné */}
          {selectedView === 'pokedex' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Image
                    src={SECTION_IMAGES.pokedex}
                    alt="Pokédex"
                    width={40}
                    height={40}
                    className={styles.sectionIcon}
                  />
                  Pokédex
                </h2>
                <p className={styles.sectionDescription}>
                  Explorez tous les Pokémon avec leurs statistiques détaillées
                </p>
              </div>
              <div className={styles.sectionContent}>
                <button
                  className={styles.pokedexButton}
                  onClick={() => router.push('/pokedex')}
                >
                  Ouvrir le Pokédex
                </button>
                <button
                  className={styles.backToChoiceButton}
                  onClick={() => setSelectedView(null)}
                >
                  ← Retour au choix
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

