import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from 'app/seguranca/auth.guard';
import { CategoriaPesquisasComponent } from './categoria-pesquisas/categoria-pesquisas.component';
import { CategoriaCadastroComponent } from './categoria-cadastro/categoria-cadastro.component';

const routes: Routes = [
  {
    path: 'categorias',
    component: CategoriaPesquisasComponent,
    canActivate: [AuthGuard],
    data: { roles: ['8']}
  },
  {
    path: 'categorias/novo',
    component: CategoriaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['6']}
  },
  {
    path: 'categorias/:codigo',
    component: CategoriaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['8']}
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CategoriasRoutingModule { }
