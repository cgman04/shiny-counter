interface PokemonResult {
  name: string;
  url: string;
}

export async function fetchPokemonList() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
    const data = await response.json();

    return data.results.map((pokemon: PokemonResult, index: number) => ({
      id: index + 1,
      name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    }));
  } catch (error) {
    console.error("Failed to fetch Pokemon list:", error);
    return [];
  }
}