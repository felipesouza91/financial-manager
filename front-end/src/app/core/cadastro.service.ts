import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { environment } from 'environments/environment';
import { Usuario } from './model';
import { Http } from '@angular/http';



@Injectable() 
export class CadastroService {

  cadastroUrl: string;

  constructor(private http: Http) {
    this.cadastroUrl = `${environment.apiUrl}/cadastro`
  }


  cadastrar(usuario: Usuario): Promise<void> {
    return this.http.post(this.cadastroUrl, usuario)
      .toPromise()
      .then(() => null);
  }

}
