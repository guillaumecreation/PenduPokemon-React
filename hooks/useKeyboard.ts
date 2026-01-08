"use client";

import { useEffect, useRef } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface UseKeyboardProps {
  onKeyPress: (letter: string) => void;
  disabledLetters: string[];
  enabled: boolean;
}

export function useKeyboard({
  onKeyPress,
  disabledLetters,
  enabled,
}: UseKeyboardProps) {
  const onKeyPressRef = useRef(onKeyPress);
  const disabledLettersRef = useRef(disabledLetters);

  // Mettre à jour les refs à chaque changement
  useEffect(() => {
    onKeyPressRef.current = onKeyPress;
    disabledLettersRef.current = disabledLetters;
  }, [onKeyPress, disabledLetters]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const letter = event.key.toUpperCase();

      // Vérifier que c'est une lettre de l'alphabet
      if (!ALPHABET.includes(letter)) return;

      // Vérifier que la lettre n'est pas déjà utilisée
      if (disabledLettersRef.current.includes(letter)) return;

      // Empêcher le comportement par défaut si c'est une lettre
      event.preventDefault();

      // Appeler la fonction callback
      onKeyPressRef.current(letter);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);
}
