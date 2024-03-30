package com.felipe.api.model;

import java.math.BigDecimal;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Meta.class)
public abstract class Meta_ {

	public static volatile SingularAttribute<Meta, Long> codigo;
	public static volatile SingularAttribute<Meta, Categoria> categoria;
	public static volatile SingularAttribute<Meta, BigDecimal> valor;
	public static volatile SingularAttribute<Meta, Usuario> usuario;
	public static volatile SingularAttribute<Meta, Long> descricao;

	public static final String CODIGO = "codigo";
	public static final String CATEGORIA = "categoria";
	public static final String VALOR = "valor";
	public static final String USUARIO = "usuario";
	public static final String DESCRICAO = "descricao";

}

