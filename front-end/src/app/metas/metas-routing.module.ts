import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from 'app/seguranca/auth.guard';
import { MetasPesquisasComponent } from './metas-pesquisas/metas-pesquisas.component';
import { MetasCadastroComponent } from './metas-cadastro/metas-cadastro.component';


const routes: Routes = [
  {
    path: 'metas',
    component: MetasPesquisasComponent,
    canActivate: [AuthGuard],
    data: { roles: ['8']}
  },
  {
    path: 'metas/novo',
    component: MetasCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['6']}
  },
  {
    path: 'metas/:codigo',
    component: MetasCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['6']}
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MetasRoutingModule { }
