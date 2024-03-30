import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CategoriaService } from '../categoria.service';
import { FormGroup, FormControlName, FormControl } from '@angular/forms';
import { ToastyService } from 'ng2-toasty';
import { ConfirmationService } from 'primeng/primeng';
import { Categoria } from 'app/core/model';
import { ErrorHandlerService } from 'app/core/error-handler.service';

@Component({
  selector: 'app-categoria-pesquisas',
  templateUrl: './categoria-pesquisas.component.html',
  styleUrls: ['./categoria-pesquisas.component.css']
})
export class CategoriaPesquisasComponent implements OnInit {

  
  formPesquisa: FormGroup;
  @ViewChild('tabela') grid;
  categorias = [];

  constructor(
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit() {
    this.iniciarCategoria();
    this.iniciaFormulario();
  }

  iniciarCategoria() {
    this.categoriaService.listarTodas()
      .then(resp => {
        console.log(resp);
        this.categorias = resp
      } );
  }

  pesquisar() {
    this.categoriaService.listarTodas(this.formPesquisa.value.nome)
    .then(resp => {
      console.log(resp);
      this.categorias = resp
    } );
    console.log(this.formPesquisa.value);
  }

  confirmarExclusao(categoria: Categoria) {
    this.confirmation.confirm({
      message: `Tem certeza que deseja excluir categoria: ${categoria.nome}?`,
      accept: () => {
        this.excluir(categoria.codigo);
      }
    });
  }

  excluir(codigo: number) {
    this.categoriaService.excluir(codigo)
      .then( () => {
        console.log('Aqui');
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.first = 0;
        }
        this.toasty.success('Lançamento excluído com sucesso!');
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  iniciaFormulario() {
    this.formPesquisa = new FormGroup({
      nome: new FormControl()
    });
  }
}