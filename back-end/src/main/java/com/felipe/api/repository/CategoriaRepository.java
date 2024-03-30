package com.felipe.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.felipe.api.model.Categoria;
import com.felipe.api.model.Usuario;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

	public List<Categoria> findByUsuario(Usuario usuario);

	public List<Categoria> findByNomeContainingAndUsuario(String nome,Usuario usuario);

	
	public Optional<Categoria> findByCodigoAndUsuario(Long codigo, Usuario usuario);
}
