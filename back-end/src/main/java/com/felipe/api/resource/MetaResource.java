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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.felipe.api.event.RecursoCriadoEvent;
import com.felipe.api.exception.EntidadeNaoEncontradaException;
import com.felipe.api.model.Meta;
import com.felipe.api.repository.CategoriaRepository;
import com.felipe.api.repository.MetaRepository;
import com.felipe.api.secutiry.FincSecurity;

@RestController
@RequestMapping(path = "/metas")
public class MetaResource {

	@Autowired
	private MetaRepository metaRepository;
	
	@Autowired
	private CategoriaRepository categoriaRepository;
	
	@Autowired
	private ApplicationEventPublisher publisher;
	
	@Autowired
	private FincSecurity security;
	
	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	public List<Meta> buscarTodos(@RequestParam(required = false, defaultValue = "") String descricao){
		return this.metaRepository.findByDescricaoContainingAndUsuario(descricao, security.getUsuario());
	}
	
	@GetMapping("{codigo}")
	public ResponseEntity<Meta> buscarPorId(@PathVariable Long codigo) {
		try {
			Meta meta = findByCodigo(codigo);
			return ResponseEntity.ok().body(meta);
		} catch (Exception e) {
			return ResponseEntity.notFound().build();
		}
	}
	

	@PostMapping
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Meta> salvar(@RequestBody @Valid Meta meta, HttpServletResponse response) {
		
		if (categoriaRepository.findByCodigoAndUsuario(
				meta.getCategoria().getCodigo(), security.getUsuario()).isEmpty() ) {
			return ResponseEntity.badRequest().build();
		}
		meta.setUsuario(security.getUsuario());
		var contaSalva = metaRepository.save(meta);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, contaSalva.getCodigo()));
		return ResponseEntity.status(HttpStatus.CREATED).body(contaSalva);
	}
	
	@PutMapping("{idConta}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Meta> atualizar(@PathVariable Long idConta,@Valid @RequestBody Meta meta,
				HttpServletResponse response) {
		Meta metaSalva = null;
		try {
			metaSalva = findByCodigo(idConta);
		}catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		System.out.println( categoriaRepository.findByCodigoAndUsuario(
						meta.getCategoria().getCodigo(), security.getUsuario()).isEmpty());
		if (!metaSalva.getUsuario().getCodigo().equals(security.getUsuario().getCodigo())
				|| categoriaRepository.findByCodigoAndUsuario(
						meta.getCategoria().getCodigo(), security.getUsuario()).isEmpty() ) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		BeanUtils.copyProperties(meta, metaSalva, "codigo","usuario");
		metaSalva = metaRepository.save(metaSalva);
		return ResponseEntity.status(HttpStatus.OK).body(metaSalva);
	}
	
	@DeleteMapping("{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> delete(@PathVariable Long id) {
		Meta meta = null;
		try {
			meta = findByCodigo(id);
		}catch (Exception e) {
			return ResponseEntity.notFound().build();
		}
		if(meta.getUsuario().getCodigo().equals(security.getUsuario().getCodigo())) {
			this.metaRepository.deleteById(id);
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.badRequest().build();
		}
		
	}

	private Meta findByCodigo(Long codigo) {
		return metaRepository.findByCodigoAndUsuario(codigo, security.getUsuario()).orElseThrow(()-> new EntidadeNaoEncontradaException());
	}
}
