'use client';

import Image from 'next/image';
import styles from './ChangePokemonButton.module.css';

interface ChangePokemonButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

// Image Pokémon représentative pour le changement (Rotom - forme normale)
const CHANGE_POKEMON_IMAGE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/479.png';

export default function ChangePokemonButton({ onClick, disabled = false }: ChangePokemonButtonProps) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
      aria-label="Changer de Pokémon"
    >
      <div className={styles.icon}>
        <Image
          src={CHANGE_POKEMON_IMAGE}
          alt="Changer"
          width={24}
          height={24}
          className={styles.iconImage}
        />
      </div>
      <span className={styles.text}>Changer de Pokémon</span>
    </button>
  );
}

