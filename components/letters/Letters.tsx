'use client';

import { useEffect } from 'react';
import { ALPHABET } from '@/utils/game';
import styles from './Letters.module.css';

interface LettersProps {
  onLetterSelected: (letter: string) => void;
  usedLetters: string[];
  incorrectLetters: string[];
  disabled?: boolean;
}

export default function Letters({ 
  onLetterSelected, 
  usedLetters, 
  incorrectLetters,
  disabled = false 
}: LettersProps) {
  // Gestion du clavier physique - version simple
  useEffect(() => {
    if (disabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      const letter = event.key.toUpperCase();
      
      // Vérifier que c'est une lettre valide
      if (!ALPHABET.includes(letter)) return;
      
      // Vérifier que la lettre n'est pas déjà utilisée
      if (usedLetters.includes(letter)) return;
      
      // Appeler la fonction
      onLetterSelected(letter);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [disabled, usedLetters, onLetterSelected]);

  const handleClick = (letter: string) => {
    if (!disabled && !usedLetters.includes(letter)) {
      onLetterSelected(letter);
    }
  };

  return (
    <div className={styles.letters}>
      {ALPHABET.map((letter) => {
        const isUsed = usedLetters.includes(letter);
        const isIncorrect = incorrectLetters.includes(letter);
        
        // Construire les classes CSS
        const classNames = [
          styles.letterKey,
          isUsed ? styles.usedLetter : '',
          isIncorrect ? styles.incorrectLetter : ''
        ].filter(Boolean).join(' ');
        
        return (
          <button
            key={letter}
            className={classNames}
            onClick={() => handleClick(letter)}
            disabled={isUsed || disabled}
            style={isIncorrect ? {
              background: 'rgba(255, 107, 107, 0.9)',
              color: '#fff',
              borderColor: 'rgba(255, 107, 107, 0.8)'
            } : undefined}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}

