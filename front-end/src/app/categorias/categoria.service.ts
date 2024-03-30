import { AuthHttp } from 'angular2-jwt';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { environment } from 'environments/environment';
import { Categoria } from 'app/core/model';

@Injectable()
export class CategoriaService {

  categoriasUrl: string;

  constructor(private http: AuthHttp) {
    this.categoriasUrl = `${environment.apiUrl}/categorias`
  }

  listarTodas(nome = ''): Promise<any> {
    nome = nome === null ? '' : nome;
    return this.http.get(this.categoriasUrl , {params: {'nome': nome}})
      .toPromise()
      .then(response => response.json());
  }

  listarPorCodigo(codigo: number): Promise<Categoria> {
    return this.http.get(`${this.categoriasUrl}/${codigo}`)
      .toPromise()
      .then(response => response.json() as Categoria );
  }

  adicionar(categoria: Categoria): Promise<Categoria> {
    return this.http.post(this.categoriasUrl, categoria)
      .toPromise()
      .then(response => response.json() as Categoria);
  }

  atualizar(codigo: number, categoria: Categoria): Promise<Categoria> {

    return this.http.put(`${this.categoriasUrl}/${codigo}`, categoria)
      .toPromise()
      .then(response => response.json() as Categoria);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.categoriasUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }
}
