'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import { Pokemon, UsePokemonReturn } from '@/types';
import { PokemonType, POKEMON_TYPES } from '@/types/progression';
import { getAllPokemonList, getPokemonByIdOrName, translatePokemonNameSync, translateType, getPokemonImage } from '@/services/pokeapi';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

interface UsePokemonFilterReturn extends UsePokemonReturn {
  fetchByType: (type: PokemonType) => Promise<void>;
  fetchByLimit: (limit: number) => Promise<void>;
  selectedType: PokemonType | null;
  selectedLimit: number | null;
}

export function usePokemonFilter(initialLimit: number = 1302): UsePokemonFilterReturn {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<PokemonType | null>(null);
  const [selectedLimit, setSelectedLimit] = useState<number | null>(initialLimit);

  const fetchByLimit = useCallback(async (limit: number) => {
    setIsLoading(true);
    setError(null);
    setSelectedType(null);
    setSelectedLimit(limit);

    try {
      // Récupérer la liste des Pokémon (seulement les IDs)
      const pokemonList = await getAllPokemonList(limit, 0);
      
      // Sélectionner un Pokémon aléatoire
      const randomIndex = Math.floor(Math.random() * pokemonList.length);
      const selectedPokemon = pokemonList[randomIndex];
      
      // Récupérer les détails du Pokémon
      const pokemonData = await getPokemonByIdOrName(selectedPokemon.id);
      
      const firstType = pokemonData.types[0]?.type?.name || null;
      
      setPokemon({
        name: translatePokemonNameSync(pokemonData.name),
        imageUrl: pokemonData.sprites.other['official-artwork'].front_default || getPokemonImage(selectedPokemon.id),
        type: firstType ? translateType(firstType) : null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du Pokémon';
      setError(errorMessage);
      console.error('Erreur API Pokémon:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchByType = useCallback(async (type: PokemonType) => {
    setIsLoading(true);
    setError(null);
    setSelectedType(type);
    setSelectedLimit(null);

    try {
      // Convertir le type français en anglais pour l'API
      const typeMap: Record<string, string> = {
        'normal': 'normal',
        'feu': 'fire',
        'eau': 'water',
        'plante': 'grass',
        'électrik': 'electric',
        'glace': 'ice',
        'combat': 'fighting',
        'poison': 'poison',
        'sol': 'ground',
        'vol': 'flying',
        'psy': 'psychic',
        'insecte': 'bug',
        'roche': 'rock',
        'spectre': 'ghost',
        'dragon': 'dragon',
        'ténèbres': 'dark',
        'acier': 'steel',
        'fée': 'fairy',
      };
      
      const englishType = typeMap[type.toLowerCase()] || type.toLowerCase();
      
      // Récupérer les Pokémon de ce type depuis PokéAPI
      const typeResponse = await axios.get(`${POKEAPI_BASE_URL}/type/${englishType}`);
      const pokemonOfType = typeResponse.data.pokemon;
      
      if (!pokemonOfType || pokemonOfType.length === 0) {
        throw new Error(`Aucun Pokémon de type ${type} trouvé`);
      }

      // Sélectionner un Pokémon aléatoire
      const randomIndex = Math.floor(Math.random() * pokemonOfType.length);
      const selectedPokemonRef = pokemonOfType[randomIndex];
      
      // Extraire l'ID depuis l'URL
      const pokemonId = parseInt(selectedPokemonRef.pokemon.url.split('/').slice(-2, -1)[0]);
      
      // Récupérer les détails du Pokémon
      const pokemonData = await getPokemonByIdOrName(pokemonId);
      
      setPokemon({
        name: translatePokemonNameSync(pokemonData.name),
        imageUrl: pokemonData.sprites.other['official-artwork'].front_default || getPokemonImage(pokemonId),
        type: translateType(englishType),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du Pokémon';
      setError(errorMessage);
      console.error('Erreur API Pokémon:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPokemon = useCallback(() => {
    setPokemon(null);
    setError(null);
  }, []);

  return {
    pokemon,
    isLoading,
    error,
    fetchRandomPokemon: fetchByLimit,
    resetPokemon,
    fetchByType,
    fetchByLimit,
    selectedType,
    selectedLimit,
  };
}

