import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { livrosApi } from '../api/livrosApi';

export default function ItemList() {
  const [livros, setLivros] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);

  const carregarLivros = async (termo = '') => {
    setLoading(true);
    setErro(null);

    try {
      const response = await livrosApi.listar(termo);
      setLivros(response.data);
    } catch (err) {
      const mensagem = err.response?.data?.message || 'Erro ao carregar livros.';
      setErro(mensagem);
      setLivros([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLivros();
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    carregarLivros(termoBusca);
  };

  const handleLimparBusca = () => {
    setTermoBusca('');
    carregarLivros('');
  };

  const handleExcluir = async (id, titulo) => {
    const confirmar = window.confirm(`Deseja excluir o livro "${titulo}"?`);
    if (!confirmar) return;

    setExcluindoId(id);
    setErro(null);

    try {
      await livrosApi.excluir(id);
      setLivros((prev) => prev.filter((livro) => livro.id !== id));
    } catch (err) {
      const mensagem = err.response?.data?.message || 'Erro ao excluir livro.';
      setErro(mensagem);
    } finally {
      setExcluindoId(null);
    }
  };

  return (
    <div className="card">
      <h1>Listagem de Livros</h1>

      <form className="search-bar" onSubmit={handleBuscar}>
        <input
          type="text"
          placeholder="Buscar por título, autor, ISBN ou gênero..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
        {termoBusca && (
          <button type="button" className="btn btn-secondary" onClick={handleLimparBusca}>
            Limpar
          </button>
        )}
      </form>

      {erro && <div className="alert alert-error">{erro}</div>}

      {loading ? (
        <p className="loading">Carregando livros...</p>
      ) : livros.length === 0 ? (
        <p className="empty-state">
          {termoBusca
            ? 'Nenhum livro encontrado para a busca informada.'
            : 'Nenhum livro cadastrado. Clique em "Cadastrar" para adicionar.'}
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>ISBN</th>
              <th>Ano</th>
              <th>Gênero</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {livros.map((livro) => (
              <tr key={livro.id}>
                <td>{livro.titulo}</td>
                <td>{livro.autor}</td>
                <td>{livro.isbn}</td>
                <td>{livro.ano}</td>
                <td>{livro.genero}</td>
                <td>
                  <div className="actions">
                    <Link to={`/editar/${livro.id}`} className="btn btn-secondary">
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={excluindoId === livro.id}
                      onClick={() => handleExcluir(livro.id, livro.titulo)}
                    >
                      {excluindoId === livro.id ? 'Excluindo...' : 'Excluir'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
