# Migration vers PokéAPI v2

## ✅ Changements effectués

### 1. Nouveau service API (`services/pokeapi.ts`)

Création d'un service centralisé pour interagir avec **PokéAPI v2** (`https://pokeapi.co/api/v2`).

**Fonctionnalités principales :**
- ✅ Traduction automatique des noms de Pokémon en français
- ✅ Traduction des types Pokémon en français
- ✅ Conversion des données PokéAPI vers notre format `PokemonDetail`
- ✅ Gestion des évolutions et pré-évolutions
- ✅ Calcul des résistances et faiblesses
- ✅ Récupération des images officielles

**Fonctions principales :**
- `getPokemonByIdOrName()` - Récupère un Pokémon par ID ou nom
- `getAllPokemonList()` - Récupère la liste de tous les Pokémon (métadonnées seulement)
- `getAllPokemon()` - Récupère tous les Pokémon avec détails (par batch)
- `convertToPokemonDetail()` - Convertit les données PokéAPI vers notre format
- `translatePokemonNameSync()` - Traduit un nom de Pokémon en français
- `translateType()` - Traduit un type en français

### 2. Hooks mis à jour

#### `usePokedex.ts`
- ✅ Utilise maintenant `getAllPokemonList()` et `convertToPokemonDetail()`
- ✅ Charge les Pokémon par batch pour optimiser les performances
- ✅ Traduction automatique en français

#### `usePokemon.ts`
- ✅ Utilise `getAllPokemonList()` pour la sélection aléatoire
- ✅ Récupère les détails seulement pour le Pokémon sélectionné
- ✅ Traduction automatique en français

#### `usePokemonFilter.ts`
- ✅ Utilise l'endpoint `/type/{type}` de PokéAPI v2
- ✅ Filtre par type directement via l'API
- ✅ Traduction automatique en français

### 3. Page de détail (`app/pokedex/[id]/page.tsx`)
- ✅ Utilise `getPokemonByIdOrName()` et `convertToPokemonDetail()`
- ✅ Récupère les évolutions depuis la chaîne d'évolution
- ✅ Traduction automatique en français

### 4. Configuration Next.js
- ✅ Ajout de `pokeapi.co` dans les domaines autorisés pour les images

## 🔄 Différences avec l'ancienne API

### PokéBuild API (ancienne)
- Endpoint unique : `/limit/1302`
- Données pré-formatées
- Noms déjà en français
- Plus simple mais moins standard

### PokéAPI v2 (nouvelle)
- Structure REST standardisée
- Données en anglais (traduites automatiquement)
- Plus de ressources disponibles
- Nécessite plusieurs appels API pour des données complètes
- Plus standard et maintenu activement

## 📝 Traductions

Le système de traduction utilise :
1. **Noms français depuis l'API** : PokéAPI fournit des traductions multilingues dans `pokemon-species.names`
2. **Dictionnaire de fallback** : Si la traduction n'est pas disponible dans l'API, utilise un dictionnaire local
3. **Types traduits** : Mapping direct des types anglais vers français

## 🚀 Optimisations

- **Chargement par batch** : Les Pokémon sont chargés par groupes de 20 pour éviter de surcharger l'API
- **Lazy loading** : Les détails complets ne sont chargés que quand nécessaire
- **Cache** : Les données sont mises en cache dans le state React

## ⚠️ Notes importantes

1. **Performance** : Le chargement initial peut être plus lent car PokéAPI nécessite plusieurs appels
2. **Rate limiting** : PokéAPI n'a pas de rate limiting strict mais il faut être respectueux
3. **Traductions** : Certains Pokémon peuvent ne pas avoir de traduction française dans l'API (utilise le fallback)

## 🔧 Améliorations futures possibles

- [ ] Mise en cache locale des traductions
- [ ] Chargement progressif de la liste du Pokédex
- [ ] Service Worker pour le cache offline
- [ ] Optimisation des appels API avec batching intelligent


