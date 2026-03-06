import { useState, useEffect, useMemo } from "react";
import { getShinySprite } from "../utils/sprites";
import { fetchPokemonList } from "../utils/pokemonList";

type Pokemon = { id: number; name: string };

const generationRanges: Record<number, { start: number; end: number }> = {
  2: { start: 152, end: 251 },
  3: { start: 252, end: 386 },
  4: { start: 387, end: 493 },
  5: { start: 494, end: 649 },
  6: { start: 650, end: 721 },
  7: { start: 722, end: 809 },
  8: { start: 810, end: 905 },
  9: { start: 906, end: 1025 },
};

export default function Counter() {
  const [pokemonId, setPokemonId] = useState<number>(152);
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [generation, setGeneration] = useState<number>(2);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokemonList().then(setPokemonList);
  }, []);

  const filteredPokemonList = useMemo(() => {
    const range = generationRanges[generation];
    if (!range) return [];

    return pokemonList.filter(
      (pokemon) => pokemon.id >= range.start && pokemon.id <= range.end
    );
  }, [pokemonList, generation]);

  const spriteUrl = useMemo(() => {
    const pokemon = pokemonList.find((p) => p.id === pokemonId);
    if (pokemon) {
      return getShinySprite(pokemon.name, generation);
    }
    return "";
  }, [pokemonId, generation, pokemonList]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setCount((prev) => prev + increment);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [increment]);

  const handleGenerationChange = (newGeneration: number) => {
    setGeneration(newGeneration);

    const range = generationRanges[newGeneration];
    const firstPokemonInGeneration = pokemonList.find(
      (pokemon) => pokemon.id >= range.start && pokemon.id <= range.end
    );

    if (firstPokemonInGeneration) {
      setPokemonId(firstPokemonInGeneration.id);
    }
  };

  const handleReset = () => {
    setCount(0);
    setIncrement(1);
    setGeneration(2);
    setPokemonId(152);
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: "transparent",
      }}
    >
      <h1>Shiny Hunt Counter</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
          marginBottom: "30px",
        }}
      >
        {spriteUrl && (
          <img
            src={spriteUrl}
            alt="Pokemon"
            style={{ imageRendering: "pixelated", width: "96px", height: "96px" }}
          />
        )}
        <h2>{count}</h2>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label>
            Increment:
            <input
              type="number"
              value={increment}
              onChange={(e) =>
                setIncrement(Math.max(1, Number(e.target.value)))
              }
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
              onChange={(e) => handleGenerationChange(Number(e.target.value))}
              style={{ marginLeft: "10px", padding: "5px" }}
            >
              <option value={2}>Gen 2 (Gold/Silver)</option>
              <option value={3}>Gen 3 (Emerald)</option>
              <option value={4}>Gen 4 (Platinum)</option>
              <option value={5}>Gen 5 (Black/White)</option>
              <option value={6}>Gen 6 (X/Y)</option>
              <option value={7}>Gen 7 (Sun/Moon)</option>
              <option value={8}>Gen 8 (Sword/Shield)</option>
              <option value={9}>Gen 9 (Scarlet/Violet)</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>
            Pokémon:
            <select
              value={pokemonId}
              onChange={(e) => setPokemonId(Number(e.target.value))}
              style={{ marginLeft: "10px", padding: "5px" }}
            >
              {filteredPokemonList.map((pokemon) => (
                <option key={pokemon.id} value={pokemon.id}>
                  {pokemon.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <button
        onClick={() => setCount((prev) => prev + increment)}
        style={{ padding: "10px 20px", marginRight: "10px" }}
      >
        Count
      </button>

      <button onClick={handleReset} style={{ padding: "10px 20px" }}>
        Reset
      </button>
    </div>
  );
}