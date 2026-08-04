type News = {
  value: string;
  title: string;
  description: string | string[];
};

export const news: News[] = [
  {
    value: "select",
    title: "Update UI/UX : Sélection de Pokémon",
    description:
      "J'ai changé la manière dont vous pouvez choisir un Pokémon. Vous pouvez désormais écrire un bout du nom du Pokémon dans la barre de recherche et des propositions apparaîtront en fonction. C'était une galère de fou avant avec le select html basique.",
  },
  {
    value: "status",
    title: "Update UI/UX : Statut de breed",
    description:
      'J\'ai ajouté un statut de breed ("Pas encore fait", "En cours", "Terminé") pour chaque oeuf dans l\'arbre généalogique. Ca sera un peu plus clair pour ceux qui en ont besoin. C\'est une fonctionnalité purement visuelle, vous pouvez complètement l\'ignorer si vous n\'en avez pas besoin.',
  },
  {
    value: "theme",
    title: "Update UI/UX : Dark mode",
    description: "Comme beaucoup l'ont demandé, j'ai enfin ajouté un dark mode. C'est fini les flashbangs ! d(´▽｀*)",
  },
];
