"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { PokemonDetail } from "@/types/pokedex";
import styles from "./PokemonCard.module.css";

interface PokemonCardProps {
  pokemon: PokemonDetail;
}

const TYPE_COLORS: Record<string, string> = {
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

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const router = useRouter();

  const getTypeColor = (typeName: string) => {
    const normalized = typeName.toLowerCase();
    return TYPE_COLORS[normalized] || "#94a3b8";
  };

  const getTypeLabel = (typeName: string) => {
    const normalized = typeName.toLowerCase();
    return TYPE_LABELS[normalized] || typeName;
  };

  const apiTypes = pokemon.apiTypes || [];

  const getBackgroundGradient = () => {
    if (apiTypes.length === 0) {
      return {
        color1: "#667eea",
        color2: "#764ba2",
      };
    }

    const type1 = apiTypes[0]?.name ?? "";
    const color1 = getTypeColor(type1);

    if (apiTypes.length > 1) {
      const type2 = apiTypes[1]?.name ?? type1;
      const color2 = getTypeColor(type2);
      return { color1, color2 };
    }

    // Si un seul type : dégradé de la même couleur, plus foncée en bas
    const hex = color1.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const darkerR = Math.max(0, Math.floor(r * 0.7));
    const darkerG = Math.max(0, Math.floor(g * 0.7));
    const darkerB = Math.max(0, Math.floor(b * 0.7));
    const color2 = `#${darkerR.toString(16).padStart(2, "0")}${darkerG
      .toString(16)
      .padStart(2, "0")}${darkerB.toString(16).padStart(2, "0")}`;
    return { color1, color2 };
  };

  const cardBackground = getBackgroundGradient();

  const handleCardClick = () => {
    router.push(`/pokedex/${pokemon.pokedexId || pokemon.id}`);
  };

  const rawData = pokemon.rawData;

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      style={{
        background: `linear-gradient(135deg, ${cardBackground.color1} 0%, ${cardBackground.color2} 100%)`,
      }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.pokemonImageContainer}>
          <Image
            src={pokemon.image || pokemon.sprite}
            alt={pokemon.name}
            width={120}
            height={120}
            className={styles.pokemonImage}
            unoptimized
          />
        </div>
        <div className={styles.pokemonInfo}>
          <div className={styles.pokemonNumber}>
            #{String(pokemon.pokedexId).padStart(3, "0")}
          </div>
          <h3 className={styles.pokemonName}>{pokemon.name}</h3>
          <div className={styles.typesContainer}>
            {pokemon.apiTypes.map((type, index) => {
              const rawName = type.name;
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
        </div>
      </div>

      {/* Affichage de toutes les données brutes */}
      {rawData && (
        <div className={styles.rawDataSection}>
          <details className={styles.rawDataDetails}>
            <summary className={styles.rawDataSummary}>
              📊 Toutes les données de l'API
            </summary>
            <div className={styles.rawDataContent}>
              {/* Informations de base */}
              {rawData.base_experience && (
                <div className={styles.dataItem}>
                  <strong>Expérience de base:</strong> {rawData.base_experience}
                </div>
              )}
              {rawData.height && (
                <div className={styles.dataItem}>
                  <strong>Taille:</strong> {rawData.height / 10}m
                </div>
              )}
              {rawData.weight && (
                <div className={styles.dataItem}>
                  <strong>Poids:</strong> {rawData.weight / 10}kg
                </div>
              )}
              {rawData.order && (
                <div className={styles.dataItem}>
                  <strong>Ordre:</strong> {rawData.order}
                </div>
              )}
              {rawData.is_default !== undefined && (
                <div className={styles.dataItem}>
                  <strong>Forme par défaut:</strong>{" "}
                  {rawData.is_default ? "Oui" : "Non"}
                </div>
              )}

              {/* Capacités */}
              {rawData.abilities && rawData.abilities.length > 0 && (
                <div className={styles.dataGroup}>
                  <strong>Capacités:</strong>
                  <ul>
                    {rawData.abilities.map((ability, index) => (
                      <li key={index}>
                        {ability.ability.name} {ability.is_hidden && "(Cachée)"}{" "}
                        (Slot {ability.slot})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formes */}
              {rawData.forms && rawData.forms.length > 0 && (
                <div className={styles.dataGroup}>
                  <strong>Formes:</strong>
                  <ul>
                    {rawData.forms.map((form, index) => (
                      <li key={index}>{form.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Objets tenus */}
              {rawData.held_items && rawData.held_items.length > 0 && (
                <div className={styles.dataGroup}>
                  <strong>Objets tenus:</strong>
                  <ul>
                    {rawData.held_items.map((item, index) => (
                      <li key={index}>
                        {item.item.name} (Rareté:{" "}
                        {item.version_details[0]?.rarity || "N/A"})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mouvements */}
              {rawData.moves && rawData.moves.length > 0 && (
                <div className={styles.dataGroup}>
                  <strong>Mouvements ({rawData.moves.length}):</strong>
                  <ul className={styles.movesList}>
                    {rawData.moves.slice(0, 10).map((move, index) => (
                      <li key={index}>
                        {move.move.name} (Niveau:{" "}
                        {move.version_group_details[0]?.level_learned_at ||
                          "N/A"}
                        )
                      </li>
                    ))}
                    {rawData.moves.length > 10 && (
                      <li>... et {rawData.moves.length - 10} autres</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Données de l'espèce */}
              {rawData.speciesData && (
                <div className={styles.dataGroup}>
                  <strong>Données de l'espèce:</strong>
                  <ul>
                    {rawData.speciesData.base_happiness !== undefined && (
                      <li>
                        <strong>Bonheur de base:</strong>{" "}
                        {rawData.speciesData.base_happiness}
                      </li>
                    )}
                    {rawData.speciesData.capture_rate !== undefined && (
                      <li>
                        <strong>Taux de capture:</strong>{" "}
                        {rawData.speciesData.capture_rate}/255
                      </li>
                    )}
                    {rawData.speciesData.gender_rate !== undefined && (
                      <li>
                        <strong>Taux de genre:</strong>{" "}
                        {rawData.speciesData.gender_rate === -1
                          ? "Asexué"
                          : `${
                              (8 - rawData.speciesData.gender_rate) * 12.5
                            }% ♀ / ${
                              rawData.speciesData.gender_rate * 12.5
                            }% ♂`}
                      </li>
                    )}
                    {rawData.speciesData.hatch_counter !== undefined && (
                      <li>
                        <strong>Cycles d'éclosion:</strong>{" "}
                        {rawData.speciesData.hatch_counter}
                      </li>
                    )}
                    {rawData.speciesData.is_baby !== undefined && (
                      <li>
                        <strong>Bébé:</strong>{" "}
                        {rawData.speciesData.is_baby ? "Oui" : "Non"}
                      </li>
                    )}
                    {rawData.speciesData.is_legendary !== undefined && (
                      <li>
                        <strong>Légendaire:</strong>{" "}
                        {rawData.speciesData.is_legendary ? "Oui" : "Non"}
                      </li>
                    )}
                    {rawData.speciesData.is_mythical !== undefined && (
                      <li>
                        <strong>Mythique:</strong>{" "}
                        {rawData.speciesData.is_mythical ? "Oui" : "Non"}
                      </li>
                    )}
                    {rawData.speciesData.has_gender_differences !==
                      undefined && (
                      <li>
                        <strong>Différences de genre:</strong>{" "}
                        {rawData.speciesData.has_gender_differences
                          ? "Oui"
                          : "Non"}
                      </li>
                    )}
                    {rawData.speciesData.color && (
                      <li>
                        <strong>Couleur:</strong>{" "}
                        {rawData.speciesData.color.name}
                      </li>
                    )}
                    {rawData.speciesData.habitat && (
                      <li>
                        <strong>Habitat:</strong>{" "}
                        {rawData.speciesData.habitat.name}
                      </li>
                    )}
                    {rawData.speciesData.shape && (
                      <li>
                        <strong>Forme:</strong> {rawData.speciesData.shape.name}
                      </li>
                    )}
                    {rawData.speciesData.growth_rate && (
                      <li>
                        <strong>Taux de croissance:</strong>{" "}
                        {rawData.speciesData.growth_rate.name}
                      </li>
                    )}
                    {rawData.speciesData.egg_groups &&
                      rawData.speciesData.egg_groups.length > 0 && (
                        <li>
                          <strong>Groupes d'œufs:</strong>{" "}
                          {rawData.speciesData.egg_groups
                            .map((eg) => eg.name)
                            .join(", ")}
                        </li>
                      )}
                    {rawData.speciesData.flavor_text_entries &&
                      rawData.speciesData.flavor_text_entries.length > 0 && (
                        <li>
                          <strong>Description:</strong>{" "}
                          {rawData.speciesData.flavor_text_entries.find(
                            (f: any) => f.language.name === "fr"
                          )?.flavor_text ||
                            rawData.speciesData.flavor_text_entries[0]
                              ?.flavor_text}
                        </li>
                      )}
                    {rawData.speciesData.genera &&
                      rawData.speciesData.genera.length > 0 && (
                        <li>
                          <strong>Genre:</strong>{" "}
                          {rawData.speciesData.genera.find(
                            (g: any) => g.language.name === "fr"
                          )?.genus || rawData.speciesData.genera[0]?.genus}
                        </li>
                      )}
                  </ul>
                </div>
              )}

              {/* Données JSON brutes */}
              <details className={styles.jsonDetails}>
                <summary className={styles.jsonSummary}>
                  🔧 Données JSON brutes
                </summary>
                <pre className={styles.jsonContent}>
                  {JSON.stringify(rawData, null, 2)}
                </pre>
              </details>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
