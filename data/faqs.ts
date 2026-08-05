type Faq = {
  value: string;
  question: string;
  answer: string | string[];
};

export const faqs: Faq[] = [
  {
    value: "purpose",
    question: "A quoi sert Breedlemon ?",
    answer:
      "Breedlemon permet de visualiser plus facilement les étapes de breeding du Pokémon que tu souhaites produire.",
  },
  {
    value: "how",
    question: "Comment ça marche ?",
    answer: [
      "Deux options s'offrent à toi :",
      '- La première -> Clique sur le bouton "Breed les tous !" ou va dans l\'onglet "Arbre" pour planifier ton breeding depuis un arbre généalogique. Tu pourras créer des parents, produire les oeufs etc.',
      "- La deuxième -> Va dans l'onglet \"Inventaire\", renseigne tous les Pokémon que tu souhaites utiliser en tant que parents puis dirige toi vers l'onglet \"Arbre\" pour placer les parents dans les slots de ton choix. Tu pourras ensuite générer l'oeuf produit par un couple de parents et continuer le processus jusqu'à obtenir ton Pokémon avec les IVs visés.",
    ],
  },
  {
    value: "delete",
    question: "Comment supprimer un Pokémon ?",
    answer:
      'Tu peux supprimer un Pokémon en allant dans l\'onglet "Inventaire". Ici tu pourras modifier / supprimer le pokémon souhaité.',
  },
  {
    value: "save",
    question: 'A quoi servent les boutons "Exporter" et "Importer" ?',
    answer: [
      'En cliquant sur "Exporter", tu peux sauvegarder dans un fichier JSON tous tes Pokémon de l\'onglet "Inventaire" et ceux placés dans les slots de l\'onglet "Arbre".',
      'En cliquant sur "Importer", tu peux importer le fichier JSON généré par l\'export et récupérer tous tes Pokémon.',
      "Cette fonctionnalité est utile si tu changes de navigateur, si tu souhaites partager tes breeds avec d'autres personnes ou si tu souhaites garder une trace de tes précédents breeds.",
    ],
  },
];
