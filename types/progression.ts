/**
 * Types pour le système de progression et niveaux
 */

export interface LevelTier {
  level: number;
  name: string;
  xpRequired: number;
  rewards?: string[];
  color: string;
}

export interface UserStats {
  level: number;
  currentXP: number;
  totalXP: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  winStreak: number;
  bestWinStreak: number;
  pokemonFound: Set<string>;
  typesCompleted: Set<string>;
}

export interface GameResult {
  won: boolean;
  pokemonName: string;
  pokemonType?: string;
  xpGained: number;
  livesRemaining: number;
  timestamp: number;
}

export const LEVEL_TIERS: LevelTier[] = [
  { level: 1, name: 'Débutant', xpRequired: 0, color: '#94a3b8' },
  { level: 2, name: 'Apprenti', xpRequired: 100, color: '#60a5fa' },
  { level: 3, name: 'Dresseur', xpRequired: 300, color: '#34d399' },
  { level: 4, name: 'Expert', xpRequired: 600, color: '#fbbf24' },
  { level: 5, name: 'Maître', xpRequired: 1000, color: '#f87171' },
  { level: 6, name: 'Légende', xpRequired: 1500, color: '#a78bfa' },
  { level: 7, name: 'Champion', xpRequired: 2200, color: '#ec4899' },
  { level: 8, name: 'Élite', xpRequired: 3000, color: '#06b6d4' },
  { level: 9, name: 'Mythique', xpRequired: 4000, color: '#f59e0b' },
  { level: 10, name: 'Immortel', xpRequired: 5000, color: '#ef4444' },
];

export const POKEMON_TYPES = [
  'normal', 'feu', 'eau', 'plante', 'électrik', 'glace', 'combat',
  'poison', 'sol', 'vol', 'psy', 'insecte', 'roche', 'spectre',
  'dragon', 'ténèbres', 'acier', 'fée'
] as const;

export type PokemonType = typeof POKEMON_TYPES[number];

