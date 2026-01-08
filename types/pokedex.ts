/**
 * Types pour le Pokédex
 */

export interface PokemonDetail {
  id: number;
  pokedexId: number;
  name: string;
  slug: string;
  image: string;
  sprite: string;
  stats: {
    HP: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  apiTypes: Array<{
    name: string;
    image: string;
  }>;
  apiGeneration: number;
  apiResistances: Array<{
    name: string;
    damage_multiplier: number;
    damage_relation: string;
  }>;
  apiEvolutions: Array<{
    name: string;
    pokedexId: number;
  }>;
  apiPreEvolution?: {
    name: string;
    pokedexId: number;
  } | null;
  apiResistancesWithAbilities?: Array<{
    name: string;
    damage_multiplier: number;
    damage_relation: string;
  }>;
  // Toutes les données supplémentaires de PokéAPI v2
  rawData?: {
    base_experience?: number;
    height?: number;
    weight?: number;
    order?: number;
    is_default?: boolean;
    abilities?: Array<{
      ability: { name: string; url: string };
      is_hidden: boolean;
      slot: number;
    }>;
    forms?: Array<{ name: string; url: string }>;
    game_indices?: Array<{
      game_index: number;
      version: { name: string; url: string };
    }>;
    held_items?: Array<{
      item: { name: string; url: string };
      version_details: Array<{
        rarity: number;
        version: { name: string; url: string };
      }>;
    }>;
    location_area_encounters?: string;
    moves?: Array<{
      move: { name: string; url: string };
      version_group_details: Array<{
        level_learned_at: number;
        move_learn_method: { name: string; url: string };
        version_group: { name: string; url: string };
      }>;
    }>;
    sprites?: {
      front_default?: string;
      front_shiny?: string;
      front_female?: string;
      front_shiny_female?: string;
      back_default?: string;
      back_shiny?: string;
      back_female?: string;
      back_shiny_female?: string;
      other?: any;
    };
    cries?: {
      latest?: string;
      legacy?: string;
    };
    species?: {
      name: string;
      url: string;
    };
    // Données de l'espèce
    speciesData?: {
      base_happiness?: number;
      capture_rate?: number;
      color?: { name: string; url: string };
      egg_groups?: Array<{ name: string; url: string }>;
      evolution_chain?: { url: string };
      evolves_from_species?: { name: string; url: string } | null;
      flavor_text_entries?: Array<{
        flavor_text: string;
        language: { name: string; url: string };
        version: { name: string; url: string };
      }>;
      form_descriptions?: Array<{
        description: string;
        language: { name: string; url: string };
      }>;
      forms_switchable?: boolean;
      gender_rate?: number;
      genera?: Array<{
        genus: string;
        language: { name: string; url: string };
      }>;
      generation?: { name: string; url: string };
      growth_rate?: { name: string; url: string };
      habitat?: { name: string; url: string } | null;
      has_gender_differences?: boolean;
      hatch_counter?: number;
      is_baby?: boolean;
      is_legendary?: boolean;
      is_mythical?: boolean;
      names?: Array<{
        name: string;
        language: { name: string; url: string };
      }>;
      order?: number;
      pal_park_encounters?: Array<{
        area: { name: string; url: string };
        base_score: number;
        rate: number;
      }>;
      pokedex_numbers?: Array<{
        entry_number: number;
        pokedex: { name: string; url: string };
      }>;
      shape?: { name: string; url: string };
      varieties?: Array<{
        is_default: boolean;
        pokemon: { name: string; url: string };
      }>;
    };
  };
}

export interface PokedexFilters {
  search: string;
  type: string | null;
  generation: number | null;
  region: string | null;
}

export const REGIONS = [
  { id: 'kanto', name: 'Kanto', generation: 1, limit: 151 },
  { id: 'johto', name: 'Johto', generation: 2, limit: 251 },
  { id: 'hoenn', name: 'Hoenn', generation: 3, limit: 386 },
  { id: 'sinnoh', name: 'Sinnoh', generation: 4, limit: 493 },
  { id: 'unova', name: 'Unova', generation: 5, limit: 649 },
  { id: 'kalos', name: 'Kalos', generation: 6, limit: 721 },
  { id: 'alola', name: 'Alola', generation: 7, limit: 809 },
  { id: 'galar', name: 'Galar', generation: 8, limit: 898 },
] as const;

