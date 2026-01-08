# Debug - Vérifications à faire

## Problèmes signalés :
1. Les lettres ne se grisent pas quand c'est faux
2. Les bonnes lettres apparaissent et disparaissent

## Corrections apportées :

1. **Lettres incorrectes** :
   - Ajout de la classe `incorrectLetter` avec style rouge
   - Utilisation de `!important` pour forcer l'application du style
   - Vérification que `incorrectLetters` est bien passé au composant

2. **Mot masqué** :
   - Amélioration du calcul pour gérer les espaces
   - Ajout de `white-space: pre-wrap` pour préserver les espaces
   - `text-align: center` pour un meilleur affichage

## Pour tester :

1. Ouvrir la console du navigateur (F12)
2. Vérifier s'il y a des erreurs
3. Tester en cliquant sur une lettre incorrecte
4. Vérifier que la lettre devient rouge
5. Tester en cliquant sur une lettre correcte
6. Vérifier que la lettre apparaît dans le mot masqué et reste visible

## Si ça ne fonctionne toujours pas :

Vérifier dans la console :
- `gameState.incorrectLetters` contient bien les lettres incorrectes
- `gameState.correctLetters` contient bien les lettres correctes
- `maskedWord` est bien calculé

