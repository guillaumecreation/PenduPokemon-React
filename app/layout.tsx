import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jeu du Pendu - Pokémon',
  description: 'Devinez le nom du Pokémon dans ce jeu du pendu interactif',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

