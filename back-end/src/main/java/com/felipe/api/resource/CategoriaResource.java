package com.felipe.api.resource;

import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.felipe.api.event.RecursoCriadoEvent;
import com.felipe.api.exception.EntidadeNaoEncontradaException;
import com.felipe.api.model.Categoria;
import com.felipe.api.repository.CategoriaRepository;
import com.felipe.api.secutiry.FincSecurity;

@RestController
@RequestMapping("/categorias")
public class CategoriaResource {

	@Autowired
	private CategoriaRepository categoriaRepository;
	
	@Autowired
	private ApplicationEventPublisher publisher;
	
	@Autowired
	private FincSecurity security;
	
	@GetMapping
	@PreAuthorize("isAuthenticated()")
	public List<Categoria> listar(@RequestParam(required = false, defaultValue = "") String nome) {
		
		return categoriaRepository.findByNomeContainingAndUsuario(nome,security.getUsuario());
	}
	
	@GetMapping("/{codigo}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Categoria> buscarPeloCodigo(@PathVariable Long codigo) {
		 Categoria categoria = findByIdAndUsuario(codigo);
		 return categoria != null ? ResponseEntity.ok(categoria) : ResponseEntity.notFound().build();		 
	}


	
	@PostMapping
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Categoria> criar(@Valid @RequestBody Categoria categoria, HttpServletResponse response) {
		categoria.setUsuario(security.getUsuario());
		Categoria categoriaSalva = categoriaRepository.save(categoria);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, categoriaSalva.getCodigo()));
		return ResponseEntity.status(HttpStatus.CREATED).body(categoriaSalva);
	}
	
	@PutMapping("{idCategoria}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Categoria> atualizar(@PathVariable Long idCategoria,@Valid @RequestBody Categoria categoria,
				HttpServletResponse response) {
		Categoria categoriaSalva = findById(idCategoria);
		
		if(categoria == null) {
			ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		if (!categoriaSalva.getUsuario().getCodigo().equals(security.getUsuario().getCodigo())) {
			ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		BeanUtils.copyProperties(categoria, categoriaSalva, "codigo","usuario");
		categoriaSalva = categoriaRepository.save(categoriaSalva);
		return ResponseEntity.status(HttpStatus.OK).body(categoriaSalva);
	}
	
	@DeleteMapping("{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> excluir(@PathVariable Long id) {
		Categoria categoriaSalva = findByIdAndUsuario(id);
		try {
			if(categoriaSalva.getUsuario().getCodigo().equals(security.getUsuario().getCodigo())) {
				categoriaRepository.deleteById(id);
				return ResponseEntity.noContent().build();
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}

		} catch (Exception e) {
			throw new RuntimeException();
		}
	}
	
	private Categoria findByIdAndUsuario(Long codigo) {
		return categoriaRepository.findByCodigoAndUsuario(codigo, security.getUsuario())
				.orElseThrow(() -> new EntidadeNaoEncontradaException());
	}
	
	private Categoria findById(Long id ) {
		return categoriaRepository.findById(id).isPresent() ? categoriaRepository.findById(id).get() : null;
	}
	
}
