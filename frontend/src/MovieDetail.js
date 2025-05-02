// src/MovieDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './App.css'; // aproveita as classes já definidas

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    // busca dados gerais
    fetch(`http://localhost:5000/movies/${id}`)
      .then(r => r.json())
      .then(setMovie);
    // busca comentários
    fetch(`http://localhost:5000/movies/${id}/comments`)
      .then(r => r.json())
      .then(setComments);
  }, [id]);

  const submit = async e => {
    e.preventDefault();
    if (!text) return;
    const res = await fetch(`http://localhost:5000/movies/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const c = await res.json();
    setComments([c, ...comments]);
    setText('');
  };

  if (!movie) return <div>Carregando…</div>;

  // Opcional: inspecione no console para ver todos os campos disponíveis
  console.log(movie);

  return (
    <div style={{ padding: '1rem', maxWidth: 800, margin: 'auto' }}>
      <Link to="/" className="back-btn">← Voltar</Link>

      <h1>{movie.title} {movie.year && `(${movie.year})`}</h1>

      <div className="movie-detail-container">
        <img 
          src={movie.poster || '/placeholder.png'} 
          alt={movie.title} 
          className="detail-poster"
        />

        <div className="details">
          {movie.directors && (
            <p><strong>Direção:</strong> {movie.directors.join(', ')}</p>
          )}
          {movie.cast && (
            <p><strong>Elenco:</strong> {movie.cast.slice(0,5).join(', ')}{movie.cast.length>5 ? '…' : ''}</p>
          )}
          {movie.genres && (
            <p><strong>Gênero:</strong> {movie.genres.join(', ')}</p>
          )}
          {movie.runtime && (
            <p><strong>Duração:</strong> {movie.runtime} min</p>
          )}
          {movie.imdb && movie.imdb.rating && (
            <p><strong>Nota IMDb:</strong> {movie.imdb.rating} / 10</p>
          )}
          {movie.plot && (
            <>
              <h2>Sinopse</h2>
              <p>{movie.plot}</p>
            </>
          )}
        </div>
      </div>

      <section style={{ marginTop: '2rem' }}>
        <h2>Comentários</h2>
        <form onSubmit={submit} style={{ marginBottom: '1rem' }}>
          <textarea
            rows="3"
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            placeholder="Escreva seu comentário…"
          />
          <button type="submit">Enviar</button>
        </form>
        {comments.map(c => (
          <div key={c._id} style={{ marginBottom: '0.5rem' }}>
            <small>
              {new Date(c.createdAt).toLocaleString()}
            </small>
            <p>{c.text}</p>
            <hr/>
          </div>
        ))}
      </section>
    </div>
  );
}
