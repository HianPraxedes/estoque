import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cadastrar from './Cadastrar';
import ListaVendas from './Lista-de-vendas';
import RealizarVendas from './Realizar-vendas';
import EntradaSaida from './Entrada-saida';
import PaginaInicial from './Pagina-inicial';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Routes>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/cadastrar" element={<Cadastrar />} />
          <Route path="/lista-vendas" element={<ListaVendas />} />
          <Route path="/realizar-vendas" element={<RealizarVendas />} />
          <Route path="/entrada-saida" element={<EntradaSaida />} />
          {/* Outras rotas podem ser adicionadas aqui */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
