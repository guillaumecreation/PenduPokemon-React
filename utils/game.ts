/**
 * Utilitaires pour la logique du jeu
 */

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const INITIAL_LIVES = 7;

/**
 * Vérifie si le joueur a gagné
 */
export function checkWin(word: string, correctLetters: string[]): boolean {
  if (!word) return false;
  
  return word
    .split('')
    .every((letter) => correctLetters.includes(letter));
}

/**
 * Vérifie si le joueur a perdu
 */
export function checkLose(lives: number): boolean {
  return lives <= 0;
}

/**
 * Génère le mot masqué avec les lettres trouvées
 */
export function generateMaskedWord(word: string, correctLetters: string[]): string {
  if (!word) return '';

  return word
    .split('')
    .map((letter) => (correctLetters.includes(letter) ? letter : '_ '))
    .join('');
}

