// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Carrega a URI do Mongo e a PORT a partir das env vars
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Conecta ao MongoDB Atlas
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Conectado ao MongoDB Atlas!'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// --- MODELS ---
// Schema flexível para a coleção “movies”
const movieSchema = new mongoose.Schema({}, { strict: false });
const Movie = mongoose.model('Movie', movieSchema, 'movies');

// Schema de comentários
const { Schema, model, Types } = mongoose;
const commentSchema = new Schema({
  movieId:  { type: Types.ObjectId, required: true, ref: 'Movie' },
  text:     { type: String, required: true },
  createdAt:{ type: Date, default: Date.now }
});
const Comment = model('Comment', commentSchema, 'comments');

// --- ROTAS ---

// Lista até 500 filmes, opcionalmente filtrando por título
app.get('/movies', async (req, res) => {
  try {
    const { search } = req.query;
    // Se vier ?search=algo, cria um filtro regex case‑insensitive
    const filter = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const allMovies = await Movie.find(filter).limit(500);
    res.json(allMovies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar filmes' });
  }
});

// Detalhe de um filme
app.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar filme' });
  }
});

// Lista comentários de um filme
app.get('/movies/:id/comments', async (req, res) => {
  try {
    const comments = await Comment
      .find({ movieId: req.params.id })
      .sort('-createdAt');
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
});

// Adiciona um comentário
app.post('/movies/:id/comments', async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.create({
      movieId: req.params.id,
      text
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar comentário' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
