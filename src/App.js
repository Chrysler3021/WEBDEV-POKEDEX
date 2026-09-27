import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const typeColors = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
  grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
  ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
  steel: "#B7B7CE", fairy: "#D685AD",
};

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );
        const detailedRequests = res.data.results.map((poke) =>
          axios.get(poke.url)
        );
        const detailedResponses = await Promise.all(detailedRequests);
        const detailedData = detailedResponses.map((r) => r.data);
        setPokemonList(detailedData);
        setSelectedPokemon(detailedData[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        setLoading(false);
      }
    };
    fetchPokemon();
  }, []);

  const filteredPokemon = pokemonList.filter((poke) =>
    poke.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="pokeball-spinner"></div>
        <p>Loading Pokédex...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <h1>Pokédex</h1>
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
      </header>

      <div className="container">
        <div className="pokemon-grid">
          {filteredPokemon.map((poke) => (
            <div
              key={poke.id}
              className={`pokemon-card ${
                selectedPokemon?.id === poke.id ? "active" : ""
              }`}
              onClick={() => setSelectedPokemon(poke)}
              style={{
                background: `linear-gradient(160deg, ${
                  typeColors[poke.types[0].type.name]
                }33, #ffffff)`,
              }}
            >
              <span className="card-id">#{String(poke.id).padStart(3, "0")}</span>
              <img src={poke.sprites.front_default} alt={poke.name} />
              <p className="card-name">{poke.name}</p>
              <div className="type-badges">
                {poke.types.map((t) => (
                  <span
                    key={t.type.name}
                    className="type-badge"
                    style={{ backgroundColor: typeColors[t.type.name] }}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedPokemon && (
          <div
            className="pokemon-detail"
            style={{
              background: `linear-gradient(160deg, ${
                typeColors[selectedPokemon.types[0].type.name]
              }55, #ffffff)`,
            }}
          >
            <span className="detail-id">
              #{String(selectedPokemon.id).padStart(3, "0")}
            </span>
            <img
              src={
                selectedPokemon.sprites.other["official-artwork"]
                  .front_default || selectedPokemon.sprites.front_default
              }
              alt={selectedPokemon.name}
              className="detail-img"
            />
            <h2>{selectedPokemon.name}</h2>

            <div className="type-badges centered">
              {selectedPokemon.types.map((t) => (
                <span
                  key={t.type.name}
                  className="type-badge"
                  style={{ backgroundColor: typeColors[t.type.name] }}
                >
                  {t.type.name}
                </span>
              ))}
            </div>

            <div className="info-row">
              <div className="info-box">
                <span className="info-label">Height</span>
                <span>{selectedPokemon.height / 10} m</span>
              </div>
              <div className="info-box">
                <span className="info-label">Weight</span>
                <span>{selectedPokemon.weight / 10} kg</span>
              </div>
            </div>

            <div className="abilities">
              <h3>Abilities</h3>
              <p>
                {selectedPokemon.abilities
                  .map((a) => a.ability.name)
                  .join(", ")}
              </p>
            </div>

            <div className="stats">
              <h3>Base Stats</h3>
              {selectedPokemon.stats.map((s) => (
                <div className="stat-row" key={s.stat.name}>
                  <span className="stat-name">{s.stat.name}</span>
                  <div className="stat-bar-bg">
                    <div
                      className="stat-bar-fill"
                      style={{
                        width: `${Math.min(s.base_stat, 150) / 1.5}%`,
                        backgroundColor:
                          typeColors[selectedPokemon.types[0].type.name],
                      }}
                    ></div>
                  </div>
                  <span className="stat-value">{s.base_stat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;