import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export default function MovieList() {
  const [movies, setMovies] = useState([]);              // só os filmes da página atual
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);       // vindo do servidor
  const moviesPerPage = 12;

  useEffect(() => {
    fetch(`https://tp3mongo-2.onrender.com/movies?page=${currentPage}&limit=${moviesPerPage}`)
      .then(r => {
        // Se o seu backend devolver o total em header, ex:
        const totalCount = r.headers.get('X-Total-Count');
        if (totalCount) {
          setTotalPages(Math.ceil(Number(totalCount) / moviesPerPage));
        }
        return r.json();
      })
      .then(data => {
        // se o endpoint já vier num objeto { docs, totalPages, ... }
        if (data.docs && data.totalPages) {
          setMovies(data.docs);
          setTotalPages(data.totalPages);
        } else {
          setMovies(data);
        }
      });
  }, [currentPage]);

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
      <input
        className="search-bar"
        type="text"
        placeholder="Procurar filme..."
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

      {totalPages > 1 && (
        <div className="pagination-wrapper">
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Anterior
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
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
