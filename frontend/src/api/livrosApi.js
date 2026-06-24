import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const livrosApi = {
  listar: (termo) =>
    api.get('/livros', { params: termo ? { termo } : {} }),

  buscarPorId: (id) =>
    api.get(`/livros/${id}`),

  criar: (livro) =>
    api.post('/livros', livro),

  atualizar: (id, livro) =>
    api.put(`/livros/${id}`, livro),

  excluir: (id) =>
    api.delete(`/livros/${id}`),
};

export default api;
