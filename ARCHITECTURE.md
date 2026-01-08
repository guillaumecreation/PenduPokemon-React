# 🏗️ Architecture du Projet - Pendu Pokémon Next.js

## Vue d'ensemble

Cette application est une refonte scalable de l'application React originale, construite avec **Next.js 14**, **TypeScript** et **pnpm**. Elle reprend toutes les fonctionnalités de l'application originale tout en ajoutant une architecture moderne et maintenable.

## 🎯 Fonctionnalités Implémentées

✅ Toutes les fonctionnalités de l'application originale :
- Sélection aléatoire de Pokémon via API
- Clavier virtuel avec 26 lettres
- Support du clavier physique
- Système de vies (7 vies)
- Détection de victoire/défaite
- Affichage du mot masqué
- Design responsive

## 🚀 Améliorations Architecturales

### 1. **TypeScript**
- Typage statique pour une meilleure maintenabilité
- Interfaces et types définis dans `types/index.ts`
- Détection d'erreurs à la compilation
- Meilleure autocomplétion dans l'IDE

### 2. **Next.js App Router**
- Architecture moderne avec App Router (Next.js 14+)
- Server Components et Client Components séparés
- Optimisation automatique des images avec `next/image`
- Routing intégré

### 3. **Gestion d'État avec useReducer**
- Logique centralisée dans `hooks/useGame.ts`
- Actions typées pour une meilleure prévisibilité
- Plus facile à tester et déboguer
- État immuable

### 4. **Hooks Personnalisés**
- **`useGame`** : Gère toute la logique du jeu
- **`usePokemon`** : Gère les appels API et l'état des Pokémon
- **`useKeyboard`** : Gère les événements clavier
- Logique réutilisable et testable

### 5. **CSS Modules**
- Styles isolés par composant
- Pas de conflits de noms de classes
- Meilleure organisation
- Support TypeScript pour les classes CSS

### 6. **Structure Modulaire**
```
components/
  ├── game/          # Composants spécifiques au jeu
  ├── letters/       # Composant clavier
  └── pokemon/       # Composant sélection Pokémon
```

### 7. **Utilitaires Séparés**
- Fonctions utilitaires dans `utils/game.ts`
- Logique métier réutilisable
- Facile à tester unitairement

### 8. **Gestion d'Erreurs Améliorée**
- Try/catch dans les appels API
- États d'erreur dans les hooks
- Messages d'erreur utilisateur
- Retry automatique possible

### 9. **Accessibilité**
- Attributs ARIA sur les éléments interactifs
- Labels descriptifs
- Navigation au clavier améliorée

### 10. **Performance**
- Optimisation des images avec Next.js Image
- Lazy loading des images
- Code splitting automatique
- CSS Modules pour un CSS plus léger

## 📁 Structure des Fichiers

```
pendu-pokemon-next/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout racine avec metadata
│   ├── page.tsx                 # Page principale (Client Component)
│   ├── page.module.css          # Styles de la page
│   └── globals.css              # Styles globaux
│
├── components/                   # Composants React
│   ├── game/
│   │   ├── LivesDisplay.tsx     # Affichage des vies
│   │   ├── LivesDisplay.module.css
│   │   ├── GameModal.tsx        # Modal de fin de partie
│   │   └── GameModal.module.css
│   ├── letters/
│   │   ├── Letters.tsx          # Clavier de lettres
│   │   └── Letters.module.css
│   └── pokemon/
│       ├── PokemonSelector.tsx  # Sélection Pokémon
│       └── PokemonSelector.module.css
│
├── hooks/                        # Hooks personnalisés
│   ├── useGame.ts              # Logique principale du jeu
│   ├── usePokemon.ts           # Gestion des Pokémon
│   └── useKeyboard.ts          # Gestion du clavier
│
├── types/                        # Types TypeScript
│   └── index.ts                # Tous les types/interfaces
│
├── utils/                        # Utilitaires
│   └── game.ts                 # Fonctions utilitaires du jeu
│
└── public/                       # Assets statiques
    └── img/                     # Images
```

## 🔄 Flux de Données

```
Page (page.tsx)
  ↓
useGame Hook
  ├── gameState (useReducer)
  ├── selectLetter()
  ├── selectPokemon()
  └── resetGame()
  ↓
Composants
  ├── PokemonSelector → usePokemon → API
  ├── Letters → useKeyboard → Events
  ├── LivesDisplay → gameState.lives
  └── GameModal → gameState.gameStatus
```

## 🎨 Styling

- **CSS Modules** : Styles isolés par composant
- **Globals CSS** : Styles globaux (polices, reset, background)
- **Responsive** : Media queries pour mobile/tablette/desktop
- **Animations** : Transitions et animations CSS

## 🧪 Scalabilité

### Facilement Extensible

1. **Nouveaux composants** : Ajouter dans `components/`
2. **Nouvelle logique** : Créer un hook dans `hooks/`
3. **Nouveaux types** : Ajouter dans `types/index.ts`
4. **Nouvelles pages** : Créer dans `app/`

### Exemples d'Extensions Possibles

- ✨ Système de scores/high scores
- 📊 Statistiques de jeu
- 🎯 Niveaux de difficulté
- 👥 Mode multijoueur
- 💾 Sauvegarde locale (localStorage)
- 🌐 Internationalisation (i18n)
- 🎨 Thèmes personnalisables
- 📱 PWA (Progressive Web App)

## 🔧 Technologies Utilisées

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **React 18** - Bibliothèque UI
- **Axios** - Client HTTP
- **CSS Modules** - Styles modulaires
- **pnpm** - Gestionnaire de paquets

## 📝 Bonnes Pratiques Appliquées

1. ✅ Séparation des responsabilités
2. ✅ Composants réutilisables
3. ✅ Hooks personnalisés pour la logique métier
4. ✅ Types TypeScript partout
5. ✅ Gestion d'erreurs robuste
6. ✅ Code modulaire et organisé
7. ✅ Performance optimisée
8. ✅ Accessibilité prise en compte

## 🚀 Prochaines Étapes Possibles

1. Ajouter des tests unitaires (Jest, React Testing Library)
2. Ajouter des tests E2E (Playwright, Cypress)
3. Implémenter un système de cache pour l'API
4. Ajouter un système de routing pour différentes pages
5. Optimiser les performances avec React.memo
6. Ajouter un système de logging
7. Implémenter un state management global (Zustand, Jotai) si nécessaire

