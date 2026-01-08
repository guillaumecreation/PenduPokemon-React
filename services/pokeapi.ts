/**
 * Service pour interagir avec PokéAPI v2
 * Traduit automatiquement les données en français
 */

import axios from 'axios';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Traduction des types Pokémon
const TYPE_TRANSLATIONS: Record<string, string> = {
  normal: 'normal',
  fire: 'feu',
  water: 'eau',
  grass: 'plante',
  electric: 'électrik',
  ice: 'glace',
  fighting: 'combat',
  poison: 'poison',
  ground: 'sol',
  flying: 'vol',
  psychic: 'psy',
  bug: 'insecte',
  rock: 'roche',
  ghost: 'spectre',
  dragon: 'dragon',
  dark: 'ténèbres',
  steel: 'acier',
  fairy: 'fée',
};

// Traduction des noms de Pokémon (les plus communs)
const POKEMON_NAME_TRANSLATIONS: Record<string, string> = {
  bulbasaur: 'bulbizarre',
  ivysaur: 'herbizarre',
  venusaur: 'florizarre',
  charmander: 'salamèche',
  charmeleon: 'reptincel',
  charizard: 'dracaufeu',
  squirtle: 'carapuce',
  wartortle: 'carabaffe',
  blastoise: 'tortank',
  caterpie: 'chenipan',
  metapod: 'chrysacier',
  butterfree: 'papilusion',
  weedle: 'aspicot',
  kakuna: 'coconfort',
  beedrill: 'dardargnan',
  pidgey: 'roucool',
  pidgeotto: 'roucoups',
  pidgeot: 'roucarnage',
  rattata: 'rattata',
  raticate: 'rattatac',
  spearow: 'piafabec',
  fearow: 'rapasdepic',
  ekans: 'abo',
  arbok: 'arbok',
  pikachu: 'pikachu',
  raichu: 'raichu',
  sandshrew: 'sabelette',
  sandslash: 'sablaireau',
  nidoran: 'nidoran',
  nidorina: 'nidorina',
  nidoqueen: 'nidoking',
  nidoran: 'nidoran',
  nidorino: 'nidorino',
  nidoking: 'nidoking',
  clefairy: 'mélofée',
  clefable: 'mélodelfe',
  vulpix: 'goupix',
  ninetales: 'feunard',
  jigglypuff: 'rondoudou',
  wigglytuff: 'grodoudou',
  zubat: 'nosferapti',
  golbat: 'nosferalto',
  oddish: 'mystherbe',
  gloom: 'ortide',
  vileplume: 'rafflesia',
  paras: 'paras',
  parasect: 'parasect',
  venonat: 'mimitoss',
  venomoth: 'aéromite',
  diglett: 'taupiqueur',
  dugtrio: 'triopikeur',
  meowth: 'miaouss',
  persian: 'persian',
  psyduck: 'psykokwak',
  golduck: 'akwakwak',
  mankey: 'férosinge',
  primeape: 'colossinge',
  growlithe: 'caninos',
  arcanine: 'arcanin',
  poliwag: 'ptitard',
  poliwhirl: 'têtarte',
  poliwrath: 'tartard',
  abra: 'abra',
  kadabra: 'kadabra',
  alakazam: 'alakazam',
  machop: 'machoc',
  machoke: 'machopeur',
  machamp: 'mackogneur',
  bellsprout: 'chétiflor',
  weepinbell: 'boustiflor',
  victreebel: 'empiflor',
  tentacool: 'tentacool',
  tentacruel: 'tentacruel',
  geodude: 'racaillou',
  graveler: 'gravalanch',
  golem: 'grolem',
  ponyta: 'ponyta',
  rapidash: 'galopa',
  slowpoke: 'ramoloss',
  slowbro: 'flagadoss',
  magnemite: 'magnéti',
  magneton: 'magnéton',
  farfetchd: 'canarticho',
  doduo: 'doduo',
  dodrio: 'dodrio',
  seel: 'otaria',
  dewgong: 'lamantine',
  grimer: 'tadmorv',
  muk: 'grotadmorv',
  shellder: 'kokiyas',
  cloyster: 'crustabri',
  gastly: 'fantominus',
  haunter: 'spectrum',
  gengar: 'ectoplasma',
  onix: 'onix',
  drowzee: 'soporifik',
  hypno: 'hypnomade',
  krabby: 'krabby',
  kingler: 'krabboss',
  voltorb: 'voltorbe',
  electrode: 'électrode',
  exeggcute: 'noeunoeuf',
  exeggutor: 'noadkoko',
  cubone: 'osselait',
  marowak: 'ossatueur',
  hitmonlee: 'kicklee',
  hitmonchan: 'tygnon',
  lickitung: 'excelangue',
  koffing: 'smogo',
  weezing: 'smogogo',
  rhyhorn: 'rhinocorne',
  rhydon: 'rhinoféros',
  chansey: 'leveinard',
  tangela: 'saquedeneu',
  kangaskhan: 'kangourex',
  horsea: 'hypotrempe',
  seadra: 'hypocéan',
  goldeen: 'poissirène',
  seaking: 'poissoroy',
  staryu: 'stari',
  starmie: 'staross',
  mr: 'm. mime',
  scyther: 'insécateur',
  jynx: 'lippoutou',
  electabuzz: 'élektek',
  magmar: 'magmar',
  pinsir: 'scarabrute',
  tauros: 'tauros',
  magikarp: 'magicarpe',
  gyarados: 'léviator',
  lapras: 'lokhlass',
  ditto: 'métamorph',
  eevee: 'évoli',
  vaporeon: 'aquali',
  jolteon: 'voltali',
  flareon: 'pyroli',
  porygon: 'porygon',
  omanyte: 'amonita',
  omastar: 'amomistar',
  kabuto: 'kabuto',
  kabutops: 'kabutops',
  aerodactyl: 'ptéra',
  snorlax: 'ronflex',
  articuno: 'artikodin',
  zapdos: 'électhor',
  moltres: 'sulfura',
  dratini: 'minidraco',
  dragonair: 'draco',
  dragonite: 'dracaufeu',
  mewtwo: 'mewtwo',
  mew: 'mew',
};

// Fonction pour traduire un nom de Pokémon (utilise l'API si disponible)
export async function translatePokemonName(englishName: string, speciesData?: any): Promise<string> {
  // Si on a les données de l'espèce, chercher le nom français
  if (speciesData && speciesData.names) {
    const frenchName = speciesData.names.find((n: any) => n.language.name === 'fr');
    if (frenchName) {
      return frenchName.name;
    }
  }
  
  // Fallback sur le dictionnaire de traduction
  return POKEMON_NAME_TRANSLATIONS[englishName.toLowerCase()] || englishName;
}

// Fonction synchrone pour traduire (utilise le dictionnaire)
export function translatePokemonNameSync(englishName: string): string {
  return POKEMON_NAME_TRANSLATIONS[englishName.toLowerCase()] || englishName;
}

// Fonction pour traduire un type
export function translateType(englishType: string): string {
  return TYPE_TRANSLATIONS[englishType.toLowerCase()] || englishType;
}

// Fonction pour obtenir l'image officielle d'un Pokémon
export function getPokemonImage(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

// Fonction pour obtenir le sprite d'un Pokémon
export function getPokemonSprite(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

// Interface pour les données brutes de PokéAPI (toutes les propriétés disponibles)
interface PokeApiPokemon {
  id: number;
  name: string;
  base_experience?: number;
  height?: number;
  weight?: number;
  order?: number;
  is_default?: boolean;
  sprites: {
    front_default?: string;
    front_shiny?: string;
    front_female?: string;
    front_shiny_female?: string;
    back_default?: string;
    back_shiny?: string;
    back_female?: string;
    back_shiny_female?: string;
    other?: {
      'official-artwork'?: {
        front_default?: string;
        front_shiny?: string;
      };
      dream_world?: {
        front_default?: string;
      };
      home?: {
        front_default?: string;
        front_shiny?: string;
      };
    };
  };
  cries?: {
    latest?: string;
    legacy?: string;
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  abilities?: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  forms?: Array<{
    name: string;
    url: string;
  }>;
  game_indices?: Array<{
    game_index: number;
    version: {
      name: string;
      url: string;
    };
  }>;
  held_items?: Array<{
    item: {
      name: string;
      url: string;
    };
    version_details: Array<{
      rarity: number;
      version: {
        name: string;
        url: string;
      };
    }>;
  }>;
  location_area_encounters?: string;
  moves?: Array<{
    move: {
      name: string;
      url: string;
    };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: {
        name: string;
        url: string;
      };
      version_group: {
        name: string;
        url: string;
      };
    }>;
  }>;
  past_types?: Array<{
    generation: {
      name: string;
      url: string;
    };
    types: Array<{
      slot: number;
      type: {
        name: string;
        url: string;
      };
    }>;
  }>;
  past_abilities?: Array<{
    generation: {
      name: string;
      url: string;
    };
    abilities: Array<{
      ability: {
        name: string;
        url: string;
      };
      is_hidden: boolean;
      slot: number;
    }>;
  }>;
  species: {
    name: string;
    url: string;
  };
}

interface PokeApiSpecies {
  id: number;
  name: string;
  evolution_chain: {
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  } | null;
  generation: {
    name: string;
    url: string;
  };
}

interface PokeApiType {
  name: string;
  damage_relations: {
    double_damage_from: Array<{ name: string }>;
    double_damage_to: Array<{ name: string }>;
    half_damage_from: Array<{ name: string }>;
    half_damage_to: Array<{ name: string }>;
    no_damage_from: Array<{ name: string }>;
    no_damage_to: Array<{ name: string }>;
  };
}

interface PokeApiEvolutionChain {
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolves_to: Array<{
      species: {
        name: string;
        url: string;
      };
      evolves_to: Array<any>;
    }>;
  };
}

// Fonction pour récupérer un Pokémon par ID ou nom
export async function getPokemonByIdOrName(idOrName: string | number): Promise<any> {
  try {
    const response = await axios.get<PokeApiPokemon>(
      `${POKEAPI_BASE_URL}/pokemon/${idOrName}`
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du Pokémon:', error);
    throw error;
  }
}

// Fonction pour récupérer la liste de tous les Pokémon (seulement les métadonnées)
export async function getAllPokemonList(limit: number = 1302, offset: number = 0): Promise<Array<{ id: number; name: string; url: string }>> {
  try {
    const response = await axios.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Array<{ name: string; url: string }>;
    }>(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

    // Extraire les IDs depuis les URLs
    return response.data.results.map((pokemon) => {
      const id = parseInt(pokemon.url.split('/').slice(-2, -1)[0]);
      return { id, name: pokemon.name, url: pokemon.url };
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des Pokémon:', error);
    throw error;
  }
}

// Fonction pour récupérer plusieurs Pokémon en parallèle (optimisé)
export async function getAllPokemon(limit: number = 1302, offset: number = 0): Promise<any[]> {
  try {
    const pokemonList = await getAllPokemonList(limit, offset);
    
    // Récupérer les détails par batch pour éviter de surcharger l'API
    const batchSize = 20;
    const batches: any[] = [];
    
    for (let i = 0; i < pokemonList.length; i += batchSize) {
      const batch = pokemonList.slice(i, i + batchSize);
      const batchPromises = batch.map((pokemon) => getPokemonByIdOrName(pokemon.id));
      const batchResults = await Promise.all(batchPromises);
      batches.push(...batchResults);
      
      // Petit délai pour respecter les limites de l'API
      if (i + batchSize < pokemonList.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return batches;
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des Pokémon:', error);
    throw error;
  }
}

// Fonction pour récupérer les espèces d'un Pokémon
export async function getPokemonSpecies(nameOrId: string | number): Promise<PokeApiSpecies> {
  try {
    const response = await axios.get<PokeApiSpecies>(
      `${POKEAPI_BASE_URL}/pokemon-species/${nameOrId}`
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des espèces:', error);
    throw error;
  }
}

// Fonction pour récupérer les informations d'un type
export async function getTypeInfo(typeName: string): Promise<PokeApiType> {
  try {
    const response = await axios.get<PokeApiType>(
      `${POKEAPI_BASE_URL}/type/${typeName}`
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du type:', error);
    throw error;
  }
}

// Fonction pour récupérer la chaîne d'évolution
export async function getEvolutionChain(chainId: number): Promise<PokeApiEvolutionChain> {
  try {
    const response = await axios.get<PokeApiEvolutionChain>(
      `${POKEAPI_BASE_URL}/evolution-chain/${chainId}`
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la chaîne d\'évolution:', error);
    throw error;
  }
}

// Fonction pour convertir les données PokéAPI vers notre format PokemonDetail
export async function convertToPokemonDetail(pokeApiData: PokeApiPokemon): Promise<any> {
  // Récupérer les espèces pour obtenir la génération et les évolutions
  const species = await getPokemonSpecies(pokeApiData.species.name);
  
  // Traduire le nom en français depuis les données de l'espèce
  const frenchName = species.names?.find((n: any) => n.language.name === 'fr')?.name 
    || translatePokemonNameSync(pokeApiData.name);
  
  // Extraire l'ID de la génération depuis l'URL
  const generationId = parseInt(species.generation.url.split('/').slice(-2, -1)[0]);
  
  // Convertir les stats
  const stats: any = {};
  pokeApiData.stats.forEach((stat) => {
    const statName = stat.stat.name;
    if (statName === 'hp') stats.HP = stat.base_stat;
    else if (statName === 'attack') stats.attack = stat.base_stat;
    else if (statName === 'defense') stats.defense = stat.base_stat;
    else if (statName === 'special-attack') stats.specialAttack = stat.base_stat;
    else if (statName === 'special-defense') stats.specialDefense = stat.base_stat;
    else if (statName === 'speed') stats.speed = stat.base_stat;
  });

  // Convertir les types
  const apiTypes = pokeApiData.types.map((type) => ({
    name: translateType(type.type.name),
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${type.type.name}.png`,
  }));

  // Récupérer les résistances pour le premier type
  let apiResistances: any[] = [];
  if (pokeApiData.types.length > 0) {
    try {
      const typeInfo = await getTypeInfo(pokeApiData.types[0].type.name);
      const damageRelations = typeInfo.damage_relations;
      
      // Convertir les relations de dégâts en résistances
      damageRelations.double_damage_from.forEach((type) => {
        apiResistances.push({
          name: translateType(type.name),
          damage_multiplier: 2,
          damage_relation: 'weak',
        });
      });
      
      damageRelations.half_damage_from.forEach((type) => {
        apiResistances.push({
          name: translateType(type.name),
          damage_multiplier: 0.5,
          damage_relation: 'resistant',
        });
      });
      
      damageRelations.no_damage_from.forEach((type) => {
        apiResistances.push({
          name: translateType(type.name),
          damage_multiplier: 0,
          damage_relation: 'immune',
        });
      });
      
      // Ajouter les types normaux (1x)
      const allTypes = Object.keys(TYPE_TRANSLATIONS);
      const coveredTypes = apiResistances.map(r => r.name.toLowerCase());
      allTypes.forEach((type) => {
        if (!coveredTypes.includes(type)) {
          apiResistances.push({
            name: translateType(type),
            damage_multiplier: 1,
            damage_relation: 'normal',
          });
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des résistances:', error);
    }
  }

  // Récupérer les évolutions
  let apiEvolutions: any[] = [];
  let apiPreEvolution: any = null;
  
  try {
    const evolutionChainId = parseInt(species.evolution_chain.url.split('/').slice(-2, -1)[0]);
    const evolutionChain = await getEvolutionChain(evolutionChainId);
    
    // Extraire les évolutions de la chaîne
    const extractEvolutions = async (chain: any, currentPokemonName: string): Promise<any[]> => {
      const evolutions: any[] = [];
      
      const evolutionPromises = chain.evolves_to.map(async (evolution: any) => {
        const evolutionName = evolution.species.name;
        if (evolutionName !== currentPokemonName) {
          // Trouver l'ID du Pokémon depuis son nom
          const evolutionId = parseInt(evolution.species.url.split('/').slice(-2, -1)[0]);
          // Récupérer les espèces pour obtenir le nom français
          try {
            const evolutionSpecies = await getPokemonSpecies(evolutionName);
            const evolutionFrenchName = evolutionSpecies.names?.find((n: any) => n.language.name === 'fr')?.name 
              || translatePokemonNameSync(evolutionName);
            return {
              name: evolutionFrenchName,
              pokedexId: evolutionId,
            };
          } catch (error) {
            return {
              name: translatePokemonNameSync(evolutionName),
              pokedexId: evolutionId,
            };
          }
        }
        return null;
      });
      
      const results = await Promise.all(evolutionPromises);
      return results.filter((evo): evo is any => evo !== null);
    };
    
    apiEvolutions = await extractEvolutions(evolutionChain.chain, pokeApiData.name);
    
    // Pré-évolution
    if (species.evolves_from_species) {
      const preEvolutionId = parseInt(species.evolves_from_species.url.split('/').slice(-2, -1)[0]);
      try {
        const preEvolutionSpecies = await getPokemonSpecies(species.evolves_from_species.name);
        const preEvolutionFrenchName = preEvolutionSpecies.names?.find((n: any) => n.language.name === 'fr')?.name 
          || translatePokemonNameSync(species.evolves_from_species.name);
        apiPreEvolution = {
          name: preEvolutionFrenchName,
          pokedexId: preEvolutionId,
        };
      } catch (error) {
        apiPreEvolution = {
          name: translatePokemonNameSync(species.evolves_from_species.name),
          pokedexId: preEvolutionId,
        };
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des évolutions:', error);
  }

  return {
    id: pokeApiData.id,
    pokedexId: pokeApiData.id,
    name: frenchName,
    slug: pokeApiData.name,
    image: pokeApiData.sprites.other?.['official-artwork']?.front_default || getPokemonImage(pokeApiData.id),
    sprite: pokeApiData.sprites.front_default || getPokemonSprite(pokeApiData.id),
    stats,
    apiTypes,
    apiGeneration: generationId,
    apiResistances,
    apiEvolutions,
    apiPreEvolution,
    apiResistancesWithAbilities: [],
    // Toutes les données brutes de PokéAPI
    rawData: {
      base_experience: pokeApiData.base_experience,
      height: pokeApiData.height,
      weight: pokeApiData.weight,
      order: pokeApiData.order,
      is_default: pokeApiData.is_default,
      abilities: pokeApiData.abilities,
      forms: pokeApiData.forms,
      game_indices: pokeApiData.game_indices,
      held_items: pokeApiData.held_items,
      location_area_encounters: pokeApiData.location_area_encounters,
      moves: pokeApiData.moves,
      sprites: pokeApiData.sprites,
      cries: pokeApiData.cries,
      species: pokeApiData.species,
      past_types: pokeApiData.past_types,
      past_abilities: pokeApiData.past_abilities,
      // Données de l'espèce
      speciesData: {
        base_happiness: species.base_happiness,
        capture_rate: species.capture_rate,
        color: species.color,
        egg_groups: species.egg_groups,
        evolution_chain: species.evolution_chain,
        evolves_from_species: species.evolves_from_species,
        flavor_text_entries: species.flavor_text_entries,
        form_descriptions: species.form_descriptions,
        forms_switchable: species.forms_switchable,
        gender_rate: species.gender_rate,
        genera: species.genera,
        generation: species.generation,
        growth_rate: species.growth_rate,
        habitat: species.habitat,
        has_gender_differences: species.has_gender_differences,
        hatch_counter: species.hatch_counter,
        is_baby: species.is_baby,
        is_legendary: species.is_legendary,
        is_mythical: species.is_mythical,
        names: species.names,
        order: species.order,
        pal_park_encounters: species.pal_park_encounters,
        pokedex_numbers: species.pokedex_numbers,
        shape: species.shape,
        varieties: species.varieties,
      },
    },
  };
}

