import { AuthHttp } from 'angular2-jwt';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { environment } from 'environments/environment';
import { Meta } from 'app/core/model';

@Injectable() 
export class MetaService {

  metasUrl: string;

  constructor(private http: AuthHttp) {
    this.metasUrl = `${environment.apiUrl}/metas`
  }

  listarTodas(nome = ''): Promise<any> {
    nome = nome === null ? '' : nome;
    return this.http.get(this.metasUrl , {params: {'descricao': nome}})
      .toPromise()
      .then(response => response.json());
  }

  listarPorCodigo(codigo: number): Promise<Meta> {
    return this.http.get(`${this.metasUrl}/${codigo}`)
      .toPromise()
      .then(response => response.json() as Meta );
  }

  adicionar(meta: Meta): Promise<Meta> {
    return this.http.post(this.metasUrl, meta)
      .toPromise()
      .then(response => response.json() as Meta);
  }

  atualizar(codigo: number, meta: Meta): Promise<Meta> {

    return this.http.put(`${this.metasUrl}/${codigo}`, meta)
      .toPromise()
      .then(response => response.json() as Meta);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.metasUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }
}
