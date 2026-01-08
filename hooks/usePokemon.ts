'use client';

import { useState, useCallback } from 'react';
import { Pokemon, UsePokemonReturn } from '@/types';
import { getAllPokemonList, getPokemonByIdOrName, translatePokemonNameSync, getPokemonImage } from '@/services/pokeapi';

export function usePokemon(limit: number = 1302): UsePokemonReturn {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomPokemon = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Récupérer la liste des Pokémon (seulement les IDs)
      const pokemonList = await getAllPokemonList(limit, 0);
      
      // Sélectionner un Pokémon aléatoire
      const randomIndex = Math.floor(Math.random() * pokemonList.length);
      const selectedPokemon = pokemonList[randomIndex];
      
      // Récupérer les détails du Pokémon
      const pokemonData = await getPokemonByIdOrName(selectedPokemon.id);
      
      setPokemon({
        name: translatePokemonNameSync(pokemonData.name),
        imageUrl: pokemonData.sprites.other['official-artwork'].front_default || getPokemonImage(selectedPokemon.id),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du Pokémon';
      setError(errorMessage);
      console.error('Erreur API Pokémon:', err);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  const resetPokemon = useCallback(() => {
    setPokemon(null);
    setError(null);
  }, []);

  return {
    pokemon,
    isLoading,
    error,
    fetchRandomPokemon,
    resetPokemon,
  };
}

