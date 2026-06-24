package com.gerenciamentolivros.repository;

import com.gerenciamentolivros.entity.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LivroRepository extends JpaRepository<Livro, Long> {

    boolean existsByIsbn(String isbn);

    boolean existsByIsbnAndIdNot(String isbn, Long id);

    @Query("""
            SELECT l FROM Livro l
            WHERE LOWER(l.titulo) LIKE LOWER(CONCAT('%', :termo, '%'))
               OR LOWER(l.autor) LIKE LOWER(CONCAT('%', :termo, '%'))
               OR LOWER(l.isbn) LIKE LOWER(CONCAT('%', :termo, '%'))
               OR LOWER(l.genero) LIKE LOWER(CONCAT('%', :termo, '%'))
            """)
    List<Livro> buscarPorTermo(@Param("termo") String termo);
}
