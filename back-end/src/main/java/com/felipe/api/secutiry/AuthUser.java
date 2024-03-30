package com.felipe.api.secutiry;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import com.felipe.api.model.Usuario;

import lombok.Getter;

@Getter
public class AuthUser extends User{

	private static final long serialVersionUID = 1L;
	
	
	private Usuario usuario;
	private Long id;
	private String fullName;
	
	public AuthUser(Usuario usuario, Collection<GrantedAuthority> collection ) {
		super(usuario.getEmail(), usuario.getSenha(), collection);
		this.fullName = usuario.getNome();
		this.id = usuario.getCodigo();
		this.usuario = usuario;
	}

}
