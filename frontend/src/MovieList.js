// src/components/MovieList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 12;

  // Sempre que mudar searchTerm, buscamos no servidor já filtrado
  useEffect(() => {
    const q = searchTerm.trim()
      ? `?search=${encodeURIComponent(searchTerm.trim())}`
      : '';
    fetch(`https://tp3mongo-2.onrender.com/movies${q}`)
      .then(r => r.json())
      .then(data => {
        setMovies(data);
        setCurrentPage(1); // reseta pra página 1 em toda busca
      })
      .catch(err => console.error('Erro ao buscar filmes:', err));
  }, [searchTerm]);

  // Paginação sobre o array retornado (já filtrado pelo back)
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const paginatedMovies = movies.slice(startIndex, startIndex + moviesPerPage);

  const goToPage = page => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prevPage = () => goToPage(Math.max(currentPage - 1, 1));
  const nextPage = () => goToPage(Math.min(currentPage + 1, totalPages));

  return (
    <>
      <header>
        <h1>🎬 Catálogo</h1>
      </header>

      {/* Barra de busca */}
      <input
        className="search-bar"
        type="text"
        placeholder="Procurar filme..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {/* Grade de filmes */}
      <div className="movie-grid">
        {paginatedMovies.map(m => (
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
        {!movies.length && (
          <p>Nenhum filme encontrado para “{searchTerm}”</p>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="pagination-wrapper">
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Anterior
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToPage(idx + 1)}
                className={currentPage === idx + 1 ? 'active' : ''}
              >
                {idx + 1}
              </button>
            ))}
            <button onClick={nextPage} disabled={currentPage === totalPages}>
              Próxima
            </button>
          </div>
        </div>
      )}
    </>
  );
}
