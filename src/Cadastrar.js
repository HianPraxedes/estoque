import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app'; // Importe o Firebase
import cadastrarDados from './firebase'; // Importe a função cadastrarDados
import './Cadastrar.css'; // Importe o arquivo CSS para estilização

const Cadastrar = () => {
  const [produtos, setProdutos] = useState([]);
  const [nomeProdutoCadastro, setNomeProdutoCadastro] = useState('');
  const [nomeProdutoBusca, setNomeProdutoBusca] = useState('');
  const [precoCompra, setPrecoCompra] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [quantidade, setQuantidade] = useState('');

  useEffect(() => {
    // Função para carregar os produtos cadastrados ao montar o componente
    carregarProdutos();
  }, []);

  const carregarProdutos = () => {
    // Referência para a lista de produtos no Realtime Database
    const produtosRef = firebase.database().ref('produtos');
    produtosRef.on('value', (snapshot) => {
      const produtos = snapshot.val();
      const listaProdutos = [];
      for (let id in produtos) {
        listaProdutos.push({ id, ...produtos[id] });
      }
      setProdutos(listaProdutos);
    });
  };

  const handleCadastro = () => {
    // Chame a função cadastrarDados com os dados
    cadastrarDados({
      nomeProduto: nomeProdutoCadastro,
      precoCompra,
      precoVenda,
      quantidade
    }).then(() => {
      console.log('Dados cadastrados com sucesso!');
      // Após cadastrar, recarregue a lista de produtos
      carregarProdutos();
    }).catch(error => {
      console.error('Erro ao cadastrar dados:', error);
    });
  };

  const handleRemover = (id) => {
    // Remova o produto pelo ID
    const produtoRef = firebase.database().ref(`produtos/${id}`);
    produtoRef.remove().then(() => {
      console.log('Produto removido com sucesso!');
      // Após remover, recarregue a lista de produtos
      carregarProdutos();
    }).catch((error) => {
      console.error('Erro ao remover produto:', error);
    });
  };

  const handleBuscarProduto = () => {
    if (nomeProdutoBusca === '') {
      // Se a caixa de busca estiver vazia, carrega todos os produtos
      carregarProdutos();
    } else {
      // Filtra os produtos pelo nome
      const produtosFiltrados = produtos.filter(produto =>
        produto.nomeProduto.toLowerCase().includes(nomeProdutoBusca.toLowerCase())
      );
      setProdutos(produtosFiltrados);
    }
  };

  return (
    <div className="page-content">
      <h1>Página de Cadastro</h1>
      <div className="input-group">
        <label htmlFor="nomeProduto">Nome do Produto:</label>
        <label htmlFor="precoCompra">Preço de Compra:</label>
        <label htmlFor="precoVenda">Preço de Venda:</label>
        <label htmlFor="quantidade">Quantidade:</label>
      </div>
      <div className="input-group">
        <input
          id="nomeProduto"
          className="input"
          type="text"
          name="nomeProduto"
          placeholder="Nome do Produto"
          value={nomeProdutoCadastro}
          onChange={(e) => setNomeProdutoCadastro(e.target.value)}
        />
        <input
          id="precoCompra"
          className="input"
          type="number"
          name="precoCompra"
          placeholder="Preço de Compra"
          value={precoCompra}
          onChange={(e) => setPrecoCompra(e.target.value)}
        />
        <input
          id="precoVenda"
          className="input"
          type="number"
          name="precoVenda"
          placeholder="Preço de Venda"
          value={precoVenda}
          onChange={(e) => setPrecoVenda(e.target.value)}
        />
        <input
          id="quantidade"
          className="input"
          type="number"
          name="quantidade"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />
        <button className="btn" onClick={handleCadastro}>Cadastrar</button>
      </div>
      <h1>Lista de Produtos</h1>
      <div className="input-group">
        <input
          id="buscarProduto"
          className="input"
          type="text"
          name="buscarProduto"
          placeholder="Digite o nome do produto..."
          value={nomeProdutoBusca}
          onChange={(e) => setNomeProdutoBusca(e.target.value)}
        />
        <button className="btn" onClick={handleBuscarProduto}>Buscar</button>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Nome do Produto</th>
            <th>Preço de Compra</th>
            <th>Preço de Venda</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nomeProduto}</td>
              <td>{produto.precoCompra}</td>
              <td>{produto.precoVenda}</td>
              <td>{produto.quantidade}</td>
              <td>
                <button onClick={() => handleRemover(produto.id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Cadastrar;
