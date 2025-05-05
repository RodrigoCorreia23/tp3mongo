import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './App.css';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetch(`https://tp3mongo-2.onrender.com/movies/${id}`)
      .then(r => r.json())
      .then(setMovie);
    fetch(`https://tp3mongo-2.onrender.com/movies/${id}/comments`)
      .then(r => r.json())
      .then(setComments);
  }, [id]);

  const submit = async e => {
    e.preventDefault();
    if (!text) return;
    const res = await fetch(
      `https://tp3mongo-2.onrender.com/movies/${id}/comments`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      }
    );
    const c = await res.json();
    setComments([c, ...comments]);
    setText('');
  };

  const handleDelete = async commentId => {
    if (!window.confirm('Remover este comentário?')) return;
    await fetch(
      `https://tp3mongo-2.onrender.com/movies/${id}/comments/${commentId}`,
      { method: 'DELETE' }
    );
    setComments(comments.filter(c => c._id !== commentId));
  };

  const startEdit = (commentId, currentText) => {
    setEditingId(commentId);
    setEditingText(currentText);
  };

  const submitEdit = async commentId => {
    const res = await fetch(
      `https://tp3mongo-2.onrender.com/movies/${id}/comments/${commentId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editingText })
      }
    );
    const updated = await res.json();
    setComments(
      comments.map(c => (c._id === commentId ? updated : c))
    );
    setEditingId(null);
    setEditingText('');
  };

  if (!movie) return <div>Carregando…</div>;

  return (
    <div style={{ padding: '1rem', maxWidth: 800, margin: 'auto' }}>
      <Link to="/" className="back-btn">← Voltar</Link>
      <h1>{movie.title} {movie.year && `(${movie.year})`}</h1>
      {/* ... detalhes do filme ... */}
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
            <small>{new Date(c.createdAt).toLocaleString()}</small>
            {editingId === c._id ? (
              <>
                <textarea
                  rows="2"
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  style={{ width: '100%', margin: '0.5rem 0' }}
                />
                <button onClick={() => submitEdit(c._id)}>Salvar</button>
                <button onClick={() => setEditingId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <p>{c.text}</p>
                <button onClick={() => startEdit(c._id, c.text)}>
                  Editar
                </button>
                <button onClick={() => handleDelete(c._id)}>
                  Excluir
                </button>
              </>
            )}
            <hr/>
          </div>
        ))}
      </section>
    </div>
  );
}
