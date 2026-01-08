# 🚀 Instructions d'Installation - Pendu Pokémon Next.js

## Prérequis

- Node.js 18+ installé
- pnpm installé globalement (`npm install -g pnpm`)

## Installation

1. **Naviguer dans le dossier du projet** :
```bash
cd pendu-pokemon-next
```

2. **Installer les dépendances avec pnpm** :
```bash
pnpm install
```

3. **Lancer le serveur de développement** :
```bash
pnpm dev
```

4. **Ouvrir dans le navigateur** :
   - L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Commandes Disponibles

- `pnpm dev` - Lance le serveur de développement
- `pnpm build` - Construit l'application pour la production
- `pnpm start` - Lance l'application en mode production
- `pnpm lint` - Vérifie le code avec ESLint
- `pnpm type-check` - Vérifie les types TypeScript

## Structure du Projet

```
pendu-pokemon-next/
├── app/                    # App Router Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   ├── page.module.css    # Styles de la page
│   └── globals.css        # Styles globaux
├── components/            # Composants React
│   ├── game/             # Composants du jeu
│   │   ├── LivesDisplay.tsx
│   │   └── GameModal.tsx
│   ├── letters/          # Composant clavier
│   │   └── Letters.tsx
│   └── pokemon/          # Composant Pokémon
│       └── PokemonSelector.tsx
├── hooks/                # Hooks personnalisés
│   ├── useGame.ts        # Logique du jeu
│   ├── usePokemon.ts     # Gestion des Pokémon
│   └── useKeyboard.ts    # Gestion du clavier
├── types/                # Types TypeScript
│   └── index.ts
├── utils/                # Utilitaires
│   └── game.ts
└── public/               # Assets statiques
    └── img/              # Images
```

## Améliorations par rapport à la version React

✅ **TypeScript** - Typage statique pour une meilleure maintenabilité  
✅ **Next.js App Router** - Architecture moderne et scalable  
✅ **CSS Modules** - Styles isolés par composant  
✅ **Hooks personnalisés** - Logique métier réutilisable  
✅ **Gestion d'état avec useReducer** - Plus prévisible et testable  
✅ **Composants modulaires** - Faciles à étendre et maintenir  
✅ **Optimisation des images** - Avec Next.js Image  
✅ **Meilleure gestion des erreurs** - Try/catch et états d'erreur  

## Notes

- Les images doivent être dans `public/img/`
- L'API Pokémon utilisée : `https://pokebuildapi.fr/api/v1/pokemon/limit/1302`
- Le projet utilise TypeScript strict mode

