'use client';

import { useReducer, useMemo, useCallback, useEffect } from 'react';
import { GameState, GameAction, UseGameReturn, Pokemon } from '@/types';

const INITIAL_LIVES = 7;

// Calcul du score pour une lettre correcte
function calculateLetterScore(combo: number, pokemonNameLength: number): number {
  const baseScore = 10;
  const lengthBonus = Math.floor(pokemonNameLength / 3) * 5;
  const comboMultiplier = combo > 1 ? combo : 1;
  return Math.floor((baseScore + lengthBonus) * comboMultiplier);
}

const initialState: GameState = {
  selectedPokemon: null,
  selectedPokemonName: null,
  correctLetters: [],
  incorrectLetters: [],
  lives: INITIAL_LIVES,
  usedLetters: [],
  gameStatus: 'idle',
  score: 0,
  totalScore: 0,
  combo: 0,
  lastScoreGain: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_POKEMON': {
      return {
        ...state,
        selectedPokemon: action.payload,
        selectedPokemonName: action.payload.name.toUpperCase(),
        gameStatus: 'playing',
        correctLetters: [],
        incorrectLetters: [],
        usedLetters: [],
        lives: INITIAL_LIVES,
        score: 0, // Score de la partie actuelle réinitialisé
        combo: 0,
        lastScoreGain: 0,
        // totalScore reste inchangé
      };
    }

    case 'SELECT_LETTER': {
      // Ne pas traiter si le jeu n'est pas en cours
      if (state.gameStatus !== 'playing') {
        return state;
      }

      const letter = action.payload.toUpperCase();
      
      // Ne pas traiter si la lettre est déjà utilisée
      if (state.usedLetters.includes(letter)) {
        return state;
      }

      const newUsedLetters = [...state.usedLetters, letter];
      const pokemonName = state.selectedPokemonName || '';

      if (pokemonName.includes(letter)) {
        // Lettre correcte - calculer le score
        const newCombo = state.combo + 1;
        const scoreGain = calculateLetterScore(newCombo, pokemonName.length);
        const newScore = state.score + scoreGain;
        
        return {
          ...state,
          correctLetters: state.correctLetters.includes(letter)
            ? state.correctLetters
            : [...state.correctLetters, letter],
          usedLetters: newUsedLetters,
          combo: newCombo,
          score: newScore,
          totalScore: state.totalScore + scoreGain, // Ajouter au score total
          lastScoreGain: scoreGain,
        };
      } else {
        // Lettre incorrecte - reset combo
        return {
          ...state,
          incorrectLetters: state.incorrectLetters.includes(letter)
            ? state.incorrectLetters
            : [...state.incorrectLetters, letter],
          usedLetters: newUsedLetters,
          lives: state.lives - 1,
          combo: 0,
          lastScoreGain: 0,
        };
      }
    }

    case 'RESET_GAME': {
      return initialState;
    }

    case 'NEXT_POKEMON': {
      // Garder le score total, réinitialiser seulement le jeu
      return {
        ...state,
        selectedPokemon: null,
        selectedPokemonName: null,
        gameStatus: 'idle',
        correctLetters: [],
        incorrectLetters: [],
        usedLetters: [],
        lives: INITIAL_LIVES,
        score: 0, // Score de la partie réinitialisé
        combo: 0,
        lastScoreGain: 0,
        // totalScore reste inchangé
      };
    }

    case 'SET_GAME_STATUS': {
      return {
        ...state,
        gameStatus: action.payload,
      };
    }

    case 'ADD_SCORE': {
      return {
        ...state,
        score: state.score + action.payload,
        totalScore: state.totalScore + action.payload, // Ajouter au score total aussi
        lastScoreGain: action.payload,
      };
    }

    default:
      return state;
  }
}

export function useGame(): UseGameReturn {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const selectPokemon = useCallback((pokemon: Pokemon) => {
    dispatch({ type: 'SELECT_POKEMON', payload: pokemon });
  }, []);

  const selectLetter = useCallback((letter: string) => {
    dispatch({ type: 'SELECT_LETTER', payload: letter });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const nextPokemon = useCallback(() => {
    dispatch({ type: 'NEXT_POKEMON' });
  }, []);

  // Calcul du mot masqué - version simple et fonctionnelle
  const maskedWord = useMemo(() => {
    if (!gameState.selectedPokemonName) return '';

    const pokemonName = gameState.selectedPokemonName;
    let result = '';
    
    for (let i = 0; i < pokemonName.length; i++) {
      const letter = pokemonName[i];
      
      // Si c'est un espace ou un tiret, le garder tel quel
      if (letter === ' ' || letter === '-') {
        result += letter + ' ';
      } 
      // Si la lettre est dans les lettres correctes, l'afficher
      else if (gameState.correctLetters.includes(letter)) {
        result += letter + ' ';
      } 
      // Sinon, afficher un underscore
      else {
        result += '_ ';
      }
    }
    
    return result.trim();
  }, [gameState.selectedPokemonName, gameState.correctLetters]);

  // Vérification de la victoire
  useEffect(() => {
    if (
      gameState.gameStatus === 'playing' &&
      gameState.selectedPokemonName &&
      gameState.selectedPokemonName
        .split('')
        .filter((letter) => letter !== ' ' && letter !== '-')
        .every((letter) => gameState.correctLetters.includes(letter))
    ) {
      dispatch({ type: 'SET_GAME_STATUS', payload: 'won' });
    }
  }, [gameState.correctLetters, gameState.selectedPokemonName, gameState.gameStatus]);

  // Vérification de la défaite
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.lives <= 0) {
      dispatch({ type: 'SET_GAME_STATUS', payload: 'lost' });
    }
  }, [gameState.lives, gameState.gameStatus]);

  const isGameActive = gameState.gameStatus === 'playing';

  // Bonus de score pour la victoire
  useEffect(() => {
    if (gameState.gameStatus === 'won' && gameState.selectedPokemonName) {
      const winBonus = Math.floor(gameState.lives * 50 + gameState.combo * 20);
      if (winBonus > 0) {
        dispatch({ 
          type: 'ADD_SCORE', 
          payload: winBonus 
        } as any);
      }
    }
  }, [gameState.gameStatus, gameState.lives, gameState.combo, gameState.selectedPokemonName]);

  return {
    gameState,
    selectLetter,
    selectPokemon,
    resetGame,
    nextPokemon,
    maskedWord,
    isGameActive,
    score: gameState.score,
    totalScore: gameState.totalScore,
    combo: gameState.combo,
  };
}

