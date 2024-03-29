import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database'; // Importe o Realtime Database

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDT52GD6mvCa70UfCWgCHWgz-FUL7W22wc",
    authDomain: "estoque-bc70d.firebaseapp.com",
    databaseURL: "https://estoque-bc70d-default-rtdb.firebaseio.com", // URL do Realtime Database
    projectId: "estoque-bc70d",
    storageBucket: "estoque-bc70d.appspot.com",
    messagingSenderId: "182035498420",
    appId: "1:182035498420:web:ae369688587b2e2d261ee1",
    measurementId: "G-P5ZN8P6PZ8"
};

firebase.initializeApp(firebaseConfig);

// Referência para o Realtime Database
const db = firebase.database();

// Função para cadastrar os dados no Firebase
const cadastrarDados = (dados) => {
  const nomeProduto = dados.nomeProduto; // Obtenha o nome do produto
  return db.ref('produtos/' + nomeProduto).set(dados);
};

export default cadastrarDados;
