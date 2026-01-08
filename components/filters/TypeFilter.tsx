'use client';

import { POKEMON_TYPES, PokemonType } from '@/types/progression';
import styles from './TypeFilter.module.css';

interface TypeFilterProps {
  selectedType: PokemonType | null;
  onTypeSelect: (type: PokemonType | null) => void;
  disabled?: boolean;
}

const TYPE_COLORS: Record<PokemonType, string> = {
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

const TYPE_NAMES: Record<PokemonType, string> = {
  normal: 'Normal',
  feu: 'Feu',
  eau: 'Eau',
  plante: 'Plante',
  électrik: 'Électrik',
  glace: 'Glace',
  combat: 'Combat',
  poison: 'Poison',
  sol: 'Sol',
  vol: 'Vol',
  psy: 'Psy',
  insecte: 'Insecte',
  roche: 'Roche',
  spectre: 'Spectre',
  dragon: 'Dragon',
  ténèbres: 'Ténèbres',
  acier: 'Acier',
  fée: 'Fée',
};

export default function TypeFilter({ selectedType, onTypeSelect, disabled = false }: TypeFilterProps) {
  return (
    <div className={styles.container}>
      <div className={styles.typesGrid}>
        <button
          className={`${styles.typeButton} ${selectedType === null ? styles.selected : ''}`}
          onClick={() => onTypeSelect(null)}
          disabled={disabled}
          style={{ background: selectedType === null ? '#667eea' : 'rgba(255, 255, 255, 0.2)' }}
        >
          Tous
        </button>
        {POKEMON_TYPES.map((type) => (
          <button
            key={type}
            className={`${styles.typeButton} ${selectedType === type ? styles.selected : ''}`}
            onClick={() => onTypeSelect(type)}
            disabled={disabled}
            style={{
              background: selectedType === type ? TYPE_COLORS[type] : `rgba(255, 255, 255, 0.15)`,
              borderColor: TYPE_COLORS[type],
            }}
            title={TYPE_NAMES[type]}
          >
            {TYPE_NAMES[type]}
          </button>
        ))}
      </div>
    </div>
  );
}

