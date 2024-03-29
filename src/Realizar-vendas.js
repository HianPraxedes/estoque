import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app'; // Importe o Firebase
import './Realizar-vendas.css'; // Importe o arquivo CSS para estilização

const RealizarVendas = () => {
  const [produtos, setProdutos] = useState([]);
  const [nomeProdutoBusca, setNomeProdutoBusca] = useState('');
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);

  useEffect(() => {
    // Carregar produtos disponíveis ao montar o componente
    carregarProdutos();
  }, []);

  useEffect(() => {
    // Recalcular o valor total sempre que a lista de produtos selecionados mudar
    calcularValorTotal();
  }, [produtosSelecionados]);

  const carregarProdutos = () => {
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

  const handleBuscarProduto = () => {
    // Se a caixa de busca estiver vazia, exibir todos os produtos
    if (nomeProdutoBusca.trim() === '') {
      carregarProdutos();
      return;
    }

    // Filtrar produtos pelo nome digitado
    const produtosFiltrados = produtos.filter(produto =>
      produto.nomeProduto.toLowerCase().includes(nomeProdutoBusca.toLowerCase())
    );
    setProdutos(produtosFiltrados);
  };

  const handleAdicionarProduto = (produto) => {
    const produtoExistente = produtosSelecionados.find(item => item.id === produto.id);
    if (!produtoExistente && produto.quantidade > 0) { // Adicionando a verificação da quantidade no estoque
      setProdutosSelecionados([...produtosSelecionados, { ...produto, quantidade: 1 }]);
    } else if (!produtoExistente && produto.quantidade === 0) {
      console.log('Produto fora de estoque.');
    }
  };

  const handleRemoverProduto = (id) => {
    const novaLista = produtosSelecionados.filter(produto => produto.id !== id);
    setProdutosSelecionados(novaLista);
  };

  const handleChangeQuantidade = (id, event) => {
    const novaQuantidade = parseInt(event.target.value);
    if (novaQuantidade >= 0) {
      const produto = produtos.find(item => item.id === id);
      if (novaQuantidade <= produto.quantidade) {
        const novaLista = produtosSelecionados.map(item =>
          item.id === id ? { ...item, quantidade: novaQuantidade } : item
        );
        setProdutosSelecionados(novaLista);
      } else {
        // Se a nova quantidade for maior que o estoque, mantenha a quantidade atual
        console.log('Quantidade excede o estoque disponível.');
      }
    }
  };

  const handleChangePrecoVenda = (id, event) => {
    const novoPrecoVenda = parseFloat(event.target.value);
    const novaLista = produtosSelecionados.map(produto =>
      produto.id === id ? { ...produto, precoVenda: novoPrecoVenda } : produto
    );
    setProdutosSelecionados(novaLista);
  };

  const handleEscolhaProduto = (id, escolha) => {
    const novaLista = produtosSelecionados.map(item =>
      item.id === id ? { ...item, escolha: escolha } : item
    );
    setProdutosSelecionados(novaLista);
  };

  const calcularValorTotal = () => {
    let total = 0;
    produtosSelecionados.forEach(produto => {
      total += produto.precoVenda * produto.quantidade;
    });
    return total;
  };

  const finalizarCompra = () => {
    // Crie um novo registro para representar a compra no Firebase
    const compraRef = firebase.database().ref('compras').push();
    const compraKey = compraRef.key;
    const data = new Date().toLocaleDateString();
    const compra = {
      produtos: produtosSelecionados,
      valorTotal: calcularValorTotal(),
      data: data
    };
    compraRef.set(compra);
  
    // Atualize o estoque dos produtos no Firebase
    produtosSelecionados.forEach(produto => {
      const produtoRef = firebase.database().ref(`produtos/${produto.id}`);
      const novaQuantidade = produto.quantidade;
      produtoRef.transaction((produtoAtual) => {
        if (produtoAtual) {
          if (produtoAtual.quantidade >= novaQuantidade) {
            produtoAtual.quantidade -= novaQuantidade; // Subtraindo apenas a quantidade vendida
          } else {
            console.log('Quantidade excede o estoque disponível.');
          }
        }
        return produtoAtual;
      });
    });
  
    // Limpe a lista de produtos selecionados
    setProdutosSelecionados([]);
  };

  return (
    <div className="realizar-vendas-container">
      <h1>Realizar Vendas</h1>
      <div className="input-group">
        <input
          id="buscarProduto"
          className="input"
          type="text"
          placeholder="Digite o nome do produto..."
          value={nomeProdutoBusca}
          onChange={(e) => setNomeProdutoBusca(e.target.value)}
        />
        <button className="btn" onClick={handleBuscarProduto}>Buscar</button>
      </div>
      <div className="tabela-produtos-disponiveis">
        <h2>Produtos Disponíveis</h2>
        <table>
          <thead>
            <tr>
              <th>Nome do Produto</th>
              <th>Preço de Venda</th>
              <th>Estoque</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nomeProduto}</td>
                <td>{produto.precoVenda}</td>
                <td>{produto.quantidade}</td>
                <td>
                  <button onClick={() => handleAdicionarProduto(produto)}>Adicionar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tabela-produtos-selecionados">
        <h2>Produtos Selecionados</h2>
        <table>
          <thead>
            <tr>
              <th>Nome do Produto</th>
              <th>Preço de Venda</th>
              <th>Quantidade</th>
              <th>Escolha</th>
              <th>Remover</th>
            </tr>
          </thead>
          <tbody>
            {produtosSelecionados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nomeProduto}</td>
                <td>
                  <input
                    type="number"
                    value={produto.precoVenda}
                    onChange={(e) => handleChangePrecoVenda(produto.id, e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={produto.quantidade}
                    onChange={(e) => handleChangeQuantidade(produto.id, e)}
                  />
                </td>
                <td>
                  <button onClick={() => handleEscolhaProduto(produto.id, 'Alander')}>Alander</button>
                  <button onClick={() => handleEscolhaProduto(produto.id, 'Hian')}>Hian</button>
                </td>
                <td>
                  <button onClick={() => handleRemoverProduto(produto.id)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="valor-total">
          <strong>Valor Total:</strong> {calcularValorTotal().toFixed(2)}
        </div>
        <button className="btn btn-finalizar-compra" onClick={finalizarCompra}>Finalizar Compra</button>
      </div>
    </div>
  );
}

export default RealizarVendas;
