
export class Categoria {
  codigo: number;
  nome: string;
}

export class Usuario {
  codigo: number;
  nome: string;
  email: string;
  senha: string;
}

export class Conta {
  codigo: number;
  descricao: string;
  ativo: boolean
}

export class Meta {
  codigo: number;
  descricao: string;
  valor: number;
  categoria = new Categoria();
}

export class Lancamento {
  codigo: number;
  tipo = 'RECEITA';
  descricao: string;
  conta = new Conta()
  dataVencimento: Date;
  dataPagamento: Date;
  valor: number;
  observacao: string;
  categoria = new Categoria();
}
