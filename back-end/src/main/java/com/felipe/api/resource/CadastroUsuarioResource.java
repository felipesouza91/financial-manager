package com.felipe.api.resource;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.felipe.api.model.Usuario;
import com.felipe.api.repository.UsuarioRepository;

@RestController
@RequestMapping(path = "/cadastro")
public class CadastroUsuarioResource {
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private UsuarioRepository usuarioDao;
	
	@GetMapping
	private String getTest() {
		return "teste";
	}
	
	@PostMapping
	public ResponseEntity<?> cadastro(@RequestBody @Valid Usuario usuario) {
		usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
		usuarioDao.save(usuario);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
	
}
