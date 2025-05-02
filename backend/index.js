// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Conecte ao MongoDB Atlas
mongoose
  .connect(
    'mongodb+srv://Rodrigo:UwJpMDYks8RDk4mV@cluster0.g8od6.mongodb.net/sample_mflix?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Conectado ao MongoDB Atlas!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Cria o schema sem campos fixos (strict: false) para a coleção "movies"
const movieSchema = new mongoose.Schema({}, { strict: false });
// Passamos o terceiro parâmetro "movies" para bater exato com o nome da coleção
const Movie = mongoose.model('Movie', movieSchema, 'movies');

// Inicializa o app Express
const app = express();
app.use(cors());
app.use(express.json());

// Rota para listar filmes (limita em 50 para não trazer tudo de uma vez)
app.get('/movies', async (req, res) => {
  try {
    const allMovies = await Movie.find({}).limit(50);
    res.json(allMovies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar filmes' });
  }
});

const { Schema, model, Types } = mongoose;

// 1. Modelo de comentários
const commentSchema = new Schema({
  movieId: { type: Types.ObjectId, required: true, ref: 'Movie' },
  text:     { type: String, required: true },
  createdAt:{ type: Date, default: Date.now }
});
const Comment = model('Comment', commentSchema, 'comments');

// 2. Rota de detalhe de um filme
app.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar filme' });
  }
});

// 3. Rota para listar comentários de um filme
app.get('/movies/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ movieId: req.params.id }).sort('-createdAt');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
});

// 4. Rota para adicionar comentário
app.post('/movies/:id/comments', async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.create({ movieId: req.params.id, text });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar comentário' });
  }
});


// Inicia o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
