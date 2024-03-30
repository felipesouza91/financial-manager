package com.felipe.api.secutiry;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import com.felipe.api.model.Usuario;

@Component
public class FincSecurity {

	public Authentication getAuthentication() {
		return SecurityContextHolder.getContext().getAuthentication();
	}
	
	public Usuario getUsuario() {
		Jwt jwt = (Jwt) getAuthentication().getPrincipal();
		Usuario usuario = new Usuario();
		usuario.setCodigo(jwt.getClaim("usuario_id"));
		return usuario;
	}
	
}
