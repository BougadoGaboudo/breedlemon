type News = {
  value: string;
  title: string;
  description: string | string[];
};

export const news: News[] = [
  {
    value: "item",
    title: "Update UX : Item IV",
    description:
      "Vous n'êtes désormais plus obligé de sélectionner un item IV pour vos Pokémon. Vous pouvez simplement renseigner toutes les infos des deux parents puis l'item IV sera automatiquement calculé et ajouté pour vous !",
  },
  {
    value: "region",
    title: "Formes régionales",
    description: [
      "Les formes régionales sont désormais présentes sur le site !",
      "Elles sont présentées de cette manière :",
      '- Goupix d\'Alola -> "Goupix (A)"',
      '- Darumarond de Galar -> "Darumarond (G)"',
      '- Farfuret de Hisui -> "Farfuret (H)"',
      '- Axoloto de Paldea -> "Axoloto (P)"',
    ],
  },
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
