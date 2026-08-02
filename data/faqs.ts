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
      '- La première -> Clique sur le bouton "Let\'s Breed !" ou va dans l\'onglet "Arbre" pour planifier ton breeding depuis un arbre généalogique. Tu pourras créer des parents, produire les oeufs etc.',
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
    value: "dev",
    question: "Message du dev",
    answer:
      "J'ai pas totalement fini l'UI pour le moment et je compte ajouter un dark mode dès que possible ! d(´▽｀*)",
  },
];
