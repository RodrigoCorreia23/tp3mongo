// src/components/MovieDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './App.css'; // aproveita as classes já definidas

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    // busca dados gerais do filme
    fetch(`https://tp3mongo-2.onrender.com/movies/${id}`)
      .then(res => res.json())
      .then(setMovie)
      .catch(err => console.error('Erro ao carregar filme:', err));

    // busca comentários
    fetch(`https://tp3mongo-2.onrender.com/movies/${id}/comments`)
      .then(res => res.json())
      .then(setComments)
      .catch(err => console.error('Erro ao carregar comentários:', err));
  }, [id]);

  const submitNew = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await fetch(
        `https://tp3mongo-2.onrender.com/movies/${id}/comments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: text.trim() })
        }
      );
      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setText('');
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
    }
  };

  const startEdit = (commentId, currentText) => {
    setEditingId(commentId);
    setEditingText(currentText);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const submitEdit = async commentId => {
    try {
      const res = await fetch(
        `https://tp3mongo-2.onrender.com/movies/${id}/comments/${commentId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: editingText.trim() })
        }
      );
      const updated = await res.json();
      setComments(comments.map(c => (c._id === commentId ? updated : c)));
      cancelEdit();
    } catch (err) {
      console.error('Erro ao editar comentário:', err);
    }
  };

  const handleDelete = async commentId => {
    if (!window.confirm('Remover este comentário?')) return;
    try {
      await fetch(
        `https://tp3mongo-2.onrender.com/movies/${id}/comments/${commentId}`,
        { method: 'DELETE' }
      );
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error('Erro ao excluir comentário:', err);
    }
  };

  if (!movie) return <div>Carregando…</div>;

  return (
    <div className="movie-detail-page">
      <Link to="/" className="back-btn">
        ← Voltar
      </Link>

      <h1>
        {movie.title} {movie.year && <span>({movie.year})</span>}
      </h1>

      <div className="movie-detail-container">
        <img
          src={movie.poster || '/placeholder.png'}
          alt={movie.title}
          className="detail-poster"
        />

        <div className="details">
          {movie.directors && (
            <p>
              <strong>Direção:</strong> {movie.directors.join(', ')}
            </p>
          )}
          {movie.cast && (
            <p>
              <strong>Elenco:</strong> {movie.cast.slice(0, 5).join(', ')}
              {movie.cast.length > 5 && '…'}
            </p>
          )}
          {movie.genres && (
            <p>
              <strong>Gênero:</strong> {movie.genres.join(', ')}
            </p>
          )}
          {movie.runtime && (
            <p>
              <strong>Duração:</strong> {movie.runtime} min
            </p>
          )}
          {movie.imdb?.rating && (
            <p>
              <strong>Nota IMDb:</strong> {movie.imdb.rating} / 10
            </p>
          )}

          {movie.plot && (
            <>
              <h2>Sinopse</h2>
              <p>{movie.plot}</p>
            </>
          )}
        </div>
      </div>

      <section className="comments-section">
        <h2>Comentários</h2>

        <form onSubmit={submitNew} className="comment-form">
          <textarea
            rows="3"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Escreva o seu comentário…"
          />
          <button type="submit">Enviar</button>
        </form>

        {comments.map(c => (
          <div key={c._id} className="comment-item">
            <small>{new Date(c.createdAt).toLocaleString()}</small>

            {editingId === c._id ? (
              <>
                <textarea
                  rows="2"
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                />
                <button onClick={() => submitEdit(c._id)}>Salvar</button>
                <button onClick={cancelEdit}>Cancelar</button>
              </>
            ) : (
              <>
                <p>{c.text}</p>
                <div className="comment-actions">
                  <button onClick={() => startEdit(c._id, c.text)}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(c._id)}>
                    Excluir
                  </button>
                </div>
              </>
            )}

            <hr />
          </div>
        ))}
      </section>
    </div>
  );
}