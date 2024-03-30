import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { ConfirmationService } from 'primeng/primeng';
import { MetaService } from '../metas.service';
import { Meta } from 'app/core/model';

@Component({
  selector: 'app-metas-pesquisas',
  templateUrl: './metas-pesquisas.component.html',
  styleUrls: ['./metas-pesquisas.component.css']
})
export class MetasPesquisasComponent implements OnInit {

  formPesquisa: FormGroup;

  @ViewChild('tabela') grid;
  metas = [];

  constructor(
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private metaService: MetaService
  ) { }

  ngOnInit() {
    this.iniciaFormulario();
    this.pesquisar();
  
  }

  pesquisar() {
    this.metaService.listarTodas(this.formPesquisa.value.descricao)
    .then(resp => {
      this.metas = resp
    } );
    
  }

  confirmarExclusao(meta: Meta) {
    this.confirmation.confirm({
      message: `Tem certeza que deseja excluir categoria: ${meta.descricao}?`,
      accept: () => {
        this.excluir(meta.codigo);
      }
    });
  }

  excluir(codigo: number) {
    this.metaService.excluir(codigo)
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
      descricao: new FormControl()
    });
  }


}
