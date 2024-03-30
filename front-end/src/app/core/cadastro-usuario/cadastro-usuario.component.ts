import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CadastroService } from '../cadastro.service';
import { Usuario } from "../model";
import { ErrorHandlerService } from '../error-handler.service';
import { ToastyService } from 'ng2-toasty';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent implements OnInit {

  formCadastro: FormGroup;

  constructor(
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private cadastroService: CadastroService
  ) { }

  ngOnInit() {
    this.iniciaForm();
  }

  salvar() {
    this.cadastroService.cadastrar(this.formCadastro.value as Usuario)
      .then(resp => {
        this.toasty.success('Cadastro realizado');
        setTimeout(() => {
         }, 3500);
        this.router.navigate(['/login']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  iniciaForm() {
    this.formCadastro = new FormGroup({
      nome: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      senha: new FormControl(null, Validators.required)
    });
    }
}
