const PRODUCTS = [

  {
    id: "energy-bites",
    imageBase: "images/energy-bites",
    emoji: "🌿",
    badge: "BESTSELLER",
    name: "Energy Bites",
    tagline: "Traditional flavour — made for busy days",
    priceNow: 5,
    priceWas: 6.99,
    priceNote: "4 bites per box · approx. 150g",
    unit: "box (4 bites)",
    description: "Inspired by traditional recipes and handmade in small batches with jaggery, ghee, nuts, oats and a blend of four seeds. A nutty snack made for busy days.",
    benefits: ["⚡ Traditional recipes", "🌱 Naturally sweetened with jaggery", "Handmade in UK", "✅ Kids & adults love them"],
   ingredients: '<span class="ingredients-inline">Palm Jaggery (22.94%), Ghee (<strong>MILK</strong>) (14.34%), Chickpea Flour (12.99%), Whole <strong>WHEAT</strong> Flour (12.99%), <strong>OATS</strong> (12.99%), <strong>ALMONDS</strong> (5.16%), <strong>CASHEWS</strong> (5.16%), Water, Flax Seeds (2.01%), Pumpkin Seeds (2.01%), Sunflower Seeds (2.01%), <strong>SESAME</strong> Seeds (2.01%), Cardamom (0.23%).</span>',
    nutrition: "Approx. nutritional values per 100g: Energy 2030 kJ / 485 kcal | Fat 29g (of which saturates 10g) | Carbohydrates 44g (of which sugars 18g) | Fibre 7g | Protein 11g | Salt 0.05g",
    extraNote:
    "<strong>Allergy advice:</strong> For allergens, see ingredients in <strong>bold</strong>."
  },

  {
    id: "nutty-balls",
    imageBase: "images/nutty-balls",
    emoji: "✨",
    badge: "POPULAR",
    name: "Nutty Balls",
    tagline: "Tasty indulgence — for your sweet tooth",
    priceNow: 8,
    priceWas: 10,
    priceNote: "Net weight: 200 g",
    unit: "pack",
    description: "Made with dates, figs, almonds, cashews, walnuts and a blend of flax, pumpkin, sesame and sunflower seeds. Handmade in small batches for a rich, fruity and nutty taste.",
      benefits: [
    "🤲 Handmade in small batches",
    "✓ Made with dates & figs",
    "✓ Almonds, cashews & walnuts",
    "✓ Four-seed blend"
  ],

ingredients: '<span class="ingredients-inline">Dates (47.85%), Figs (Figs, Preservative: Potassium Sorbate) (9.57%), <strong>ALMONDS</strong> (7.66%), Flax Seeds (6.22%), Pumpkin Seeds (6.22%), <strong>SESAME</strong> Seeds (6.22%), Sunflower Seeds (6.22%), <strong>CASHEWS</strong> (5.74%), <strong>WALNUTS</strong> (3.83%), Cardamom (0.48%).</span>',

  nutrition: "Typical values per 100 g: Energy 1813 kJ / 434 kcal | Fat 22 g (of which saturates 3.0 g) | Carbohydrate 45 g (of which sugars 37 g) | Fibre 8.5 g | Protein 9.6 g | Salt 0.09 g",

    extraNote:
    "<strong>Allergy advice:</strong> For allergens, see ingredients in <strong>bold</strong>."
  },

  {
    id: "energy-mix",
    imageBase: "images/energy-mix",
    emoji: "🌸",
    name: "Energy Mix",
    tagline: "Traditional sweet wheat, nut & seed mix",
    priceNow: 7,
    priceWas: 9,
    priceNote: "Net weight: 250 g",
    unit: "pack",
    description: "A slow-roasted blend of wheat, ghee, nuts , seeds and warming spices — made the traditional way.",
benefits: [
  "🌿 Rooted in tradition",
  "🤲 Handmade in small batches",
  "🌰 Made with nuts & seeds",
  "✨ Rich, nutty & gently spiced"
],
   ingredients: '<span class="ingredients-inline">Whole <strong>WHEAT</strong> Flour (36.43%), Jaggery Powder (17.48%), Ghee (<strong>MILK</strong>) (16.39%), <strong>WHEAT</strong> Semolina (8.96%), <strong>ALMONDS</strong> (3.93%), <strong>CASHEWS</strong> (2.91%), <strong>WALNUTS</strong> (2.91%), Raisins (2.91%), Flax Seeds (1.78%), Pumpkin Seeds (1.78%), Sunflower Seeds (1.78%), <strong>SESAME</strong> Seeds (1.78%), Fox Nuts (0.44%), Cardamom (0.33%), Edible Gum (0.22%).</span>',

    nutrition: "Typical values per 100 g: Energy 2035 kJ / 487 kcal | Fat 26.2 g (of which saturates 11.0 g) | Carbohydrate 50.1 g (of which sugars 18.8 g) | Fibre 6.1 g | Protein 9.8 g | Salt 0.08 g",

    extraNote:
    "<strong>Allergy advice:</strong> For allergens, see ingredients in <strong>bold</strong>."
  },




  {
    id: "postpartum-delight",
    imageBase: "images/postpartum-delight",
    emoji: "🌸",
    name: "Postpartum Delight",
    tagline: "Traditional panjiri - A spiced mix of nuts, seeds and raisins made with wheat flour",
    priceNow: 35,
    priceWas: 42,
    priceNote: "1 Kg per pack",
    unit: "kg",
    description: "Inspired by traditional panjiri recipes and handmade in small batches with wheat, ghee, jaggery, nuts, seeds, raisins, edible gum, ginger, fenugreek, cardamom and Kamar Kas.",
    ingredients: "Almonds, Cashews, Walnuts, Ghee (Milk), Flax Seeds, Sunflower Seeds, Pumpkin Seeds, Sesame Seeds, Raisins, Edible Gum (Gond), Dry Ginger, Kamar Kas, Fenugreek Powder, Cardamom Powder, Wheat Flour (Gluten), Semolina (Gluten), Jaggery, Makhana (Fox Nuts).",
    nutrition: null,
    extraNote: "<strong>Allergy advice:</strong> For allergens, see ingredients in <strong>bold</strong>."
  },





  {
    id: "protein-bars",
    imageBase: "images/protein-bar",
    emoji: "💪",
    badge: "SALE",
    name: "Protein Bars",
    tagline: "Clean protein for workouts & recovery — no junk, just results",
    priceNow: 10,
    priceWas: 15,
    priceNote: "5 bars per pack · Special Price for Weekly Subscription",
    unit: "pack (5 bars)",
    description: "High-protein bars made with real ingredients — no refined sugar, no additives. Designed for post-workout recovery and daily protein intake. Tastes like a treat, fuels like a supplement.",
    benefits: ["💪 ~10-11g protein per bar", "🏋️ Perfect post-workout recovery", "🚫 No refined sugar or additives", "🌱 Real, whole food ingredients"],
    ingredients: "Whey Protein (Milk), Crunchy Peanut Butter, Oats, Dates, Honey, Mixed Seeds (Flax, Pumpkin, Sunflower, Melon), Chia Seeds, Cocoa Powder, Mixed Nuts (Almonds, Cashews, Walnuts), Almond Milk.",
    nutrition: null,
    extraNote: "Approx. 10–11g protein per bar"
  }

];
