CREATE TABLE conta (
	codigo BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
	descricao VARCHAR(50) NOT NULL,
	codigo_usuario BIGINT(20) NOT NULL,
	ativo bit not null,
	FOREIGN KEY (codigo_usuario) REFERENCES usuario(codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

alter table lancamento add COLUMN codigo_conta BIGINT(20) not null;

alter table lancamento add constraint fk_lanc_conta foreign key (codigo_conta) REFERENCES conta (codigo);
