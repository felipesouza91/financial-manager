import { AuthHttp } from 'angular2-jwt';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { environment } from 'environments/environment';
import { Conta } from 'app/core/model';

@Injectable() 
export class ContaService {

  contasUrl: string;

  constructor(private http: AuthHttp) {
    this.contasUrl = `${environment.apiUrl}/contas`
  }

  listarTodas(nome = ''): Promise<any> {
    nome = nome === null ? '' : nome;
    return this.http.get(this.contasUrl , {params: {'descricao': nome}})
      .toPromise()
      .then(response => response.json());
  }

  listarPorCodigo(codigo: number): Promise<Conta> {
    return this.http.get(`${this.contasUrl}/${codigo}`)
      .toPromise()
      .then(response => response.json() as Conta );
  }

  adicionar(Conta: Conta): Promise<Conta> {
    return this.http.post(this.contasUrl, Conta)
      .toPromise()
      .then(response => response.json() as Conta);
  }

  atualizar(codigo: number, Conta: Conta): Promise<Conta> {

    return this.http.put(`${this.contasUrl}/${codigo}`, Conta)
      .toPromise()
      .then(response => response.json() as Conta);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.contasUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }
}
