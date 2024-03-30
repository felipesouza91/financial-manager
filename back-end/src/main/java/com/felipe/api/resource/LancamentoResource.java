package com.felipe.api.resource;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.bind.annotation.RestController;

import com.felipe.api.event.RecursoCriadoEvent;
import com.felipe.api.exception.EntidadeNaoEncontradaException;
import com.felipe.api.model.Lancamento;
import com.felipe.api.repository.CategoriaRepository;
import com.felipe.api.repository.ContaRepository;
import com.felipe.api.repository.LancamentoRepository;
import com.felipe.api.repository.filter.LancamentoFilter;
import com.felipe.api.repository.projection.ResumoLancamento;
import com.felipe.api.secutiry.FincSecurity;

@RestController
@RequestMapping("/lancamentos")
public class LancamentoResource {

	@Autowired
	private LancamentoRepository lancamentoRepository;
	
	@Autowired
	private ContaRepository contaRepository;
		
	@Autowired
	private CategoriaRepository categoriaRepository;
	
	@Autowired
	private ApplicationEventPublisher publisher;
	
	@Autowired
	private FincSecurity security;
	
	@GetMapping
	@PreAuthorize("isAuthenticated()")
	public Page<Lancamento> pesquisar(LancamentoFilter lancamentoFilter, Pageable pageable) {
		return lancamentoRepository.filtrar(lancamentoFilter, pageable);
		
	}
	
	@GetMapping(params="resumo")
	@PreAuthorize("isAuthenticated()")
	public Page<ResumoLancamento> resumir(LancamentoFilter lancamentoFilter, Pageable pageable) {
		return lancamentoRepository.resumir(lancamentoFilter, pageable);
	}
	
	@GetMapping("/{codigo}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Lancamento> buscarPeloCodigo(@PathVariable Long codigo) {
		Lancamento lancamento = findLancamentoId(codigo);
		return lancamento != null ? ResponseEntity.ok(lancamento) : ResponseEntity.notFound().build();
	}

	
	
	@PostMapping
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Lancamento> criar(@Valid @RequestBody Lancamento lancamento, HttpServletResponse response) {
		try {
			Lancamento lancamentoSalvo = salvar(lancamento);
			publisher.publishEvent(new RecursoCriadoEvent(this, response, lancamentoSalvo.getCodigo()));
			return ResponseEntity.status(HttpStatus.CREATED).body(lancamentoSalvo);
		}catch (EntidadeNaoEncontradaException e) {
			return  ResponseEntity.badRequest().build();
		}
		
	}

	@PutMapping("/{codigo}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Lancamento> atualizar(@PathVariable Long codigo, @RequestBody @Valid Lancamento lancamento){
		try {
			Lancamento lancamentoSalvo = buscarLancamentoExistente(codigo);
			 
			if (!this.contaRepository.findByCodigoAndUsuario(lancamento.getConta().getCodigo(), security.getUsuario()).isEmpty()) {
				BeanUtils.copyProperties(lancamento, lancamentoSalvo, "codigo");
				lancamentoSalvo = salvar(lancamentoSalvo);
				return ResponseEntity.ok(lancamentoSalvo);
			}
			return ResponseEntity.badRequest().build();
		}catch (Exception ex) {
			return ResponseEntity.badRequest().build();
		}
		
	}
	
	@DeleteMapping("/{codigo}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> remover(@PathVariable Long codigo) {
		try {
			this.findLancamentoId(codigo);
			lancamentoRepository.deleteById(codigo);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().build(); 
		}
		
	}
	
	private Lancamento salvar(Lancamento lancamento) {
		try {
			this.categoriaRepository.findByCodigoAndUsuario(lancamento.getCategoria().getCodigo(), security.getUsuario())
			.orElseThrow(() -> new EntidadeNaoEncontradaException());
	 
		this.contaRepository.findByCodigoAndUsuario(lancamento.getConta().getCodigo(), security.getUsuario())
		.orElseThrow(() -> new EntidadeNaoEncontradaException());
			Lancamento lancamentoSalvo = lancamentoRepository.save(lancamento);
			return lancamentoSalvo;
		} catch (Exception e) {
			throw e;
		}
		
	}
	
	private Lancamento findLancamentoId(Long codigo) {
		return lancamentoRepository.findByCodigoAndContaUsuario(codigo, security.getUsuario())
					.orElseThrow(() -> new EntidadeNaoEncontradaException());
	}
	
	private Lancamento buscarLancamentoExistente(Long codigo) {
		Lancamento lancamento = lancamentoRepository.findById(codigo).get();
		if ( lancamento == null ) {
			throw new IllegalArgumentException();
		}
		return lancamento;
	}
}
