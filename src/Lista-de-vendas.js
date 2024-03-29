import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import './Lista-de-vendas.css'; // Importe o arquivo CSS para estilização
import ptBR from 'date-fns/locale/pt-BR'; // Importe o idioma português do Brasil
import { isAfter, isBefore, parse} from 'date-fns'; // Importe a função isAfter e isBefore do date-fns

const ListaVendas = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [compras, setCompras] = useState([]);

  const fetchCompras = useCallback(() => {
    if (startDate && endDate) {
      const comprasRef = firebase.database().ref('compras');
      comprasRef.on('value', (snapshot) => {
        const compras = snapshot.val();
        if (compras) {
          const listaCompras = Object.entries(compras).map(([id, compra]) => ({
            id,
            ...compra,
          })).filter(compra => {
            // Filtrar as compras dentro do intervalo de datas especificado
            const compraDate = parse(compra.data, 'dd/MM/yyyy', new Date());
            const isAfterStartDate = isAfter(compraDate, startDate);
            const isBeforeEndDate = isBefore(compraDate, endDate);
            return isAfterStartDate && isBeforeEndDate;
          });
          setCompras(listaCompras);
        } else {
          setCompras([]);
        }
      });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchCompras();
  }, [fetchCompras]);
  
  return (
    <div className="lista-vendas-container">
      <h1>Lista de Vendas</h1>
      <div className="input-group">
        <label>Data Inicial:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Selecione a data inicial"
          className="input"
          locale={ptBR} // Define o idioma para português do Brasil
          dateFormat="MM/dd/yyyy" // Define o formato da data
        />
      </div>
      <div className="input-group">
        <label>Data Final:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="Selecione a data final"
          className="input"
          locale={ptBR} // Define o idioma para português do Brasil
          dateFormat="MM/dd/yyyy" // Define o formato da data
        />
      </div>
      <button className="btn" onClick={fetchCompras}>Pesquisar</button>
      <div className="compras-container">
        {compras.length > 0 ? (
          compras.map((compra) => (
            <div className="card" key={compra.id}>
              <div className="card-header">{compra.data}</div>
              <div className="card-body">
                {compra.produtos.map((produto, index) => (
                  <div className="produto-card" key={index}>
                    <p>{produto.nomeProduto}</p>
                    <p>Quantidade: {produto.quantidade}</p>
                    <p>Valor: R$ {produto.precoVenda}</p>
                  </div>
                ))}
              </div>
              <div className="card-footer">Valor Total: R$ {compra.valorTotal}</div>
            </div>
          ))
        ) : (
          <p>Nenhuma compra encontrada para o período selecionado.</p>
        )}
      </div>
    </div>
  );
};

export default ListaVendas;
