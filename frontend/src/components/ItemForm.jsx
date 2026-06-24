import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { livrosApi } from '../api/livrosApi';

const GENEROS = [
  'Ficção',
  'Romance',
  'Fantasia',
  'Terror',
  'Biografia',
  'História',
  'Ciência',
  'Tecnologia',
  'Infantil',
  'Outro',
];

const livroVazio = {
  titulo: '',
  autor: '',
  isbn: '',
  ano: new Date().getFullYear(),
  genero: 'Ficção',
};

function idValido(id) {
  return /^\d+$/.test(id) && Number(id) > 0;
}

export default function ItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdicao = Boolean(id);

  const [livro, setLivro] = useState(livroVazio);
  const [loading, setLoading] = useState(isEdicao);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [erroAcesso, setErroAcesso] = useState(null);

  useEffect(() => {
    if (!isEdicao) return;

    if (!idValido(id)) {
      setErroAcesso('O identificador informado na URL é inválido.');
      setLoading(false);
      return;
    }

    const carregarLivro = async () => {
      setLoading(true);
      setErro(null);
      setErroAcesso(null);

      try {
        const response = await livrosApi.buscarPorId(id);
        setLivro(response.data);
      } catch (err) {
        const status = err.response?.status;
        const mensagem = err.response?.data?.message;

        if (status === 404) {
          setErroAcesso(
            mensagem || 'Este livro não existe ou foi excluído. A edição não está disponível.'
          );
        } else {
          setErroAcesso(
            mensagem || 'Não foi possível carregar os dados do livro. Tente novamente mais tarde.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    carregarLivro();
  }, [id, isEdicao]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLivro((prev) => ({
      ...prev,
      [name]: name === 'ano' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);

    try {
      if (isEdicao) {
        await livrosApi.atualizar(id, livro);
      } else {
        await livrosApi.criar(livro);
      }
      navigate('/');
    } catch (err) {
      const mensagem = err.response?.data?.message || 'Erro ao salvar livro.';
      setErro(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return <p className="loading">Carregando dados do livro...</p>;
  }

  if (isEdicao && erroAcesso) {
    return (
      <div className="card error-page">
        <h1>Acesso negado</h1>
        <div className="alert alert-error">{erroAcesso}</div>
        <p className="error-page-hint">
          Verifique se o livro ainda existe na listagem ou se o endereço está correto.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>
          Voltar para a listagem
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>{isEdicao ? 'Editar Livro' : 'Cadastrar Livro'}</h1>

      {erro && <div className="alert alert-error">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título *</label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            value={livro.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="autor">Autor *</label>
          <input
            id="autor"
            name="autor"
            type="text"
            value={livro.autor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="isbn">ISBN *</label>
          <input
            id="isbn"
            name="isbn"
            type="text"
            value={livro.isbn}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ano">Ano *</label>
          <input
            id="ano"
            name="ano"
            type="number"
            min="1000"
            max="2100"
            value={livro.ano}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="genero">Gênero *</label>
          <select
            id="genero"
            name="genero"
            value={livro.genero}
            onChange={handleChange}
            required
          >
            {GENEROS.map((genero) => (
              <option key={genero} value={genero}>
                {genero}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : isEdicao ? 'Atualizar' : 'Cadastrar'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            disabled={salvando}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
