'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PokemonDetail, PokedexFilters } from '@/types/pokedex';
import { getAllPokemonList, getPokemonByIdOrName, convertToPokemonDetail, translatePokemonNameSync, getPokemonImage, getPokemonSprite } from '@/services/pokeapi';

interface UsePokedexReturn {
  pokemonList: PokemonDetail[];
  isLoading: boolean;
  error: string | null;
  filters: PokedexFilters;
  setFilters: (filters: Partial<PokedexFilters>) => void;
  filteredPokemon: PokemonDetail[];
  totalCount: number;
  fetchPokemon: () => Promise<void>;
}

export function usePokedex(): UsePokedexReturn {
  const [pokemonList, setPokemonList] = useState<PokemonDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<PokedexFilters>({
    search: '',
    type: null,
    generation: null,
    region: null,
  });

  const fetchPokemon = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Récupérer seulement la liste des IDs et noms (plus rapide)
      const pokemonListBasic = await getAllPokemonList(1302, 0);
      
      // Convertir en format minimal pour l'affichage dans la liste
      // Charger les détails par batch pour optimiser les performances
      const batchSize = 50;
      const pokemonData: PokemonDetail[] = [];
      
      for (let i = 0; i < pokemonListBasic.length; i += batchSize) {
        const batch = pokemonListBasic.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (pokemon) => {
            try {
              const pokemonFull = await getPokemonByIdOrName(pokemon.id);
              return await convertToPokemonDetail(pokemonFull);
            } catch (error) {
              // En cas d'erreur, créer un Pokémon minimal
              return {
                id: pokemon.id,
                pokedexId: pokemon.id,
                name: translatePokemonNameSync(pokemon.name),
                slug: pokemon.name,
                image: getPokemonImage(pokemon.id),
                sprite: getPokemonSprite(pokemon.id),
                stats: { HP: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
                apiTypes: [],
                apiGeneration: 1,
                apiResistances: [],
                apiEvolutions: [],
                apiPreEvolution: null,
              };
            }
          })
        );
        pokemonData.push(...batchResults);
        
        // Petit délai entre les batches pour respecter l'API
        if (i + batchSize < pokemonListBasic.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      setPokemonList(pokemonData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du Pokédex';
      setError(errorMessage);
      console.error('Erreur API Pokédex:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pokemonList.length === 0 && !isLoading) {
      fetchPokemon();
    }
  }, []);

  const setFilters = useCallback((newFilters: Partial<PokedexFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const filteredPokemon = useMemo(() => {
    let filtered = [...pokemonList];

    // Filtre par recherche (nom ou numéro)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.slug.toLowerCase().includes(searchLower) ||
        p.pokedexId.toString().includes(searchLower)
      );
    }

    // Filtre par type
    if (filters.type) {
      filtered = filtered.filter(p => 
        p.apiTypes.some(t => t.name.toLowerCase() === filters.type?.toLowerCase())
      );
    }

    // Filtre par génération
    if (filters.generation) {
      filtered = filtered.filter(p => p.apiGeneration === filters.generation);
    }

    // Filtre par région (basé sur la génération)
    if (filters.region) {
      const regionMap: Record<string, number> = {
        kanto: 1,
        johto: 2,
        hoenn: 3,
        sinnoh: 4,
        unova: 5,
        kalos: 6,
        alola: 7,
        galar: 8,
      };
      const gen = regionMap[filters.region];
      if (gen) {
        filtered = filtered.filter(p => p.apiGeneration === gen);
      }
    }

    return filtered.sort((a, b) => a.pokedexId - b.pokedexId);
  }, [pokemonList, filters]);

  return {
    pokemonList,
    isLoading,
    error,
    filters,
    setFilters,
    filteredPokemon,
    totalCount: pokemonList.length,
  };
}

