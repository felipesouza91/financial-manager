import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ContaService } from '../conta.service';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { Conta } from 'app/core/model';

@Component({
  selector: 'app-conta-cadastro',
  templateUrl: './conta-cadastro.component.html',
  styleUrls: ['./conta-cadastro.component.css']
})
export class ContaCadastroComponent implements OnInit {
  editando = false;
  formCadastro: FormGroup;
  codigo: number;
  constructor(
    private contaService: ContaService,
    private toasty: ToastyService,
    private route: ActivatedRoute,
    private title: Title,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit() {
    this.iniciaFormulario();
    this.codigo = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo lançamento');

    if (this.codigo) {
      this.editando = true;
      this.carregarLancamento(this.codigo);
    }

  }

  carregarLancamento(codigo: number) {
    this.contaService.listarPorCodigo(codigo)
      .then( contas => {
        this.title.setTitle(`Editando ${contas.descricao}`)
        this.formCadastro.patchValue(contas)
      });
  }

  salvar() {
    if(this.codigo) {
      this.atualizar();
    }
    else {
      this.newCategoria();
    }
  }

  newCategoria() {
    this.contaService.adicionar(this.formCadastro.value)
      .then(categoria => {
        this.toasty.success('Contas adicionado com sucesso!');
        this.router.navigate(['/contas', categoria.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizar() {
    this.contaService.atualizar(this.codigo, this.formCadastro.value as Conta)
    .then(categoria => {
      this.toasty.success('Conta atualizada com sucesso!');
      this.router.navigate(['/contas', categoria.codigo]);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  iniciaFormulario() {
    this.formCadastro = new FormGroup({
      descricao: new FormControl(null, Validators.required),
      ativo: new FormControl(null, Validators.required)
    });
  } 
}
