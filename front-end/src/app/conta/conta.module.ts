import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContaPesquisaComponent } from './conta-pesquisa/conta-pesquisa.component';
import { ContaRoutingModule } from './conta-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { ButtonModule } from 'primeng/components/button/button';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { SelectButtonModule } from 'primeng/components/selectbutton/selectbutton';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { SharedModule } from 'primeng/components/common/shared';
import { ContaCadastroComponent } from './conta-cadastro/conta-cadastro.component';
import {ToggleButtonModule} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    InputTextModule,
    ButtonModule,
    DataTableModule,
    SelectButtonModule,
    DropdownModule,
    ToggleButtonModule,
    
    SharedModule,

    ContaRoutingModule
  ],
  declarations: [ContaPesquisaComponent, ContaCadastroComponent]
})
export class ContaModule { }
