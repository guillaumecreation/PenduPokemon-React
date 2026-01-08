'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { PokemonDetail } from '@/types/pokedex';
import styles from './PokemonDetailModal.module.css';

interface PokemonDetailModalProps {
  pokemon: PokemonDetail;
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  feu: '#F08030',
  eau: '#6890F0',
  plante: '#78C850',
  électrik: '#F8D030',
  glace: '#98D8D8',
  combat: '#C03028',
  poison: '#A040A0',
  sol: '#E0C068',
  vol: '#A890F0',
  psy: '#F85888',
  insecte: '#A8B820',
  roche: '#B8A038',
  spectre: '#705898',
  dragon: '#7038F8',
  ténèbres: '#705848',
  acier: '#B8B8D0',
  fée: '#EE99AC',
};

export default function PokemonDetailModal({ pokemon, isOpen, onClose }: PokemonDetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getTypeColor = (typeName: string) => {
    const normalized = typeName.toLowerCase();
    return TYPE_COLORS[normalized] || '#94a3b8';
  };

  const totalStats = Object.values(pokemon.stats).reduce((sum, stat) => sum + stat, 0);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Fermer">
          ✕
        </button>

        <div className={styles.modalContent}>
          {/* Header avec image */}
          <div className={styles.modalHeader}>
            <div className={styles.pokemonImageLarge}>
              <Image
                src={pokemon.image || pokemon.sprite}
                alt={pokemon.name}
                width={300}
                height={300}
                className={styles.pokemonImage}
                unoptimized
              />
            </div>
            <div className={styles.pokemonHeaderInfo}>
              <div className={styles.pokemonNumber}>#{String(pokemon.pokedexId).padStart(3, '0')}</div>
              <h2 className={styles.pokemonName}>{pokemon.name}</h2>
              <div className={styles.typesContainer}>
                {pokemon.apiTypes.map((type, index) => (
                  <span
                    key={index}
                    className={styles.typeBadge}
                    style={{ backgroundColor: getTypeColor(type.name) }}
                  >
                    {type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className={styles.statsSection}>
            <h3 className={styles.sectionTitle}>Statistiques</h3>
            <div className={styles.statsGrid}>
              {Object.entries(pokemon.stats).map(([statName, value]) => {
                const maxStat = 255;
                const percentage = (value / maxStat) * 100;
                return (
                  <div key={statName} className={styles.statItem}>
                    <div className={styles.statHeader}>
                      <span className={styles.statName}>{statName}</span>
                      <span className={styles.statValue}>{value}</span>
                    </div>
                    <div className={styles.statBar}>
                      <div
                        className={styles.statFill}
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: percentage > 70 ? '#4ade80' : percentage > 40 ? '#fbbf24' : '#f87171',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className={styles.totalStats}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>{totalStats}</span>
              </div>
            </div>
          </div>

          {/* Résistances */}
          {pokemon.apiResistances && pokemon.apiResistances.length > 0 && (
            <div className={styles.resistancesSection}>
              <h3 className={styles.sectionTitle}>Résistances et Faiblesses</h3>
              <div className={styles.resistancesGrid}>
                {pokemon.apiResistances.map((resistance, index) => (
                  <div key={index} className={styles.resistanceItem}>
                    <span className={styles.resistanceType}>{resistance.name}</span>
                    <span
                      className={styles.resistanceValue}
                      style={{
                        color: resistance.damage_multiplier < 1 ? '#4ade80' : resistance.damage_multiplier > 1 ? '#f87171' : '#ffffff',
                      }}
                    >
                      {resistance.damage_multiplier === 0 ? '0x' : `${resistance.damage_multiplier}x`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Évolutions */}
          {pokemon.apiEvolutions && pokemon.apiEvolutions.length > 0 && (
            <div className={styles.evolutionsSection}>
              <h3 className={styles.sectionTitle}>Évolutions</h3>
              <div className={styles.evolutionsList}>
                {pokemon.apiEvolutions.map((evolution, index) => (
                  <div key={index} className={styles.evolutionItem}>
                    <span className={styles.evolutionArrow}>→</span>
                    <span className={styles.evolutionName}>{evolution.name}</span>
                    <span className={styles.evolutionNumber}>#{evolution.pokedexId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pré-évolution */}
          {pokemon.apiPreEvolution && (
            <div className={styles.preEvolutionSection}>
              <h3 className={styles.sectionTitle}>Pré-évolution</h3>
              <div className={styles.preEvolutionItem}>
                <span className={styles.evolutionArrow}>←</span>
                <span className={styles.evolutionName}>{pokemon.apiPreEvolution.name}</span>
                <span className={styles.evolutionNumber}>#{pokemon.apiPreEvolution.pokedexId}</span>
              </div>
            </div>
          )}

          {/* Génération */}
          <div className={styles.generationSection}>
            <span className={styles.generationLabel}>Génération</span>
            <span className={styles.generationValue}>{pokemon.apiGeneration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}





