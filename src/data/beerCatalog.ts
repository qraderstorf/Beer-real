export interface PreloadedBeer {
  name: string;
  style: string;
  abv: string;
}

export const PRELOADED_BEERS: PreloadedBeer[] = [
  // Irish & British Stouts / Ales
  { name: "Guinness Draught", style: "Stout", abv: "4.2" },
  { name: "Guinness Extra Stout", style: "Stout", abv: "5.6" },
  { name: "Guinness Foreign Extra Stout", style: "Stout", abv: "7.5" },
  { name: "Murphy's Irish Stout", style: "Stout", abv: "4.0" },
  { name: "Beamish Irish Stout", style: "Stout", abv: "4.1" },
  { name: "Kilkenny Irish Cream Ale", style: "Belgian", abv: "4.3" },
  { name: "Smithwick's Red Ale", style: "Pale Ale", abv: "4.5" },
  { name: "Newcastle Brown Ale", style: "Porter", abv: "4.7" },
  { name: "Boddingtons Pub Ale", style: "Pale Ale", abv: "4.7" },

  // Famous IPAs & Double IPAs
  { name: "Heady Topper", style: "IPA", abv: "8.0" },
  { name: "Focal Banger", style: "IPA", abv: "7.0" },
  { name: "Pliny the Elder", style: "IPA", abv: "8.0" },
  { name: "Pliny the Younger", style: "IPA", abv: "10.2" },
  { name: "Elysian Space Dust IPA", style: "IPA", abv: "8.2" },
  { name: "Bell's Two Hearted Ale", style: "IPA", abv: "7.0" },
  { name: "Lagunitas IPA", style: "IPA", abv: "6.2" },
  { name: "Lagunitas Little Sumpin' Sumpin'", style: "IPA", abv: "7.5" },
  { name: "Stone IPA", style: "IPA", abv: "6.9" },
  { name: "Stone Delicious IPA", style: "IPA", abv: "7.7" },
  { name: "Founders All Day IPA", style: "IPA", abv: "4.7" },
  { name: "Dogfish Head 60 Minute IPA", style: "IPA", abv: "6.0" },
  { name: "Dogfish Head 90 Minute IPA", style: "IPA", abv: "9.0" },
  { name: "Goose Island IPA", style: "IPA", abv: "5.9" },
  { name: "Tree House Julius", style: "Hazy IPA", abv: "6.8" },
  { name: "Tree House Haze", style: "Hazy IPA", abv: "8.2" },
  { name: "Juice Bomb Hazy IPA", style: "Hazy IPA", abv: "6.5" },
  { name: "Sierra Nevada Hazy Little Thing", style: "Hazy IPA", abv: "6.7" },
  { name: "Deschutes Fresh Squeezed IPA", style: "IPA", abv: "6.4" },
  { name: "Firestone Walker Luponic Distortion", style: "IPA", abv: "5.9" },
  { name: "BrewDog Punk IPA", style: "IPA", abv: "5.4" },
  { name: "Russian River Blind Pig IPA", style: "IPA", abv: "6.25" },

  // Popular American Lagers & Light Beers
  { name: "Bud Light", style: "Lager", abv: "4.2" },
  { name: "Budweiser", style: "Lager", abv: "5.0" },
  { name: "Coors Light", style: "Lager", abv: "4.2" },
  { name: "Coors Banquet", style: "Lager", abv: "5.0" },
  { name: "Miller Lite", style: "Lager", abv: "4.2" },
  { name: "Miller High Life", style: "Lager", abv: "4.6" },
  { name: "Michelob Ultra", style: "Lager", abv: "4.2" },
  { name: "Pabst Blue Ribbon", style: "Lager", abv: "4.8" },
  { name: "Yuengling Traditional Lager", style: "Lager", abv: "4.5" },
  { name: "Samuel Adams Boston Lager", style: "Lager", abv: "5.0" },
  { name: "Firestone Walker 805", style: "Lager", abv: "4.7" },
  { name: "Montauk Wave Chaser IPA", style: "IPA", abv: "6.4" },

  // Mexican Lagers
  { name: "Modelo Especial", style: "Lager", abv: "4.4" },
  { name: "Negra Modelo", style: "Lager", abv: "5.4" },
  { name: "Corona Extra", style: "Lager", abv: "4.6" },
  { name: "Corona Light", style: "Lager", abv: "4.0" },
  { name: "Corona Premier", style: "Lager", abv: "4.0" },
  { name: "Pacifico Clara", style: "Lager", abv: "4.5" },
  { name: "Dos Equis Lager Especial", style: "Lager", abv: "4.2" },
  { name: "Tecate Original", style: "Lager", abv: "4.5" },
  { name: "Sol Cerveza", style: "Lager", abv: "4.5" },
  { name: "Estrella Jalisco", style: "Lager", abv: "4.5" },

  // European & International Lagers / Pilsners
  { name: "Stella Artois", style: "Lager", abv: "5.0" },
  { name: "Heineken", style: "Lager", abv: "5.0" },
  { name: "Peroni Nastro Azzurro", style: "Lager", abv: "5.1" },
  { name: "Pilsner Urquell", style: "Pilsner", abv: "4.4" },
  { name: "Rothaus Pils", style: "Pilsner", abv: "5.1" },
  { name: "Trumer Pils", style: "Pilsner", abv: "4.9" },
  { name: "Estrella Galicia", style: "Lager", abv: "5.5" },
  { name: "Carlsberg Elephant", style: "Lager", abv: "7.2" },
  { name: "Carlsberg Pilsner", style: "Lager", abv: "5.0" },
  { name: "Kronenbourg 1664", style: "Lager", abv: "5.5" },
  { name: "Birra Moretti", style: "Lager", abv: "4.6" },
  { name: "San Miguel Pale Pilsen", style: "Pilsner", abv: "5.0" },
  { name: "Asahi Super Dry", style: "Lager", abv: "5.0" },
  { name: "Sapporo Premium Beer", style: "Lager", abv: "4.9" },
  { name: "Tsingtao", style: "Lager", abv: "4.7" },
  { name: "Singha Premium Import", style: "Lager", abv: "5.0" },
  { name: "Chang Beer", style: "Lager", abv: "5.0" },
  { name: "Kona Big Wave Golden Ale", style: "Pale Ale", abv: "4.4" },

  // Wheat Beers & Belgians
  { name: "Blue Moon Belgian White", style: "Wheat", abv: "5.4" },
  { name: "Allagash White", style: "Wheat", abv: "5.2" },
  { name: "Shock Top Belgian White", style: "Wheat", abv: "5.2" },
  { name: "Weihenstephaner Hefeweissbier", style: "Wheat", abv: "5.4" },
  { name: "Paulaner Hefe-Weizen", style: "Wheat", abv: "5.5" },
  { name: "Franziskaner Hefe-Weissbier", style: "Wheat", abv: "5.0" },
  { name: "Hoegaarden Original Witbier", style: "Wheat", abv: "4.9" },
  { name: "Schneider Weisse Aventinus", style: "Wheat", abv: "8.2" },
  { name: "Duvel Belgian Strong Blonde", style: "Belgian", abv: "8.5" },
  { name: "Delirium Tremens", style: "Belgian", abv: "8.5" },
  { name: "Delirium Nocturnum", style: "Belgian", abv: "8.5" },
  { name: "Chimay Red (Première)", style: "Belgian", abv: "7.0" },
  { name: "Chimay Blue (Grande Réserve)", style: "Belgian", abv: "9.0" },
  { name: "La Chouffe Blonde", style: "Belgian", abv: "8.0" },
  { name: "Westmalle Trappist Tripel", style: "Belgian", abv: "9.5" },
  { name: "Unibroue Maudite", style: "Belgian", abv: "8.0" },

  // Pale Ales, Porters & Stouts
  { name: "Sierra Nevada Pale Ale", style: "Pale Ale", abv: "5.6" },
  { name: "Sierra Nevada Torpedo Extra IPA", style: "IPA", abv: "7.2" },
  { name: "Fat Tire Ale", style: "Pale Ale", abv: "5.2" },
  { name: "Anchor Steam Beer", style: "Pale Ale", abv: "4.9" },
  { name: "Left Hand Milk Stout Nitro", style: "Stout", abv: "6.0" },
  { name: "Founders KBS (Kentucky Breakfast Stout)", style: "Stout", abv: "12.0" },
  { name: "Goose Island Bourbon County Stout", style: "Stout", abv: "14.7" },
  { name: "Deschutes Black Butte Porter", style: "Porter", abv: "5.5" },
  { name: "Great Lakes Edmund Fitzgerald Porter", style: "Porter", abv: "6.0" },
  { name: "Soulcraft Dark Matter Stout", style: "Stout", abv: "6.8" },

  // Sours, Ciders & Non-Alcoholic
  { name: "Duchesse de Bourgogne", style: "Sour", abv: "6.2" },
  { name: "Rodenbach Grand Cru", style: "Sour", abv: "6.0" },
  { name: "Dogfish Head SeaQuench Ale", style: "Sour", abv: "4.9" },
  { name: "Angry Orchard Crisp Apple Cider", style: "Cider", abv: "5.0" },
  { name: "Downeast Unfiltered Cider", style: "Cider", abv: "5.1" },
  { name: "Austin Eastciders Original Dry Cider", style: "Cider", abv: "5.0" },
  { name: "Pineapple Cider", style: "Cider", abv: "5.0" },
  { name: "Athletic Brewing Run Wild IPA (N/A)", style: "Other", abv: "0.5" },
  { name: "Guinness 0.0", style: "Stout", abv: "0.0" },
  { name: "Heineken 0.0", style: "Lager", abv: "0.0" }
];

/**
 * Normalizes user-submitted or friend-logged beer names into clean, uniform master titles.
 * Also returns proper default style & abv if matched or corrected.
 */
export function normalizeBeerName(rawName: string): {
  name: string;
  style?: string;
  abv?: number;
} {
  if (!rawName) return { name: "House Draft", style: "Lager", abv: 5.0 };

  const trimmed = rawName.trim();
  const lower = trimmed.toLowerCase().replace(/[\!\?\.\,]/g, "");

  // 1. Generic or non-beer / trolling / typo cleans
  if (
    lower === "beer" ||
    lower === "its beer" ||
    lower === "bad" ||
    lower === "unnamed pint" ||
    lower === "we back" ||
    lower.includes("creatine") ||
    lower.includes("ballzzzzzzz") ||
    lower === "somkindapils"
  ) {
    return { name: "House Lager", style: "Lager", abv: 5.0 };
  }

  if (lower === "cocktail") {
    return { name: "Craft Cocktail", style: "Other", abv: 12.0 };
  }

  if (lower === "la vielle ferme") {
    return { name: "House Wine", style: "Other", abv: 12.5 };
  }

  if (lower === "pint of pina") {
    return { name: "Pineapple Cider", style: "Cider", abv: 5.0 };
  }

  // 2. Hazys & Misspellings
  if (
    lower === "hazyyyyy" ||
    lower === "haazzzyyy" ||
    lower === "hazzzyyy" ||
    lower === "hazy" ||
    lower === "house beer hazy ipa"
  ) {
    return { name: "House Hazy IPA", style: "Hazy IPA", abv: 6.5 };
  }

  // 3. Modelos & typos
  if (
    lower === "modelo" ||
    lower === "model0" ||
    lower === "not modelo" ||
    lower === "modelo especial"
  ) {
    return { name: "Modelo Especial", style: "Lager", abv: 4.4 };
  }

  // 4. Guinness variations
  if (
    lower === "guinness" ||
    lower === "guinness draft" ||
    lower === "vitamin g" ||
    lower === "guinness draught"
  ) {
    return { name: "Guinness Draught", style: "Stout", abv: 4.2 };
  }

  // 5. Trumer / Truuuuman
  if (lower.includes("trumer") || lower.includes("truuuuman")) {
    return { name: "Trumer Pils", style: "Pilsner", abv: 4.9 };
  }

  // 6. 805 / Firestone
  if (lower === "805" || lower.includes("firestone 805")) {
    return { name: "Firestone Walker 805", style: "Lager", abv: 4.7 };
  }

  // 7. Miller Lite
  if (lower === "miller lite" || lower === "miller light") {
    return { name: "Miller Lite", style: "Lager", abv: 4.2 };
  }

  // 8. Lagunitas
  if (lower === "lagunitas") {
    return { name: "Lagunitas IPA", style: "IPA", abv: 6.2 };
  }

  // 9. Pacifico
  if (lower === "pacifico" || lower === "pacifico clara") {
    return { name: "Pacifico Clara", style: "Lager", abv: 4.5 };
  }

  // 10. Peroni
  if (lower === "peroni" || lower.includes("peroni nastro")) {
    return { name: "Peroni Nastro Azzurro", style: "Lager", abv: 5.1 };
  }

  // 11. Blue Moon
  if (lower === "blue moon" || lower.includes("blue moon belgian")) {
    return { name: "Blue Moon Belgian White", style: "Wheat", abv: 5.4 };
  }

  // 12. Southern Pacific variants
  if (lower.includes("southern pacific sports")) {
    return { name: "Southern Pacific Sports Beer", style: "Lager", abv: 4.5 };
  }

  // 13. Standard Deviant / Kolsch
  if (lower.includes("standard deviant kolch") || lower.includes("standard deviant kolsch")) {
    return { name: "Standard Deviant Kolsch", style: "Pale Ale", abv: 4.8 };
  }

  // 14. Estrella Galicia variants
  if (
    lower.includes("estrella galicia") ||
    lower.includes("estrella unhappy") ||
    lower.includes("estrella galica") ||
    (lower.startsWith("estrella") && (lower.endsWith("unhappy") || lower.endsWith("galicia") || lower.endsWith("galica")))
  ) {
    return { name: "Estrella Galicia", style: "Lager", abv: 5.5 };
  }

  // 15. Dark Matter variants
  if (lower.includes("dark matter")) {
    return { name: "Soulcraft Dark Matter Stout", style: "Stout", abv: 6.8 };
  }

  // 16. Hert Lager
  if (lower === "hert lager") {
    return { name: "Heart Lager", style: "Lager", abv: 4.8 };
  }

  // Try exact or partial match in PRELOADED_BEERS
  const found = PRELOADED_BEERS.find(
    (b) => b.name.toLowerCase().trim() === lower
  );
  if (found) {
    return { name: found.name, style: found.style, abv: parseFloat(found.abv) };
  }

  // Return formatted name with capitalized words
  const capitalized = trimmed
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  return { name: capitalized };
}

/**
 * Filters and ranks beers based on search query.
 * Prioritizes beers whose name starts with the search query (alphabetically),
 * followed by beers where any word starts with the query,
 * followed by general substring or style matches.
 */
export function searchBeers(beers: PreloadedBeer[], query: string, limit: number = 35): PreloadedBeer[] {
  const term = query.toLowerCase().trim();
  if (!term) {
    return beers.slice(0, limit);
  }

  // 1. Direct name starts with query (e.g., typing "g" -> "Guinness Draught", "Goose Island", etc.)
  const exactPrefixMatches = beers.filter((b) =>
    b.name.toLowerCase().startsWith(term)
  );
  exactPrefixMatches.sort((a, b) => a.name.localeCompare(b.name));

  // 2. Word prefix matches (e.g., typing "g" -> "Estrella Galicia")
  const wordPrefixMatches = beers.filter((b) => {
    if (b.name.toLowerCase().startsWith(term)) return false;
    const words = b.name.toLowerCase().split(/\s+/);
    return words.some((w) => w.startsWith(term));
  });
  wordPrefixMatches.sort((a, b) => a.name.localeCompare(b.name));

  // 3. Substring or style matches
  const substringMatches = beers.filter((b) => {
    const lowerName = b.name.toLowerCase();
    if (lowerName.startsWith(term)) return false;
    const words = lowerName.split(/\s+/);
    if (words.some((w) => w.startsWith(term))) return false;
    return lowerName.includes(term) || b.style.toLowerCase().includes(term);
  });
  substringMatches.sort((a, b) => a.name.localeCompare(b.name));

  const combined = [...exactPrefixMatches, ...wordPrefixMatches, ...substringMatches];
  return limit > 0 ? combined.slice(0, limit) : combined;
}
