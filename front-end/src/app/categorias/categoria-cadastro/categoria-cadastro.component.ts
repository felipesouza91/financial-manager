import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriaService } from '../categoria.service';
import { ToastyService } from 'ng2-toasty';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { Title } from '@angular/platform-browser';
import { Categoria } from 'app/core/model';

@Component({
  selector: 'app-categoria-cadastro',
  templateUrl: './categoria-cadastro.component.html',
  styleUrls: ['./categoria-cadastro.component.css']
})
export class CategoriaCadastroComponent implements OnInit {

  editando = false;
  formCadastro: FormGroup;
  codigo: number;
  constructor(
    private categoriaService: CategoriaService,
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
    this.categoriaService.listarPorCodigo(codigo)
      .then( categoria => {
        this.title.setTitle(`Editando ${categoria.nome}`)
        this.formCadastro.patchValue(categoria)
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
    this.categoriaService.adicionar(this.formCadastro.value)
      .then(categoria => {
        this.toasty.success('Categoria adicionado com sucesso!');
        this.router.navigate(['/categorias', categoria.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizar() {
    this.categoriaService.atualizar(this.codigo, this.formCadastro.value as Categoria)
    .then(categoria => {
      this.toasty.success('Categoria atualizada com sucesso!');
      this.router.navigate(['/categorias', categoria.codigo]);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  iniciaFormulario() {
    this.formCadastro = new FormGroup({
      nome: new FormControl(null, Validators.required)
    });
  }
}
