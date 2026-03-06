// Convert pokemon name to kebab-case for file naming
const formatPokemonName = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

// Get sprite URL from local storage
export const getSpriteUrl = (pokemonName: string, generation: number = 9, isShiny: boolean = false): string => {
  const variant = isShiny ? "shiny" : "normal";
  const formattedName = formatPokemonName(pokemonName);
  return `/sprites/gen${generation}/${variant}/${formattedName}.png`;
};

export const getShinySprite = (pokemonName: string, generation: number = 9): string => {
  return getSpriteUrl(pokemonName, generation, true);
};

export const getNormalSprite = (pokemonName: string, generation: number = 9): string => {
  return getSpriteUrl(pokemonName, generation, false);
};