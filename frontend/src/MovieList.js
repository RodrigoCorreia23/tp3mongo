import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    fetch('https://tp3mongo-2.onrender.com/movies')
      .then(r => r.json())
      .then(setMovies);
  }, []);

  return (
    <>
      <header>
        <h1>🎬 Catálogo</h1>
      </header>
      <input
        className="search-bar"
        type="text"
        placeholder="Procurar filme..."
        // controle de estado omitido pra brevidade
      />
      <div className="movie-grid">
        {movies.map(m => (
          <div className="movie-card" key={m._id}>
            <Link to={`/movies/${m._id}`}>
              <img src={m.poster || '/placeholder.png'} alt={m.title} />
              <div className="overlay">
                <h2>{m.title}</h2>
              </div>
            </Link>
            <div className="info">
              {m.year && <div className="year">({m.year})</div>}
              {m.plot && (
                <p className="plot">
                  {m.plot.length > 100
                    ? m.plot.slice(0, 100) + '…'
                    : m.plot}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
