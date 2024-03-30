import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { ConfirmationService } from 'primeng/primeng';
import { ContaService } from '../conta.service';
import { Conta } from 'app/core/model';

@Component({
  selector: 'app-conta-pesquisa',
  templateUrl: './conta-pesquisa.component.html',
  styleUrls: ['./conta-pesquisa.component.css']
})
export class ContaPesquisaComponent implements OnInit {

  formPesquisa: FormGroup;
  @ViewChild('tabela') grid;
  contas = [];

  constructor(
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private contaService: ContaService
  ) { }

  ngOnInit() {
    this.iniciarconta();
    this.iniciaFormulario();
  }

  iniciarconta() {
    this.contaService.listarTodas()
      .then(resp => {
        this.contas = resp
      } );
  }

  pesquisar() {
    this.contaService.listarTodas(this.formPesquisa.value.descricao)
    .then(resp => {
      this.contas = resp
    } );
    console.log(this.formPesquisa.value);
  }

  confirmarExclusao(conta: Conta) {
    this.confirmation.confirm({
      message: `Tem certeza que deseja excluir conta: ${conta.descricao}?`,
      accept: () => {
        this.excluir(conta.codigo);
      }
    });
  }

  excluir(codigo: number) {
    this.contaService.excluir(codigo)
      .then( () => {
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
      descricao: new FormControl()
    });
  }
}
