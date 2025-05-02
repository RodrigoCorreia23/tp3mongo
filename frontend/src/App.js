import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MovieList   from './MovieList';
import MovieDetail from './MovieDetail';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
