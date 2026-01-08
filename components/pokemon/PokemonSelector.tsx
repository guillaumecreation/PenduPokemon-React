"use client";

import { useRef, useEffect } from "react";
import { usePokemonFilter } from "@/hooks/usePokemonFilter";
import { PokemonType } from "@/types/progression";
import { Pokemon } from "@/types";
import styles from "./PokemonSelector.module.css";

interface PokemonSelectorProps {
  onPokemonSelected: (pokemon: Pokemon) => void;
  disabled?: boolean;
  limit?: number;
  type?: PokemonType | null;
  shouldFetchNew?: boolean;
  onPokemonFetched?: () => void;
}

export default function PokemonSelector({
  onPokemonSelected,
  disabled = false,
  limit = 1302,
  type = null,
  shouldFetchNew = false,
  onPokemonFetched,
}: PokemonSelectorProps) {
  const { pokemon, isLoading, error, fetchByLimit, fetchByType, resetPokemon } =
    usePokemonFilter(limit);
  const hasSelectedRef = useRef(false);
  const onPokemonSelectedRef = useRef(onPokemonSelected);

  // Mettre à jour la ref
  useEffect(() => {
    onPokemonSelectedRef.current = onPokemonSelected;
  }, [onPokemonSelected]);

  // Appeler onPokemonSelected seulement une fois quand le pokemon change
  useEffect(() => {
    if (pokemon && !hasSelectedRef.current) {
      hasSelectedRef.current = true;
      onPokemonSelectedRef.current(pokemon);
      // Notifier que le Pokémon a été récupéré
      if (onPokemonFetched) {
        onPokemonFetched();
      }
    }
  }, [pokemon, onPokemonFetched]);

  // Si shouldFetchNew est true, récupérer un nouveau Pokémon
  useEffect(() => {
    if (shouldFetchNew) {
      hasSelectedRef.current = false;
      resetPokemon();
      // Utiliser setTimeout pour s'assurer que resetPokemon est terminé
      const timer = setTimeout(() => {
        if (type) {
          fetchByType(type);
        } else {
          fetchByLimit(limit);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [shouldFetchNew, type, limit, fetchByType, fetchByLimit, resetPokemon]);

  const handleStartGame = async () => {
    hasSelectedRef.current = false; // Réinitialiser pour permettre une nouvelle sélection
    resetPokemon(); // Réinitialiser le pokemon avant de chercher un nouveau
    if (type) {
      await fetchByType(type);
    } else {
      await fetchByLimit(limit);
    }
  };

  return (
    <div className={styles.container}>
      {!pokemon && !isLoading && !error && (
        <button
          className={styles.startButton}
          onClick={handleStartGame}
          disabled={disabled || isLoading}
          aria-label="Commencer une partie"
        >
          Commencer une partie
        </button>
      )}

      {error && (
        <div className={styles.error} role="alert">
          <p>Erreur : {error}</p>
          <button onClick={handleStartGame} className={styles.retryButton}>
            Réessayer
          </button>
        </div>
      )}

      {/* Toujours afficher le conteneur pour réserver l'espace */}
      <div className={styles.pokemonDisplay}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.pokeballLoader}>
              <div className={styles.pokeballTop}></div>
              <div className={styles.pokeballBottom}></div>
              <div className={styles.pokeballCenter}></div>
            </div>
            <p className={styles.loadingText}>Chargement du Pokémon...</p>
            <div className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : pokemon ? (
          <>
            <div className={styles.particles}>
              <div className={styles.particle}></div>
              <div className={styles.particle}></div>
              <div className={styles.particle}></div>
              <div className={styles.particle}></div>
              <div className={styles.particle}></div>
              <div className={styles.particle}></div>
            </div>
            <div className={styles.pokemonWrapper}>
              <img
                src={pokemon.imageUrl}
                alt={pokemon.name}
                className={styles.pokemonImage}
                loading="lazy"
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
