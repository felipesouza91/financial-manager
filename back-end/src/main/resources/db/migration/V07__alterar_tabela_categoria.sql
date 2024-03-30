alter table categoria add codigo_usuario bigint(20) not null;
alter table categoria add constraint fk_user_categoria foreign key (codigo_usuario) REFERENCES usuario(codigo);