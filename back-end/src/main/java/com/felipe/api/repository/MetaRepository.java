package com.felipe.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.felipe.api.model.Meta;
import com.felipe.api.model.Usuario;

public interface MetaRepository extends JpaRepository<Meta, Long>{

	public List<Meta> findByUsuario(Usuario usuario);
	
	public List<Meta> findByDescricaoContainingAndUsuario(String descricao, Usuario usuario);
	
	public Optional<Meta> findByCodigoAndUsuario(Long codigo, Usuario usuario);
}
