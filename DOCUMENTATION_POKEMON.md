# 📚 Documentation Complète - Informations sur les Pokémon

## 🌐 Source de Données

### API Utilisée
**PokéBuild API** : `https://pokebuildapi.fr/api/v1/pokemon`

### Endpoints Disponibles
- **Liste limitée** : `/limit/{nombre}` (ex: `/limit/1302` pour tous les Pokémon)
- **Par type** : `/type/{type}` (ex: `/type/feu`)
- **Par ID** : `/{id}` (ex: `/25` pour Pikachu)
- **Par slug/nom** : Recherche dans la liste complète

---

## 📋 Structure des Données Pokémon

### Informations de Base

```typescript
{
  id: number;                    // Identifiant unique
  pokedexId: number;             // Numéro dans le Pokédex (#001, #002, etc.)
  name: string;                  // Nom du Pokémon (ex: "Pikachu")
  slug: string;                  // Nom en format URL (ex: "pikachu")
  image: string;                 // URL de l'image officielle
  sprite: string;                // URL du sprite
}
```

### Types Pokémon

**18 types disponibles** :
- Normal
- Feu
- Eau
- Plante
- Électrik
- Glace
- Combat
- Poison
- Sol
- Vol
- Psy
- Insecte
- Roche
- Spectre
- Dragon
- Ténèbres
- Acier
- Fée

**Structure** :
```typescript
apiTypes: Array<{
  name: string;    // Nom du type
  image: string;   // URL de l'icône du type
}>
```

### Statistiques (Stats)

```typescript
stats: {
  HP: number;              // Points de vie (0-255)
  attack: number;          // Attaque (0-255)
  defense: number;         // Défense (0-255)
  specialAttack: number;   // Attaque spéciale (0-255)
  specialDefense: number; // Défense spéciale (0-255)
  speed: number;          // Vitesse (0-255)
}
```

**Total des stats** : Somme de toutes les statistiques (calculé automatiquement)

### Générations et Régions

**Génération** :
```typescript
apiGeneration: number;  // 1 à 8
```

**Régions disponibles** :

| Région | Génération | Limite Pokémon | PokedexId Range |
|--------|------------|----------------|-----------------|
| Kanto  | 1          | 151            | 1-151           |
| Johto  | 2          | 251            | 1-251           |
| Hoenn  | 3          | 386            | 1-386           |
| Sinnoh | 4          | 493            | 1-493           |
| Unova  | 5          | 649            | 1-649           |
| Kalos  | 6          | 721            | 1-721           |
| Alola  | 7          | 809            | 1-809           |
| Galar  | 8          | 898            | 1-898           |

### Résistances et Faiblesses

```typescript
apiResistances: Array<{
  name: string;                    // Type concerné
  damage_multiplier: number;       // 0, 0.5, 1, ou 2
  damage_relation: string;         // Relation de dégâts
}>

apiResistancesWithAbilities?: Array<{
  name: string;
  damage_multiplier: number;
  damage_relation: string;
}>
```

**Multiplicateurs de dégâts** :
- `0x` : Aucun dégât (immunité)
- `0.5x` : Résistant (demi-dégâts)
- `1x` : Normal
- `2x` : Faible (double dégâts)

### Évolutions

```typescript
apiEvolutions: Array<{
  name: string;        // Nom de l'évolution
  pokedexId: number;   // Numéro du Pokédex
}>

apiPreEvolution?: {
  name: string;
  pokedexId: number;
} | null
```

---

## 🎨 Couleurs des Types

Chaque type Pokémon a une couleur associée pour l'affichage :

| Type      | Code Couleur | Type      | Code Couleur |
|-----------|--------------|-----------|--------------|
| Normal    | `#A8A878`    | Vol       | `#A890F0`    |
| Feu       | `#F08030`    | Psy       | `#F85888`    |
| Eau       | `#6890F0`    | Insecte   | `#A8B820`    |
| Plante    | `#78C850`    | Roche     | `#B8A038`    |
| Électrik  | `#F8D030`    | Spectre   | `#705898`    |
| Glace     | `#98D8D8`    | Dragon    | `#7038F8`    |
| Combat    | `#C03028`    | Ténèbres  | `#705848`    |
| Poison    | `#A040A0`    | Acier     | `#B8B8D0`    |
| Sol       | `#E0C068`    | Fée       | `#EE99AC`    |

---

## 🔧 Hooks Disponibles

### `usePokemon(limit: number)`

Récupère un Pokémon aléatoire depuis l'API.

**Paramètres** :
- `limit` : Nombre maximum de Pokémon à considérer (défaut: 1302)

**Retour** :
```typescript
{
  pokemon: Pokemon | null;
  isLoading: boolean;
  error: string | null;
  fetchRandomPokemon: () => Promise<void>;
  resetPokemon: () => void;
}
```

**Usage** :
```typescript
const { pokemon, isLoading, fetchRandomPokemon } = usePokemon(1302);
```

---

### `usePokemonFilter(initialLimit: number)`

Récupère un Pokémon avec possibilité de filtrage par type ou limite.

**Paramètres** :
- `initialLimit` : Limite initiale (défaut: 1302)

**Retour** :
```typescript
{
  pokemon: Pokemon | null;
  isLoading: boolean;
  error: string | null;
  fetchByType: (type: PokemonType) => Promise<void>;
  fetchByLimit: (limit: number) => Promise<void>;
  selectedType: PokemonType | null;
  selectedLimit: number | null;
  resetPokemon: () => void;
}
```

**Usage** :
```typescript
const { pokemon, fetchByType, fetchByLimit } = usePokemonFilter(1302);

// Filtrer par type
await fetchByType('feu');

// Filtrer par limite
await fetchByLimit(151); // Kanto seulement
```

---

### `usePokedex()`

Gère le Pokédex complet avec filtres avancés.

**Retour** :
```typescript
{
  pokemonList: PokemonDetail[];        // Liste complète
  isLoading: boolean;
  error: string | null;
  filters: PokedexFilters;            // Filtres actuels
  setFilters: (filters: Partial<PokedexFilters>) => void;
  filteredPokemon: PokemonDetail[];   // Liste filtrée
  totalCount: number;                  // Nombre total
  fetchPokemon: () => Promise<void>;
}
```

**Filtres disponibles** :
```typescript
interface PokedexFilters {
  search: string;           // Recherche par nom/numéro
  type: string | null;      // Filtre par type
  generation: number | null; // Filtre par génération
  region: string | null;    // Filtre par région
}
```

**Usage** :
```typescript
const { filteredPokemon, filters, setFilters } = usePokedex();

// Rechercher
setFilters({ search: 'pikachu' });

// Filtrer par type
setFilters({ type: 'feu' });

// Filtrer par région
setFilters({ region: 'kanto' });

// Combiner les filtres
setFilters({ 
  type: 'eau', 
  generation: 1 
});
```

---

## 🧩 Composants Disponibles

### `PokemonSelector`

Composant pour sélectionner un Pokémon dans le jeu.

**Props** :
```typescript
interface PokemonSelectorProps {
  onPokemonSelected: (pokemon: Pokemon) => void;
  disabled?: boolean;
  limit?: number;
  type?: PokemonType | null;
  shouldFetchNew?: boolean;
  onPokemonFetched?: () => void;
}
```

**Fonctionnalités** :
- Bouton pour démarrer une partie
- Affichage de l'image du Pokémon sélectionné
- Animation de chargement avec Pokéball
- Gestion des erreurs avec bouton de réessai

---

### `PokemonCard`

Carte d'affichage d'un Pokémon dans la liste du Pokédex.

**Props** :
```typescript
interface PokemonCardProps {
  pokemon: PokemonDetail;
}
```

**Affichage** :
- Image du Pokémon
- Numéro du Pokédex (#001, #002, etc.)
- Nom du Pokémon
- Badges des types avec couleurs

**Comportement** :
- Clic pour naviguer vers la page de détail

---

### `PokemonDetailModal`

Modal affichant les détails complets d'un Pokémon.

**Props** :
```typescript
interface PokemonDetailModalProps {
  pokemon: PokemonDetail;
  isOpen: boolean;
  onClose: () => void;
}
```

**Informations affichées** :
- Image grande taille
- Numéro et nom
- Types avec badges colorés
- Statistiques complètes avec barres de progression
- Résistances et faiblesses
- Évolutions
- Pré-évolution (si existe)
- Génération

---

## 📁 Structure des Types TypeScript

### `Pokemon` (pour le jeu)

```typescript
interface Pokemon {
  name: string;                    // Nom du Pokémon
  imageUrl: string;                // URL de l'image
  type?: string | null;            // Type optionnel
  apiTypes?: Array<{ name: string }>;
}
```

### `PokemonDetail` (pour le Pokédex)

```typescript
interface PokemonDetail {
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
}
```

### `PokemonType`

```typescript
type PokemonType = 
  | 'normal' | 'feu' | 'eau' | 'plante' | 'électrik' | 'glace' 
  | 'combat' | 'poison' | 'sol' | 'vol' | 'psy' | 'insecte' 
  | 'roche' | 'spectre' | 'dragon' | 'ténèbres' | 'acier' | 'fée';
```

---

## 🎯 Fonctionnalités Implémentées

### ✅ Sélection de Pokémon
- Sélection aléatoire parmi une limite configurable
- Filtrage par type
- Filtrage par génération/région
- Recherche par nom ou numéro

### ✅ Affichage
- Cartes Pokémon dans une grille responsive
- Page de détail complète (`/pokedex/[id]`)
- Modal de détail avec toutes les informations
- Images optimisées avec Next.js Image

### ✅ Filtres
- Recherche textuelle (nom ou numéro)
- Filtre par type (18 types)
- Filtre par région (8 régions)
- Filtre par génération (1-8)
- Combinaison de filtres

### ✅ Statistiques
- Affichage avec barres de progression colorées
- Calcul automatique du total
- Code couleur selon la valeur :
  - Vert (> 70%) : Excellent
  - Jaune (> 40%) : Moyen
  - Rouge (≤ 40%) : Faible

### ✅ Résistances
- Affichage des multiplicateurs de dégâts
- Code couleur :
  - Vert : Résistant (< 1x)
  - Blanc : Normal (1x)
  - Rouge : Faible (> 1x)

---

## 📍 Routes Disponibles

- `/pokedex` : Liste complète du Pokédex avec filtres
- `/pokedex/[id]` : Page de détail d'un Pokémon spécifique
  - Recherche par ID numérique
  - Recherche par pokedexId
  - Recherche par slug
  - Recherche par nom

---

## 🔍 Exemples d'Utilisation

### Récupérer un Pokémon aléatoire

```typescript
import { usePokemon } from '@/hooks/usePokemon';

function MyComponent() {
  const { pokemon, isLoading, fetchRandomPokemon } = usePokemon(1302);
  
  useEffect(() => {
    fetchRandomPokemon();
  }, []);
  
  if (isLoading) return <div>Chargement...</div>;
  if (pokemon) return <div>{pokemon.name}</div>;
}
```

### Filtrer par type

```typescript
import { usePokemonFilter } from '@/hooks/usePokemonFilter';

function MyComponent() {
  const { pokemon, fetchByType } = usePokemonFilter();
  
  const handleFireType = async () => {
    await fetchByType('feu');
  };
  
  return <button onClick={handleFireType}>Pokémon Feu</button>;
}
```

### Utiliser le Pokédex avec filtres

```typescript
import { usePokedex } from '@/hooks/usePokedex';

function PokedexComponent() {
  const { filteredPokemon, setFilters } = usePokedex();
  
  return (
    <div>
      <input 
        onChange={(e) => setFilters({ search: e.target.value })}
        placeholder="Rechercher..."
      />
      {filteredPokemon.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
```

---

## 🐛 Gestion des Erreurs

Tous les hooks gèrent les cas d'erreur suivants :
- API indisponible
- Format de réponse invalide
- Pokémon non trouvé
- Aucun Pokémon correspondant aux filtres

Les erreurs sont affichées à l'utilisateur avec des messages clairs et des options de réessai.

---

## 📊 Limites et Contraintes

- **Maximum de Pokémon** : 1302 (limite de l'API)
- **Statistiques max** : 255 par stat
- **Générations** : 1 à 8
- **Types** : 18 types différents

---

## 🔗 Fichiers Clés

- **Types** : `types/pokedex.ts`, `types/index.ts`, `types/progression.ts`
- **Hooks** : `hooks/usePokemon.ts`, `hooks/usePokemonFilter.ts`, `hooks/usePokedex.ts`
- **Composants** : 
  - `components/pokemon/PokemonSelector.tsx`
  - `components/pokedex/PokemonCard.tsx`
  - `components/pokedex/PokemonDetailModal.tsx`
- **Pages** : 
  - `app/pokedex/page.tsx`
  - `app/pokedex/[id]/page.tsx`

---

**Dernière mise à jour** : Documentation complète de toutes les informations Pokémon disponibles dans le projet.

