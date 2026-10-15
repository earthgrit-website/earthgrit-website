const PRODUCTS = [

  {
    id: "energy-bites",
    imageBase: "images/energy-bites",
    emoji: "🌿",
    badge: "BESTSELLER",
    name: "Energy Bites",
    tagline: "Everyday energy — no sugar crash, no compromises",
    priceNow: 5,
    priceWas: 6.99,
    priceNote: "4 bites per box · approx. 150g",
    unit: "box (4 bites)",
    description: "Built for busy days when you need real, lasting energy. Made with nuts, seeds, and jaggery — no refined sugar, no crash. Just clean fuel that keeps you going.",
    benefits: ["⚡ Long-lasting energy — no crash", "🌱 Naturally sweetened with jaggery", "🚫 No refined sugar or preservatives", "✅ Kids & adults love them"],
    ingredients: "Clarified Butter, Almonds, Cashew, Flax Seeds, Pumpkin Seeds, Sunflower Seeds, Sesame Seeds, Oats, Chickpea Flour, Whole Wheat Flour, Jaggery.",
    nutrition: "Approx. nutritional values per 100g: Energy 2030 kJ / 485 kcal | Fat 29g (of which saturates 10g) | Carbohydrates 44g (of which sugars 18g) | Fibre 7g | Protein 11g | Salt 0.05g",
    extraNote: ""
  },

  {
    id: "nutty-balls",
    imageBase: "images/nutty-balls",
    emoji: "🥜",
    badge: "POPULAR",
    name: "Nutty Balls",
    tagline: "Healthy indulgence — satisfy your sweet tooth, guilt-free",
    priceNow: 8,
    priceWas: 10,
    priceNote: "200g per pack",
    unit: "pack",
    description: "Rich, nut-loaded balls naturally sweetened with dates and figs — no refined sugar. A treat the whole family can enjoy without the guilt. Perfect when you want something sweet but real.",
    benefits: ["🍬 Satisfies sweet cravings naturally", "🥜 Loaded with almonds, cashews & walnuts", "🚫 No refined sugar — sweetened with dates & figs", "👨‍👩‍👧 Loved by kids & adults alike"],
    ingredients: "Almond, Cashew, Walnuts, Flax Seeds, Pumpkin Seeds, Sesame Seeds, Sunflower Seeds, Dates, Fig.",
    nutrition: "Approx. nutritional values per 100g: Energy 2090 kJ / 500 kcal | Fat 26g (of which saturates 6.5g) | Carbohydrates 58g (of which sugars 38g) | Fibre 7.5g | Protein 9.5g | Salt 0.05g",
    extraNote: ""
  },

  {
    id: "energy-mix",
    imageBase: "images/energy-mix",
    emoji: "🌸",
    name: "Energy Mix",
    tagline: "Traditional winter superfood — warming, nourishing, real",
    priceNow: 7,
    priceWas: 9,
    priceNote: "250g per pack",
    unit: "pack",
    description: "A slow-roasted blend of wheat, ghee, nuts and warming spices — made the traditional way. Perfect as a postpartum comfort food or a nourishing winter snack. No preservatives, no shortcuts.",
    benefits: ["🔥 Warming & deeply nourishing", "🤱 Ideal postpartum comfort food", "🌰 Loaded with nuts & seeds", "🚫 No preservatives or artificial ingredients"],
    ingredients: "Almonds, Cashews, Walnuts, Flax seeds, Pumpkin seeds, Sesame seeds, Sunflower seeds, Raisin, Wholewheat flour, Semolina, Jaggery, Clarified butter (Milk), Cardamom, Lotus seeds, Edible gum.",
    nutrition: null,
    extraNote: ""
  },

  {
    id: "postpartum-delight",
    imageBase: "images/postpartum-delight",
    emoji: "🌸",
    name: "Postpartum Delight",
    tagline: "A spiced mix of nuts, seeds and raisins made with wheat flour",
    priceNow: 35,
    priceWas: 42,
    priceNote: "1kg per pack",
    unit: "kg",
    description: "Inspired by traditional panjiri recipes and handmade in small batches with wheat, ghee, jaggery, nuts, seeds, raisins, edible gum, ginger, fenugreek, cardamom and Kamar Kas.",

    ingredients: "Almonds, Cashews, Walnuts, Ghee (Milk), Flax Seeds, Sunflower Seeds, Pumpkin Seeds, Sesame Seeds, Raisins, Edible Gum (Gond), Dry Ginger, Kamar Kas, Fenugreek Powder, Cardamom Powder, Wheat Flour (Gluten), Semolina (Gluten), Jaggery, Makhana (Fox Nuts).",
    nutrition: null,
    extraNote: ""
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
  },

  {
    id: "golden-pinni",
    imageBase: "images/golden-pinni",
    emoji: "💪",
    badge: "NEW",
    name: "Golden Pinni",
    tagline: "Traditional Punjabi Sweet made with Wheat, Nuts & Jaggery",
    priceNow: 7,
    priceWas: 9,
    priceNote: "180g per pack",
    unit: "pack",
    description: "Traditional Wheat & Nut Sweet with Jaggery & Ghee",

    ingredients: "Atta (WHEAT Flour) (36.06%), Jaggery (24.04%), Ghee (MILK) (15.02%), ALMONDS (9.01%), CASHEWS (6.01%), Raisins (6.01%), Melon Seeds (3.00%), Cardamom (0.60%), Edible Gum (Gond) (0.24%).",
    nutrition: "Typical values per 100 g: Energy 1943 kJ / 463 kcal | Fat 24.3 g (of which saturates 10.7 g) | Carbohydrate 52.5 g (of which sugars 26.7 g) | Fibre 6.8 g | Protein 8.7 g | Salt 0.10 g",
    extraNote: ""
  }

];