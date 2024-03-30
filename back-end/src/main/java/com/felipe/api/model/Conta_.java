package com.felipe.api.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Conta.class)
public abstract class Conta_ {

	public static volatile SingularAttribute<Conta, Long> codigo;
	public static volatile SingularAttribute<Conta, Boolean> ativo;
	public static volatile SingularAttribute<Conta, Usuario> usuario;
	public static volatile SingularAttribute<Conta, String> descricao;

	public static final String CODIGO = "codigo";
	public static final String ATIVO = "ativo";
	public static final String USUARIO = "usuario";
	public static final String DESCRICAO = "descricao";

}

