'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { usePokedex } from '@/hooks/usePokedex';
import { REGIONS } from '@/types/pokedex';
import { POKEMON_TYPES } from '@/types/progression';
import PokemonCard from '@/components/pokedex/PokemonCard';
import styles from './pokedex.module.css';

export default function PokedexPage() {
  const router = useRouter();
  const { filteredPokemon, isLoading, error, filters, setFilters, totalCount } = usePokedex();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={styles.pokedexContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button
            onClick={() => router.push('/home')}
            className={styles.backButton}
          >
            ← Accueil
          </button>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              <span className={styles.titleIcon}>📖</span>
              Pokédex
            </h1>
            <p className={styles.subtitle}>
              {totalCount} Pokémon disponibles
            </p>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Barre de recherche */}
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Rechercher un Pokémon par nom ou numéro..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className={styles.searchInput}
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ search: '' })}
                className={styles.clearButton}
                aria-label="Effacer la recherche"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={styles.filterToggle}
          >
            {showFilters ? '▼' : '▶'} Filtres
          </button>
        </div>

        {/* Filtres */}
        {showFilters && (
          <div className={styles.filtersSection}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Type</label>
              <select
                value={filters.type || ''}
                onChange={(e) => setFilters({ type: e.target.value || null })}
                className={styles.filterSelect}
              >
                <option value="">Tous les types</option>
                {POKEMON_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Région</label>
              <select
                value={filters.region || ''}
                onChange={(e) => setFilters({ region: e.target.value || null })}
                className={styles.filterSelect}
              >
                <option value="">Toutes les régions</option>
                {REGIONS.map(region => (
                  <option key={region.id} value={region.id}>
                    {region.name} ({region.limit} Pokémon)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setFilters({ type: null, region: null, generation: null })}
              className={styles.resetFilters}
            >
              Réinitialiser
            </button>
          </div>
        )}

        {/* Résultats */}
        <div className={styles.resultsSection}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
              <p>Chargement du Pokédex...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>Erreur : {error}</p>
            </div>
          ) : filteredPokemon.length === 0 ? (
            <div className={styles.noResults}>
              <p>Aucun Pokémon trouvé</p>
            </div>
          ) : (
            <>
              <div className={styles.resultsInfo}>
                <p>{filteredPokemon.length} Pokémon trouvé{filteredPokemon.length > 1 ? 's' : ''}</p>
              </div>
              <div className={styles.pokemonGrid}>
                {filteredPokemon.map((pokemon) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

