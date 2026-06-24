package com.gerenciamentolivros.service;

import com.gerenciamentolivros.entity.Livro;
import com.gerenciamentolivros.exception.RecursoNaoEncontradoException;
import com.gerenciamentolivros.exception.RegraDeNegocioException;
import com.gerenciamentolivros.repository.LivroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LivroService {

    private final LivroRepository livroRepository;

    public LivroService(LivroRepository livroRepository) {
        this.livroRepository = livroRepository;
    }

    @Transactional(readOnly = true)
    public List<Livro> listarTodos() {
        return livroRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Livro buscarPorId(Long id) {
        return livroRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Livro não encontrado com id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Livro> buscarPorTermo(String termo) {
        if (termo == null || termo.isBlank()) {
            return listarTodos();
        }
        return livroRepository.buscarPorTermo(termo.trim());
    }

    public Livro criar(Livro livro) {
        validarLivro(livro);

        if (livroRepository.existsByIsbn(livro.getIsbn())) {
            throw new RegraDeNegocioException("Já existe um livro cadastrado com o ISBN informado.");
        }

        return livroRepository.save(livro);
    }

    public Livro atualizar(Long id, Livro dadosAtualizados) {
        Livro livroExistente = buscarPorId(id);
        validarLivro(dadosAtualizados);

        if (livroRepository.existsByIsbnAndIdNot(dadosAtualizados.getIsbn(), id)) {
            throw new RegraDeNegocioException("Já existe outro livro cadastrado com o ISBN informado.");
        }

        livroExistente.setTitulo(dadosAtualizados.getTitulo());
        livroExistente.setAutor(dadosAtualizados.getAutor());
        livroExistente.setIsbn(dadosAtualizados.getIsbn());
        livroExistente.setAno(dadosAtualizados.getAno());
        livroExistente.setGenero(dadosAtualizados.getGenero());

        return livroRepository.save(livroExistente);
    }

    public void excluir(Long id) {
        Livro livro = buscarPorId(id);
        livroRepository.delete(livro);
    }

    private void validarLivro(Livro livro) {
        if (livro.getTitulo() == null || livro.getTitulo().isBlank()) {
            throw new RegraDeNegocioException("O título é obrigatório.");
        }

        if (livro.getAutor() == null || livro.getAutor().isBlank()) {
            throw new RegraDeNegocioException("O autor é obrigatório.");
        }

        if (livro.getIsbn() == null || livro.getIsbn().isBlank()) {
            throw new RegraDeNegocioException("O ISBN é obrigatório.");
        }

        if (livro.getAno() == null || livro.getAno() < 1000 || livro.getAno() > 2100) {
            throw new RegraDeNegocioException("O ano deve estar entre 1000 e 2100.");
        }

        if (livro.getGenero() == null || livro.getGenero().isBlank()) {
            throw new RegraDeNegocioException("O gênero é obrigatório.");
        }
    }
}
