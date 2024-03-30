CREATE TABLE meta (
	codigo BIGINT(20) PRIMARY KEY AUTO_INCREMENT, 
	descricao VARCHAR(50) NOT NULL,
	valor decimal(19,2),
	codigo_usuario BIGINT(20) NOT NULL,
	codigo_categoria BIGINT(20) NOT NULL,
	FOREIGN KEY (codigo_usuario) REFERENCES usuario(codigo),
	FOREIGN KEY (codigo_categoria) REFERENCES categoria(codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;