import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MetaService } from '../metas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title} from '@angular/platform-browser';
import { Meta } from 'app/core/model';
import { CategoriaService } from 'app/categorias/categoria.service';


@Component({
  selector: 'app-metas-cadastro',
  templateUrl: './metas-cadastro.component.html',
  styleUrls: ['./metas-cadastro.component.css']
})
export class MetasCadastroComponent implements OnInit {

  editando = false;
  formCadastro: FormGroup;
  categorias = [];
  codigo: number;
  constructor(
    private metaService: MetaService,
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
    this.carregarCategorias();
    this.title.setTitle('Nova meta');

    if (this.codigo) {
      this.editando = true;
      this.carregarLancamento(this.codigo);
    }
    
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then(categorias => {
        this.categorias = categorias
          .map(c => ({ label: c.nome, value: c.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarLancamento(codigo: number) {
    this.metaService.listarPorCodigo(codigo)
      .then( meta => {
        this.title.setTitle(`Editando ${meta.descricao}`)
        this.formCadastro.patchValue(meta)
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
    this.metaService.adicionar(this.formCadastro.value)
      .then(meta => {
        this.toasty.success('Categoria adicionado com sucesso!');
        this.router.navigate(['/metas', meta.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizar() {
    this.metaService.atualizar(this.codigo, this.formCadastro.value as Meta)
    .then(meta => {
      this.toasty.success('Categoria atualizada com sucesso!');
      this.router.navigate(['/metas', meta.codigo]);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  iniciaFormulario() {
    this.formCadastro = new FormGroup({
      descricao: new FormControl(null, Validators.required),
      valor: new FormControl(null, Validators.required),
      categoria: new FormGroup({
        codigo: new FormControl(null, Validators.required)
      })
    });
  }
 
}
