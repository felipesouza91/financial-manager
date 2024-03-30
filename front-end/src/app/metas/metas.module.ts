import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetasPesquisasComponent } from './metas-pesquisas/metas-pesquisas.component';
import { MetasCadastroComponent } from './metas-cadastro/metas-cadastro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule, ButtonModule, DataTableModule,
  SelectButtonModule, DropdownModule, ToggleButtonModule } from 'primeng/primeng';
import { MetasRoutingModule } from './metas-routing.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    SelectButtonModule,
    DropdownModule,
    ToggleButtonModule,
    
    SharedModule,
    MetasRoutingModule
  ],
  declarations: [MetasPesquisasComponent, MetasCadastroComponent]
})
export class MetasModule { }
