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
import com.felipe.api.model.Conta;
import com.felipe.api.repository.ContaRepository;
import com.felipe.api.secutiry.FincSecurity;

@RestController
@RequestMapping("/contas")
public class ContaResource {

	@Autowired
	private ContaRepository contaRespository;
	
	@Autowired
	private ApplicationEventPublisher publisher;
	
	@Autowired
	private FincSecurity security;
	
	@GetMapping
	@PreAuthorize("isAuthenticated()")
	public List<Conta> buscarTodos(@RequestParam(defaultValue = "", required = false) String descricao) {
		return this.contaRespository.findByDescricaoContainingAndUsuario(descricao, security.getUsuario());
	}
	
	@GetMapping("{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Conta> buscarPorCodigo(@PathVariable Long id) {
		Conta conta = findByIdAndUsuario(id);
		return ResponseEntity.ok(conta);
	}

	@PostMapping
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Conta> salvar(@RequestBody @Valid Conta conta, HttpServletResponse response) {
		conta.setUsuario(security.getUsuario());
		var contaSalva = contaRespository.save(conta);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, contaSalva.getCodigo()));
		return ResponseEntity.status(HttpStatus.CREATED).body(contaSalva);
	}
	
	@PutMapping("{idConta}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Conta> atualizar(@PathVariable Long idConta,@Valid @RequestBody Conta conta,
				HttpServletResponse response) {
		Conta contaSalva = null;
		try {
			contaSalva = getContaById(idConta);
		}catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		
		if (!contaSalva.getUsuario().getCodigo().equals(security.getUsuario().getCodigo())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		BeanUtils.copyProperties(conta, contaSalva, "codigo","usuario");
		contaSalva = contaRespository.save(contaSalva);
		return ResponseEntity.status(HttpStatus.OK).body(contaSalva);
	}
	
	@DeleteMapping("{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> delete(@PathVariable Long id) {
		Conta conta = null;
		try {
			conta = getContaById(id);
		}catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		}
		if(conta.getUsuario().getCodigo().equals(security.getUsuario().getCodigo())) {
			this.contaRespository.deleteById(id);
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.badRequest().build();
		}
		
	}
	
	private Conta findByIdAndUsuario(Long id) {
		return contaRespository.findByCodigoAndUsuario(id, security.getUsuario()).orElseThrow(() -> new EntidadeNaoEncontradaException());
	}
	
	private Conta getContaById(Long id) {
		return this.contaRespository.findById(id)
					.orElseThrow(() -> new EntidadeNaoEncontradaException());
	}
}
