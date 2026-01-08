# 🎮 Pendu Pokémon - Next.js

Version scalable du jeu du Pendu Pokémon construite avec Next.js 14, TypeScript et pnpm.

## 🚀 Démarrage

### Prérequis

- Node.js 18+ 
- pnpm (installer avec `npm install -g pnpm`)

### Installation

```bash
# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev

# Build pour la production
pnpm build

# Démarrer en production
pnpm start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Structure du projet

```
pendu-pokemon-next/
├── app/                    # App Router Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── components/            # Composants React
│   ├── game/             # Composants du jeu
│   ├── letters/          # Composant clavier
│   └── pokemon/          # Composant Pokémon
├── hooks/                # Hooks personnalisés
├── types/                # Types TypeScript
├── utils/                # Utilitaires
└── public/               # Assets statiques
```

### Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique pour la scalabilité
- **CSS Modules** - Styles scoped par composant
- **Axios** - Client HTTP pour les appels API
- **pnpm** - Gestionnaire de paquets rapide et efficace

## ✨ Fonctionnalités

- 🎯 Sélection aléatoire de Pokémon via API
- ⌨️ Support clavier virtuel et physique
- ❤️ Système de vies (7 vies)
- 🎉 Détection de victoire/défaite
- 📱 Design responsive
- 🎨 Interface moderne et attrayante

## 🔧 Développement

Le code est organisé de manière modulaire et scalable :

- **Hooks personnalisés** : Logique métier réutilisable
- **Types TypeScript** : Sécurité de type
- **Composants modulaires** : Faciles à maintenir et étendre
- **CSS Modules** : Styles isolés par composant

