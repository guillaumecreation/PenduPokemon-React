/**
 * Types pour l'application Pendu Pokémon
 */

export interface Pokemon {
  name: string;
  imageUrl: string;
  type?: string | null;
  apiTypes?: Array<{ name: string }>;
}

export interface GameState {
  selectedPokemon: Pokemon | null;
  selectedPokemonName: string | null;
  correctLetters: string[];
  incorrectLetters: string[];
  lives: number;
  usedLetters: string[];
  gameStatus: 'idle' | 'playing' | 'won' | 'lost';
  score: number; // Score de la partie actuelle
  totalScore: number; // Score total cumulé
  combo: number;
  lastScoreGain: number;
}

export type GameAction =
  | { type: 'SELECT_POKEMON'; payload: Pokemon }
  | { type: 'SELECT_LETTER'; payload: string }
  | { type: 'RESET_GAME' }
  | { type: 'NEXT_POKEMON' }
  | { type: 'SET_GAME_STATUS'; payload: GameState['gameStatus'] }
  | { type: 'ADD_SCORE'; payload: number };

export interface UseGameReturn {
  gameState: GameState;
  selectLetter: (letter: string) => void;
  selectPokemon: (pokemon: Pokemon) => void;
  resetGame: () => void;
  nextPokemon: () => void;
  maskedWord: string;
  isGameActive: boolean;
  score: number;
  totalScore: number;
  combo: number;
}

export interface UsePokemonReturn {
  pokemon: Pokemon | null;
  isLoading: boolean;
  error: string | null;
  fetchRandomPokemon: () => Promise<void>;
  resetPokemon: () => void;
}

