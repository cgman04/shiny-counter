import { useState, useEffect, useMemo } from "react";
import { getShinySprite } from "../utils/sprites";
import { fetchPokemonList } from "../utils/pokemonList";

type Pokemon = { id: number; name: string };

export default function Counter() {
  const [pokemonId, setPokemonId] = useState<number>(1);
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [generation, setGeneration] = useState<number>(9);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokemonList().then(setPokemonList);
  }, []);

  const spriteUrl = useMemo(() => {
    const pokemon = pokemonList.find(p => p.id === pokemonId);
    if (pokemon) {
      const url = getShinySprite(pokemon.name, generation);
      console.log("pokemon:", pokemon.name);
      console.log("generation:", generation);
      console.log("spriteUrl:", url);
      return url;
    }
    return "";
  }, [pokemonId, generation, pokemonList]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setCount(prev => prev + increment);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [increment]);

  const handleReset = () => {
    setCount(0);
    setIncrement(1);
    setPokemonId(1);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", backgroundColor: "transparent" }}>
      <h1>Shiny Hunt Counter</h1>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "30px", marginBottom: "30px" }}>
        {spriteUrl && <img src={spriteUrl} alt="Pokemon" style={{ imageRendering: "pixelated" }} />}
        <h2>{count}</h2>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>
          <div style={{ marginBottom: "20px" }}>
            <label>
              Increment:
              <input
                type="number"
                value={increment}
                onChange={(e) => setIncrement(Math.max(1, Number(e.target.value)))}
                min="1"
                style={{ marginLeft: "10px", padding: "5px" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>
              Generation:
              <select
                value={generation}
                onChange={(e) => setGeneration(Number(e.target.value))}
                style={{ marginLeft: "10px", padding: "5px" }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(gen => (
                  <option key={gen} value={gen}>Gen {gen}</option>
                ))}
              </select>
            </label>
          </div>
          Pokémon:
          <select
            value={pokemonId}
            onChange={(e) => setPokemonId(Number(e.target.value))}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            {pokemonList.map(pokemon => (
              <option key={pokemon.id} value={pokemon.id}>
                {pokemon.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button onClick={() => setCount(prev => prev + increment)} style={{ padding: "10px 20px", marginRight: "10px" }}>
        Count
      </button>

      <button onClick={handleReset} style={{ padding: "10px 20px" }}>
        Reset
      </button>
    </div>
  );
}