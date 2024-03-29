import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faBasketShopping, faCoins, faCashRegister } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>HP Imports</h2>
      <h3>Menu</h3>
      <ul>
        <li>
            <Link to="/cadastrar">
            <button>
                <FontAwesomeIcon icon={faPenToSquare} />
                <span class="transition"></span>
                <span class="gradient"></span>
                <span class="label"> Cadastrar produto</span>
            </button>
            </Link>
        </li>
        <li>
            <Link to="/lista-vendas">
            <button>
                <FontAwesomeIcon icon={faBasketShopping} />
                <span class="transition"></span>
                <span class="gradient"></span>
                <span class="label"> Lista de Vendas</span>
            </button>
            </Link>
        </li>
        <li>
            <Link to="/realizar-vendas">
            <button>
                <FontAwesomeIcon icon={faCashRegister} />
                <span class="transition"></span>
                <span class="gradient"></span>
                <span class="label"> Realizar venda</span>
            </button>
            </Link>
        </li>
        <li>      
            <Link to="/entrada-saida">      
            <button>
                <FontAwesomeIcon icon={faCoins} />
                <span class="transition"></span>
                <span class="gradient"></span>
                <span class="label"> Entrada e saída</span>
            </button>
            </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
