import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 12;

  useEffect(() => {
    fetch('https://tp3mongo-2.onrender.com/movies')
      .then(r => r.json())
      .then(setMovies);
  }, []);

  // Calculate pagination values
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const paginatedMovies = movies.slice(startIndex, endIndex);

  // Handlers
  const goToPage = (page) => {
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
      <input
        className="search-bar"
        type="text"
        placeholder="Procurar filme..."
        // controle de estado omitido pra brevidade
      />
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
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
  <div className="pagination-wrapper">
    <div className="pagination">
      <button onClick={prevPage} disabled={currentPage === 1}>
        Anterior
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => goToPage(index + 1)}
          className={currentPage === index + 1 ? 'active' : ''}
        >
          {index + 1}
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