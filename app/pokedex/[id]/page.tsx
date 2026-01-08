"use client";

import { useEffect, useState, useCallback } from "react";
import type { CSSProperties } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { PokemonDetail } from "@/types/pokedex";
import styles from "./pokemonDetail.module.css";
import {
  getPokemonByIdOrName,
  convertToPokemonDetail,
  getAllPokemonList,
} from "@/services/pokeapi";

const TYPE_COLORS: Record<string, string> = {
  // Français
  normal: "#A8A878",
  feu: "#F08030",
  eau: "#6890F0",
  plante: "#78C850",
  électrik: "#F8D030",
  glace: "#98D8D8",
  combat: "#C03028",
  poison: "#A040A0",
  sol: "#E0C068",
  vol: "#A890F0",
  psy: "#F85888",
  insecte: "#A8B820",
  roche: "#B8A038",
  spectre: "#705898",
  dragon: "#7038F8",
  ténèbres: "#705848",
  acier: "#B8B8D0",
  fée: "#EE99AC",
  // Sans accents (sécurité)
  electrik: "#F8D030",
  tenebres: "#705848",
  fee: "#EE99AC",
  // Noms anglais pour éviter les dégradés gris si l'API renvoie en EN
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  ice: "#98D8D8",
  fighting: "#C03028",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

const TYPE_LABELS: Record<string, string> = {
  normal: "Normal",
  feu: "Feu",
  eau: "Eau",
  plante: "Plante",
  electrik: "Électrique",
  électrique: "Électrique",
  électrik: "Électrique",
  glace: "Glace",
  combat: "Combat",
  poison: "Poison",
  sol: "Sol",
  vol: "Vol",
  psy: "Psy",
  insecte: "Insecte",
  roche: "Roche",
  spectre: "Spectre",
  dragon: "Dragon",
  ténèbres: "Ténèbres",
  tenebres: "Ténèbres",
  acier: "Acier",
  fée: "Fée",
  fee: "Fée",
};

const GENERATION_INFO: Record<
  number,
  {
    shortLabel: string;
    region: string;
    description: string;
  }
> = {
  1: {
    shortLabel: "1ʳᵉ génération",
    region: "Kanto",
    description:
      "Apparu pour la première fois dans les jeux de la 1ʳᵉ génération (région de Kanto).",
  },
  2: {
    shortLabel: "2ᵉ génération",
    region: "Johto",
    description:
      "Apparu pour la première fois dans les jeux de la 2ᵉ génération (région de Johto).",
  },
  3: {
    shortLabel: "3ᵉ génération",
    region: "Hoenn",
    description:
      "Apparu pour la première fois dans les jeux de la 3ᵉ génération (région de Hoenn).",
  },
  4: {
    shortLabel: "4ᵉ génération",
    region: "Sinnoh",
    description:
      "Apparu pour la première fois dans les jeux de la 4ᵉ génération (région de Sinnoh).",
  },
  5: {
    shortLabel: "5ᵉ génération",
    region: "Unys",
    description:
      "Apparu pour la première fois dans les jeux de la 5ᵉ génération (région d’Unys).",
  },
  6: {
    shortLabel: "6ᵉ génération",
    region: "Kalos",
    description:
      "Apparu pour la première fois dans les jeux de la 6ᵉ génération (région de Kalos).",
  },
  7: {
    shortLabel: "7ᵉ génération",
    region: "Alola",
    description:
      "Apparu pour la première fois dans les jeux de la 7ᵉ génération (région d’Alola).",
  },
  8: {
    shortLabel: "8ᵉ génération",
    region: "Galar",
    description:
      "Apparu pour la première fois dans les jeux de la 8ᵉ génération (région de Galar).",
  },
  9: {
    shortLabel: "9ᵉ génération",
    region: "Paldea",
    description:
      "Apparu pour la première fois dans les jeux de la 9ᵉ génération (région de Paldea).",
  },
};

const GENERATION_COLORS: Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
  }
> = {
  Kanto: {
    // rouge doux
    bg: "#fee2e2",
    border: "#f87171",
    text: "#7f1d1d",
  },
  Johto: {
    // doré/miel
    bg: "#fef3c7",
    border: "#facc15",
    text: "#78350f",
  },
  Hoenn: {
    // vert
    bg: "#dcfce7",
    border: "#22c55e",
    text: "#14532d",
  },
  Sinnoh: {
    // violet
    bg: "#ede9fe",
    border: "#a855f7",
    text: "#4c1d95",
  },
  Unys: {
    // gris/noir et blanc
    bg: "#e5e7eb",
    border: "#6b7280",
    text: "#111827",
  },
  Kalos: {
    // bleu
    bg: "#dbeafe",
    border: "#3b82f6",
    text: "#1e3a8a",
  },
  Alola: {
    // turquoise
    bg: "#ccfbf1",
    border: "#14b8a6",
    text: "#115e59",
  },
  Galar: {
    // rose/rouge
    bg: "#ffe4e6",
    border: "#fb7185",
    text: "#9f1239",
  },
  Paldea: {
    // orange/terre (reste raisonnable)
    bg: "#ffedd5",
    border: "#fb923c",
    text: "#7c2d12",
  },
  default: {
    bg: "#e5e7eb",
    border: "#9ca3af",
    text: "#111827",
  },
};

// Fonction pour obtenir le label explicite des résistances (lisible par des enfants)
function getResistanceLabel(multiplier: number): string {
  if (multiplier === 0) return "Immunité (n'encaisse aucun dégât)";
  if (multiplier === 0.25) return "Très résistant (encaisse 25% des dégâts)";
  if (multiplier === 0.5) return "Résistant (encaisse 50% des dégâts)";
  if (multiplier === 1) return "Normal (encaisse 100% des dégâts)";
  if (multiplier === 2) return "Faible (encaisse 200% des dégâts)";
  if (multiplier === 4) return "Très faible (encaisse 400% des dégâts)";
  return `Encaisse ${multiplier * 100}% des dégâts`;
}

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pokemonId = params.id as string;
  const [pokemon, setPokemon] = useState<any>(null);
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Charger la liste complète pour la navigation (seulement les IDs)
        const listResponse = await getAllPokemonList(1302, 0);
        setPokemonList(listResponse);

        // Récupérer le Pokémon par ID ou nom
        const pokemonIdNum = parseInt(pokemonId);
        const idToFetch = isNaN(pokemonIdNum) ? pokemonId : pokemonIdNum;

        const pokemonData = await getPokemonByIdOrName(idToFetch);
        const convertedPokemon = await convertToPokemonDetail(pokemonData);

        setPokemon(convertedPokemon);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (pokemonId) {
      fetchPokemon();
    }
  }, [pokemonId]);

  // Trouver le Pokémon précédent et suivant
  const getNavigationPokemon = () => {
    if (!pokemon || pokemonList.length === 0)
      return { previous: null, next: null };

    const currentPokedexId = pokemon.pokedexId || pokemon.id || 0;
    const currentIndex = pokemonList.findIndex(
      (p: any) => p.id === currentPokedexId
    );

    if (currentIndex === -1) return { previous: null, next: null };

    const previous = currentIndex > 0 ? pokemonList[currentIndex - 1] : null;
    const next =
      currentIndex < pokemonList.length - 1
        ? pokemonList[currentIndex + 1]
        : null;

    return { previous, next };
  };

  const { previous, next } = getNavigationPokemon();

  const navigateToPokemon = useCallback(
    (targetPokemon: any) => {
      if (!targetPokemon) return;
      const id =
        targetPokemon.id || targetPokemon.pokedexId || targetPokemon.slug;
      router.push(`/pokedex/${id}`);
    },
    [router]
  );

  // Navigation au clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && previous) {
        navigateToPokemon(previous);
      } else if (e.key === "ArrowRight" && next) {
        navigateToPokemon(next);
      } else if (e.key === "Escape") {
        router.push("/pokedex");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [previous, next, navigateToPokemon, router]);

  // Calculer les couleurs de fond basées sur les types (même si pokemon n'est pas encore chargé)
  const getTypeColor = (typeName: string) => {
    const normalized = typeName?.toLowerCase() || "";
    return TYPE_COLORS[normalized] || "#94a3b8";
  };

  const getTypeLabel = (typeName: string) => {
    const normalized = typeName?.toLowerCase() || "";
    return TYPE_LABELS[normalized] || typeName;
  };

  const apiTypes = pokemon ? pokemon.apiTypes || pokemon.types || [] : [];

  const getBackgroundGradient = () => {
    if (apiTypes.length === 0) {
      return {
        color1: "#667eea",
        color2: "#764ba2",
      };
    }

    const type1 =
      typeof apiTypes[0] === "string" ? apiTypes[0] : apiTypes[0].name;
    const color1 = getTypeColor(type1);

    if (apiTypes.length > 1) {
      const type2 =
        typeof apiTypes[1] === "string" ? apiTypes[1] : apiTypes[1].name;
      const color2 = getTypeColor(type2);
      return { color1, color2 };
    }

    // Si un seul type, créer un dégradé avec une variante plus foncée
    const hex = color1.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const darkerR = Math.max(0, Math.floor(r * 0.7));
    const darkerG = Math.max(0, Math.floor(g * 0.7));
    const darkerB = Math.max(0, Math.floor(b * 0.7));
    const color2 = `#${darkerR.toString(16).padStart(2, "0")}${darkerG
      .toString(16)
      .padStart(2, "0")}${darkerB.toString(16).padStart(2, "0")}`;
    return { color1, color2 };
  };

  const backgroundColors = getBackgroundGradient();

  // Appliquer le fond dégradé à toute la page
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--type-color-1",
      backgroundColors.color1
    );
    document.documentElement.style.setProperty(
      "--type-color-2",
      backgroundColors.color2
    );

    return () => {
      document.documentElement.style.removeProperty("--type-color-1");
      document.documentElement.style.removeProperty("--type-color-2");
    };
  }, [backgroundColors.color1, backgroundColors.color2]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement du Pokémon...</p>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Erreur : {error || "Pokémon non trouvé"}</p>
          <button
            onClick={() => router.push("/pokedex")}
            className={styles.backButton}
          >
            Retour au Pokédex
          </button>
        </div>
      </div>
    );
  }

  const totalStats = pokemon.stats
    ? Object.values(pokemon.stats).reduce(
        (sum: number, stat: any) => sum + (typeof stat === "number" ? stat : 0),
        0
      )
    : 0;
  const stats = pokemon.stats || {};
  const apiResistances = pokemon.apiResistances || [];
  const apiEvolutions = pokemon.apiEvolutions || pokemon.evolutions || [];
  const apiPreEvolution = pokemon.apiPreEvolution || pokemon.preEvolution;
  const apiGeneration = pokemon.apiGeneration || pokemon.generation || 1;
  const rawData = pokemon.rawData;
  const generationInfo = GENERATION_INFO[apiGeneration];
  const generationColors =
    GENERATION_COLORS[generationInfo?.region || "default"] ||
    GENERATION_COLORS.default;

  // Données simplifiées pour une fiche lisible par des enfants
  const speciesData = rawData?.speciesData;

  const mainTypeName =
    apiTypes.length > 0
      ? typeof apiTypes[0] === "string"
        ? apiTypes[0]
        : apiTypes[0].name
      : undefined;

  const simpleCategory =
    speciesData?.genera &&
    speciesData.genera.find((g: any) => g.language.name === "fr")?.genus;

  const simpleDescriptionRaw =
    speciesData?.flavor_text_entries &&
    (speciesData.flavor_text_entries.find((f: any) => f.language.name === "fr")
      ?.flavor_text ||
      speciesData.flavor_text_entries[0]?.flavor_text);

  const simpleDescription = simpleDescriptionRaw
    ? simpleDescriptionRaw.replace(/\s+/g, " ").replace(/\f/g, " ")
    : undefined;

  const simpleHeight = rawData?.height ? rawData.height / 10 : undefined;
  const simpleWeight = rawData?.weight ? rawData.weight / 10 : undefined;

  const captureRate = speciesData?.capture_rate;
  let simpleCaptureDifficulty: string | undefined;

  if (typeof captureRate === "number") {
    if (captureRate >= 171) {
      simpleCaptureDifficulty = "Facile à capturer";
    } else if (captureRate >= 81) {
      simpleCaptureDifficulty = "Moyen à capturer";
    } else {
      simpleCaptureDifficulty = "Difficile à capturer";
    }
  }

  // Trouver les Pokémon d'évolution dans la liste pour afficher leurs images
  const getEvolutionPokemon = (evolution: any) => {
    if (!evolution || !pokemonList.length) return null;
    const evolutionId = evolution.pokedexId || evolution.id;
    return pokemonList.find((p: any) => p.id === evolutionId);
  };

  const preEvolutionPokemon = apiPreEvolution
    ? getEvolutionPokemon(apiPreEvolution)
    : null;
  const evolutionPokemons = apiEvolutions
    .map((evo: any) => getEvolutionPokemon(evo))
    .filter(Boolean);

  // Pour les enfants : on n'affiche que les vraies forces/faiblesses (on masque les 1x "Normales")
  const displayedResistances = apiResistances.filter((resistance: any) => {
    const multiplier = resistance.damage_multiplier ?? 1;
    return multiplier !== 1;
  });

  return (
    <div className={styles.container}>
      <div className={styles.navigationBar}>
        <button
          onClick={() => router.push("/pokedex")}
          className={styles.backButton}
        >
          ← Retour au Pokédex
        </button>

        <div className={styles.navigationArrows}>
          <button
            onClick={() => navigateToPokemon(previous)}
            disabled={!previous}
            className={styles.navButton}
            aria-label="Pokémon précédent"
          >
            ← Précédent
          </button>
          <button
            onClick={() => navigateToPokemon(next)}
            disabled={!next}
            className={styles.navButton}
            aria-label="Pokémon suivant"
          >
            Suivant →
          </button>
        </div>
      </div>

      <div className={styles.pokemonDetail}>
        {/* Header avec image */}
        <div className={styles.headerSection}>
          <div className={styles.pokemonImageLarge}>
            <Image
              src={pokemon.image || pokemon.sprite || ""}
              alt={pokemon.name || "Pokémon"}
              width={400}
              height={400}
              className={styles.pokemonImage}
              unoptimized
            />
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.pokemonNumber}>
              #{String(pokemon.pokedexId || pokemon.id || 0).padStart(3, "0")}
            </div>
            <h1 className={styles.pokemonName}>
              {pokemon.name || pokemon.slug}
            </h1>
            <div className={styles.typesContainer}>
              {apiTypes.map((type: any, index: number) => {
                const rawName = typeof type === "string" ? type : type.name;
                return (
                  <span
                    key={index}
                    className={styles.typeBadge}
                    style={{ backgroundColor: getTypeColor(rawName) }}
                  >
                    {getTypeLabel(rawName)}
                  </span>
                );
              })}
            </div>
            {pokemon.apiGeneration && (
              <div
                className={styles.generationBadge}
                style={{
                  backgroundColor: generationColors.bg,
                  borderColor: generationColors.border,
                  color: generationColors.text,
                }}
              >
                {generationInfo?.shortLabel || `Génération ${apiGeneration}`} ·{" "}
                {generationInfo?.region || "Région inconnue"}
              </div>
            )}

            {(simpleCategory ||
              simpleHeight !== undefined ||
              simpleWeight !== undefined) && (
              <div className={styles.basicInfoRow}>
                {simpleCategory && (
                  <div className={styles.basicInfoItem}>
                    <span className={styles.basicInfoLabel}>Catégorie</span>
                    <span className={styles.basicInfoValue}>
                      {simpleCategory}
                    </span>
                  </div>
                )}
                {simpleHeight !== undefined && (
                  <div className={styles.basicInfoItem}>
                    <span className={styles.basicInfoLabel}>Taille</span>
                    <span className={styles.basicInfoValue}>
                      {simpleHeight} m
                    </span>
                  </div>
                )}
                {simpleWeight !== undefined && (
                  <div className={styles.basicInfoItem}>
                    <span className={styles.basicInfoLabel}>Poids</span>
                    <span className={styles.basicInfoValue}>
                      {simpleWeight} kg
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bloc d'informations principales (texte + petites cartes) */}
        <section className={styles.simpleCard}>
          <div className={styles.simpleIntro}>
            <h2 className={styles.simpleTitle}>Informations sur le Pokémon</h2>
            {mainTypeName && (
              <p className={styles.simpleSentence}>
                <strong>{pokemon.name || pokemon.slug}</strong> est un Pokémon
                de type{" "}
                <span className={styles.simpleHighlight}>
                  {getTypeLabel(mainTypeName)}
                </span>
                .
              </p>
            )}
            {simpleDescription && (
              <p className={styles.simpleFact}>
                <span className={styles.simpleFactLabel}>Le sais-tu ?</span>{" "}
                {simpleDescription}
              </p>
            )}
          </div>

          <div className={styles.simpleGrid}>
            {simpleCategory && (
              <div className={styles.simpleItem}>
                <div className={styles.simpleItemLabel}>Catégorie</div>
                <div className={styles.simpleItemValue}>{simpleCategory}</div>
              </div>
            )}

            {simpleHeight !== undefined && (
              <div className={styles.simpleItem}>
                <div className={styles.simpleItemLabel}>Taille</div>
                <div className={styles.simpleItemValue}>{simpleHeight} m</div>
              </div>
            )}

            {simpleWeight !== undefined && (
              <div className={styles.simpleItem}>
                <div className={styles.simpleItemLabel}>Poids</div>
                <div className={styles.simpleItemValue}>{simpleWeight} kg</div>
              </div>
            )}

            {mainTypeName && (
              <div className={styles.simpleItem}>
                <div className={styles.simpleItemLabel}>Type principal</div>
                <div className={styles.simpleItemValue}>
                  {getTypeLabel(mainTypeName)}
                </div>
              </div>
            )}

            {simpleCaptureDifficulty && (
              <div className={styles.simpleItem}>
                <div className={styles.simpleItemLabel}>Capture</div>
                <div className={styles.simpleItemValue}>
                  {simpleCaptureDifficulty}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Statistiques */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Statistiques principales</h2>
          <div className={styles.statsGrid}>
            {Object.entries(stats).map(([statName, value]) => {
              const statValue = typeof value === "number" ? value : 0;
              const maxStat = 255;
              const percentage = (statValue / maxStat) * 100;
              return (
                <div key={statName} className={styles.statItem}>
                  <div className={styles.statHeader}>
                    <span className={styles.statName}>{statName}</span>
                    <span className={styles.statValue}>{statValue}</span>
                  </div>
                  <div className={styles.statBar}>
                    <div
                      className={styles.statFill}
                      style={{
                        width: `${percentage}%`,
                        backgroundColor:
                          percentage > 70
                            ? "#4ade80"
                            : percentage > 40
                            ? "#fbbf24"
                            : "#f87171",
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <div className={styles.totalStats}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>{totalStats}</span>
            </div>
          </div>
        </section>

        {/* Résistances (version simplifiée pour les enfants) */}
        {displayedResistances.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Forces et faiblesses en combat
            </h2>
            <div className={styles.resistancesGrid}>
              {displayedResistances.map((resistance: any, index: number) => {
                const multiplier = resistance.damage_multiplier || 1;
                const label = getResistanceLabel(multiplier);
                const isResistant = multiplier < 1;
                const isWeak = multiplier > 1;
                const isNormal = multiplier === 1;

                return (
                  <div key={index} className={styles.resistanceItem}>
                    <div className={styles.resistanceHeader}>
                      <span className={styles.resistanceType}>
                        {resistance.name || resistance}
                      </span>
                      <span className={styles.resistanceMultiplier}>
                        {multiplier}x
                      </span>
                    </div>
                    <div
                      className={styles.resistanceLabel}
                      style={{
                        backgroundColor: isResistant
                          ? "#10b981"
                          : isWeak
                          ? "#ef4444"
                          : "#64748b",
                        color: "#ffffff",
                        borderColor: isResistant
                          ? "#059669"
                          : isWeak
                          ? "#dc2626"
                          : "#475569",
                      }}
                    >
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Évolutions */}
        {(preEvolutionPokemon || evolutionPokemons.length > 0) && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Évolutions</h2>
            <div className={styles.evolutionsLine}>
              {/* Pré-évolution */}
              {preEvolutionPokemon && (
                <div
                  className={styles.evolutionItem}
                  onClick={() => navigateToPokemon(preEvolutionPokemon)}
                >
                  <span className={styles.evolutionArrowTopLeft}>←</span>
                  <div className={styles.evolutionImageSmall}>
                    <Image
                      src={
                        preEvolutionPokemon.image ||
                        preEvolutionPokemon.sprite ||
                        ""
                      }
                      alt={preEvolutionPokemon.name || "Pré-évolution"}
                      width={80}
                      height={80}
                      className={styles.evolutionImgSmall}
                      unoptimized
                    />
                  </div>
                  <div className={styles.evolutionDetails}>
                    <span className={styles.evolutionName}>
                      {preEvolutionPokemon.name}
                    </span>
                    <span className={styles.evolutionNumber}>
                      #
                      {String(
                        preEvolutionPokemon.pokedexId ||
                          preEvolutionPokemon.id ||
                          0
                      ).padStart(3, "0")}
                    </span>
                  </div>
                </div>
              )}

              {/* Évolutions */}
              {evolutionPokemons.map((evoPokemon: any, index: number) => (
                <div
                  key={index}
                  className={styles.evolutionItem}
                  onClick={() => navigateToPokemon(evoPokemon)}
                >
                  <span className={styles.evolutionArrowTopRight}>→</span>
                  <div className={styles.evolutionImageSmall}>
                    <Image
                      src={evoPokemon.image || evoPokemon.sprite || ""}
                      alt={evoPokemon.name || "Évolution"}
                      width={80}
                      height={80}
                      className={styles.evolutionImgSmall}
                      unoptimized
                    />
                  </div>
                  <div className={styles.evolutionDetails}>
                    <span className={styles.evolutionName}>
                      {evoPokemon.name}
                    </span>
                    <span className={styles.evolutionNumber}>
                      #
                      {String(
                        evoPokemon.pokedexId || evoPokemon.id || 0
                      ).padStart(3, "0")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Informations supplémentaires si disponibles */}
        {pokemon.apiResistancesWithAbilities &&
          pokemon.apiResistancesWithAbilities.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Résistances avec Capacités
              </h2>
              <div className={styles.resistancesGrid}>
                {pokemon.apiResistancesWithAbilities.map(
                  (resistance: any, index: number) => (
                    <div key={index} className={styles.resistanceItem}>
                      <span className={styles.resistanceType}>
                        {resistance.name}
                      </span>
                      <span className={styles.resistanceValue}>
                        {resistance.damage_multiplier}x
                      </span>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

        {/* Données complètes de l'API PokéAPI v2 (repliées par défaut pour ne pas surcharger la fiche) */}
        {rawData && (
          <section className={styles.section}>
            <details className={styles.advancedDetails}>
              <summary className={styles.advancedSummary}>
                🔬 Voir tous les détails techniques (PokéAPI)
              </summary>

              <div className={styles.rawDataSection}>
                <div className={styles.rawDataGrid}>
                  {/* Colonne 1 : Infos de combat / gameplay */}
                  <div className={styles.rawColumn}>
                    <h3 className={styles.rawGroupTitle}>Profil de combat</h3>

                    {rawData.base_experience && (
                      <div className={styles.dataItem}>
                        <strong>Expérience de base</strong>
                        <span className={styles.dataValue}>
                          {rawData.base_experience}
                        </span>
                        <p className={styles.dataHelp}>
                          Nombre de points d&apos;expérience gagnés en battant
                          ce Pokémon.
                        </p>
                      </div>
                    )}

                    {rawData.moves && rawData.moves.length > 0 && (
                      <div className={styles.dataGroup}>
                        <strong className={styles.dataGroupTitle}>
                          Mouvements principaux (
                          {Math.min(10, rawData.moves.length)})
                        </strong>
                        <div className={styles.dataGroupContent}>
                          {rawData.moves
                            .slice(0, 10)
                            .map((move: any, index: number) => (
                              <div
                                key={index}
                                className={styles.dataItemInline}
                              >
                                <span className={styles.dataChipPrimary}>
                                  {move.move.name}
                                </span>
                                <span className={styles.dataChipSecondary}>
                                  Niveau{" "}
                                  {move.version_group_details[0]
                                    ?.level_learned_at ?? "N/A"}
                                </span>
                              </div>
                            ))}
                          {rawData.moves.length > 10 && (
                            <p className={styles.dataHelp}>
                              … et {rawData.moves.length - 10} autres mouvements
                              dans PokéAPI.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {rawData.abilities && rawData.abilities.length > 0 && (
                      <div className={styles.dataGroup}>
                        <strong className={styles.dataGroupTitle}>
                          Capacités spéciales
                        </strong>
                        <div className={styles.dataGroupContent}>
                          {rawData.abilities.map(
                            (ability: any, index: number) => (
                              <div
                                key={index}
                                className={styles.dataItemInline}
                              >
                                <span className={styles.dataChipPrimary}>
                                  {ability.ability.name}
                                </span>
                                {ability.is_hidden && (
                                  <span className={styles.dataChipSecondary}>
                                    Capacité cachée
                                  </span>
                                )}
                                <span className={styles.dataChipSecondary}>
                                  Slot {ability.slot}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                        <p className={styles.dataHelp}>
                          Les capacités modifient les effets passifs du Pokémon
                          en combat (météo, statistiques, immunités…).
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Colonne 2 : Physique + espèce / capture */}
                  <div className={styles.rawColumn}>
                    <h3 className={styles.rawGroupTitle}>
                      Caractéristiques & capture
                    </h3>

                    {(rawData.height || rawData.weight) && (
                      <div className={styles.dataItem}>
                        <strong>Taille & poids</strong>
                        <div className={styles.dataValueRow}>
                          {rawData.height && (
                            <span className={styles.dataChipPrimary}>
                              Taille : {rawData.height / 10} m
                            </span>
                          )}
                          {rawData.weight && (
                            <span className={styles.dataChipPrimary}>
                              Poids : {rawData.weight / 10} kg
                            </span>
                          )}
                        </div>
                        <p className={styles.dataHelp}>
                          Utilisé pour certaines capacités et talents (prises,
                          projection, etc.).
                        </p>
                      </div>
                    )}

                    {rawData.speciesData && (
                      <>
                        {rawData.speciesData.capture_rate !== undefined && (
                          <div className={styles.dataItem}>
                            <strong>Taux de capture</strong>
                            <span className={styles.dataValue}>
                              {rawData.speciesData.capture_rate} / 255
                            </span>
                            <p className={styles.dataHelp}>
                              Plus la valeur est élevée, plus le Pokémon est
                              facile à capturer.
                            </p>
                          </div>
                        )}

                        {rawData.speciesData.base_happiness !== undefined && (
                          <div className={styles.dataItem}>
                            <strong>Bonheur de base</strong>
                            <span className={styles.dataValue}>
                              {rawData.speciesData.base_happiness}
                            </span>
                            <p className={styles.dataHelp}>
                              Niveau d&apos;affection initial utilisé pour les
                              mécaniques basées sur l&apos;amitié (certaines
                              évolutions, attaques…).
                            </p>
                          </div>
                        )}

                        {rawData.speciesData.gender_rate !== undefined && (
                          <div className={styles.dataItem}>
                            <strong>Répartition des genres</strong>
                            <span className={styles.dataValue}>
                              {rawData.speciesData.gender_rate === -1
                                ? "Asexué"
                                : `${
                                    (8 - rawData.speciesData.gender_rate) * 12.5
                                  }% ♀ / ${
                                    rawData.speciesData.gender_rate * 12.5
                                  }% ♂`}
                            </span>
                            <p className={styles.dataHelp}>
                              Utilisé pour l&apos;élevage et certaines capacités
                              qui dépendent du genre.
                            </p>
                          </div>
                        )}

                        {rawData.speciesData.egg_groups &&
                          rawData.speciesData.egg_groups.length > 0 && (
                            <div className={styles.dataItem}>
                              <strong>Groupes d&apos;œufs</strong>
                              <span className={styles.dataValue}>
                                {rawData.speciesData.egg_groups
                                  .map((eg: any) => eg.name)
                                  .join(", ")}
                              </span>
                              <p className={styles.dataHelp}>
                                Détermine avec quels Pokémon il peut se
                                reproduire à la Pension.
                              </p>
                            </div>
                          )}

                        {rawData.speciesData.hatch_counter !== undefined && (
                          <div className={styles.dataItem}>
                            <strong>Cycles d&apos;éclosion</strong>
                            <span className={styles.dataValue}>
                              {rawData.speciesData.hatch_counter}
                            </span>
                            <p className={styles.dataHelp}>
                              Nombre de cycles nécessaires avant l&apos;éclosion
                              d&apos;un œuf de ce Pokémon.
                            </p>
                          </div>
                        )}

                        {(rawData.speciesData.is_legendary !== undefined ||
                          rawData.speciesData.is_mythical !== undefined ||
                          rawData.speciesData.is_baby !== undefined) && (
                          <div className={styles.dataItem}>
                            <strong>Statut spécial</strong>
                            <div className={styles.dataValueRow}>
                              {rawData.speciesData.is_baby !== undefined && (
                                <span className={styles.dataChipSecondary}>
                                  Bébé :{" "}
                                  {rawData.speciesData.is_baby ? "Oui" : "Non"}
                                </span>
                              )}
                              {rawData.speciesData.is_legendary !==
                                undefined && (
                                <span className={styles.dataChipSecondary}>
                                  Légendaire :{" "}
                                  {rawData.speciesData.is_legendary
                                    ? "Oui"
                                    : "Non"}
                                </span>
                              )}
                              {rawData.speciesData.is_mythical !==
                                undefined && (
                                <span className={styles.dataChipSecondary}>
                                  Mythique :{" "}
                                  {rawData.speciesData.is_mythical
                                    ? "Oui"
                                    : "Non"}
                                </span>
                              )}
                            </div>
                            <p className={styles.dataHelp}>
                              Indique si le Pokémon est classé comme bébé,
                              légendaire ou mythique dans PokéAPI.
                            </p>
                          </div>
                        )}

                        {(rawData.speciesData.habitat ||
                          rawData.speciesData.color ||
                          rawData.speciesData.shape) && (
                          <div className={styles.dataItem}>
                            <strong>Biologie & habitat</strong>
                            <div className={styles.dataValueRow}>
                              {rawData.speciesData.habitat && (
                                <span className={styles.dataChipSecondary}>
                                  Habitat : {rawData.speciesData.habitat.name}
                                </span>
                              )}
                              {rawData.speciesData.color && (
                                <span className={styles.dataChipSecondary}>
                                  Couleur : {rawData.speciesData.color.name}
                                </span>
                              )}
                              {rawData.speciesData.shape && (
                                <span className={styles.dataChipSecondary}>
                                  Forme : {rawData.speciesData.shape.name}
                                </span>
                              )}
                            </div>
                            <p className={styles.dataHelp}>
                              Informations descriptives utilisées pour le
                              Pokédex (apparence générale et environnement
                              naturel).
                            </p>
                          </div>
                        )}

                        {rawData.speciesData.flavor_text_entries &&
                          rawData.speciesData.flavor_text_entries.length >
                            0 && (
                            <div className={styles.dataItem}>
                              <strong>Description Pokédex</strong>
                              <p className={styles.dataFlavor}>
                                {rawData.speciesData.flavor_text_entries.find(
                                  (f: any) => f.language.name === "fr"
                                )?.flavor_text ||
                                  rawData.speciesData.flavor_text_entries[0]
                                    ?.flavor_text}
                              </p>
                              <p className={styles.dataHelp}>
                                Texte officiel issu d&apos;un des jeux Pokémon,
                                fourni par PokéAPI.
                              </p>
                            </div>
                          )}

                        {rawData.speciesData.genera &&
                          rawData.speciesData.genera.length > 0 && (
                            <div className={styles.dataItem}>
                              <strong>Catégorie Pokédex</strong>
                              <span className={styles.dataValue}>
                                {rawData.speciesData.genera.find(
                                  (g: any) => g.language.name === "fr"
                                )?.genus ||
                                  rawData.speciesData.genera[0]?.genus}
                              </span>
                              <p className={styles.dataHelp}>
                                Intitulé de la catégorie du Pokémon dans le
                                Pokédex (par exemple « Pokémon Souris »).
                              </p>
                            </div>
                          )}
                      </>
                    )}

                    {rawData.forms && rawData.forms.length > 0 && (
                      <div className={styles.dataItem}>
                        <strong>Formes alternatives</strong>
                        <div className={styles.dataValueRow}>
                          {rawData.forms.map((form: any, index: number) => (
                            <span
                              key={index}
                              className={styles.dataChipSecondary}
                            >
                              {form.name}
                            </span>
                          ))}
                        </div>
                        <p className={styles.dataHelp}>
                          Liste des formes gérées par PokéAPI (formes
                          régionales, méga-évolutions, etc.).
                        </p>
                      </div>
                    )}

                    {rawData.held_items && rawData.held_items.length > 0 && (
                      <div className={styles.dataItem}>
                        <strong>Objets tenus possibles</strong>
                        <div className={styles.dataGroupContent}>
                          {rawData.held_items.map(
                            (item: any, index: number) => (
                              <div
                                key={index}
                                className={styles.dataItemInline}
                              >
                                <span className={styles.dataChipPrimary}>
                                  {item.item.name}
                                </span>
                                <span className={styles.dataChipSecondary}>
                                  Rareté :{" "}
                                  {item.version_details[0]?.rarity ?? "N/A"}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                        <p className={styles.dataHelp}>
                          Objets que le Pokémon peut porter en étant rencontré
                          dans les jeux, avec leur rareté.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Données JSON brutes (mode avancé) */}
                <details className={styles.jsonDetails}>
                  <summary className={styles.jsonSummary}>
                    🔧 Voir les données JSON brutes de PokéAPI
                  </summary>
                  <pre className={styles.jsonContent}>
                    {JSON.stringify(rawData, null, 2)}
                  </pre>
                </details>
              </div>
            </details>
          </section>
        )}
      </div>
    </div>
  );
}
