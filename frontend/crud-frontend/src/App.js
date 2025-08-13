// src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api/produtos';

function App() {
  // --- STATES (Estados do componente) ---
  const [produtos, setProdutos] = useState([]);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState({ id: null, nome: '', preco: '' });
  const [isEditando, setIsEditando] = useState(false);

  // --- EFFECTS (Efeitos colaterais) ---
  // Roda uma vez quando o componente é montado para buscar a lista inicial de produtos
  useEffect(() => {
    fetchProdutos();
  }, []);

  // --- API FUNCTIONS (Funções de comunicação com o backend) ---
  const fetchProdutos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Previne o recarregamento padrão do formulário
    
    const metodo = isEditando ? 'PUT' : 'POST';
    const url = isEditando ? `${API_URL}/${produtoEmEdicao.id}` : API_URL;

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produtoEmEdicao),
      });

      if (response.ok) {
        alert('Produto salvo com sucesso!');
        fetchProdutos(); // Atualiza a lista de produtos
        handleCancelEdit(); // Limpa o formulário
      } else {
        alert('Erro ao salvar produto.');
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Produto deletado com sucesso!');
          fetchProdutos(); // Atualiza a lista
        } else {
          alert('Erro ao deletar produto.');
        }
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
      }
    }
  };

  // --- UI HANDLERS (Funções que manipulam a interface) ---
  const handleEdit = (produto) => {
    setIsEditando(true);
    setProdutoEmEdicao(produto);
  };

  const handleCancelEdit = () => {
    setIsEditando(false);
    setProdutoEmEdicao({ id: null, nome: '', preco: '' });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProdutoEmEdicao({ ...produtoEmEdicao, [name]: value });
  };


  // --- RENDER (O que é exibido na tela) ---
  return (
    <div className="App">
      <header>
        <h1>Gerenciador de Produtos</h1>
      </header>

      <main>
        <div className="form-container">
          <h2>{isEditando ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
          <form onSubmit={handleSave}>
            <input
              type="text"
              name="nome"
              placeholder="Nome do produto"
              value={produtoEmEdicao.nome}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="preco"
              placeholder="Preço"
              step="0.01"
              value={produtoEmEdicao.preco}
              onChange={handleInputChange}
              required
            />
            <div className="form-buttons">
              <button type="submit">{isEditando ? 'Salvar Alterações' : 'Adicionar Produto'}</button>
              {isEditando && (
                <button type="button" onClick={handleCancelEdit}>Cancelar Edição</button>
              )}
            </div>
          </form>
        </div>

        <div className="list-container">
          <h2>Lista de Produtos</h2>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(produto => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>R$ {Number(produto.preco).toFixed(2)}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(produto)}>Editar</button>
                    <button onClick={() => handleDelete(produto.id)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;