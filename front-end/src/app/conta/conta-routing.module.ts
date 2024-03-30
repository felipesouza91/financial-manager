import { AuthGuard } from 'app/seguranca/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ContaPesquisaComponent } from './conta-pesquisa/conta-pesquisa.component';
import { ContaCadastroComponent } from './conta-cadastro/conta-cadastro.component';


const routes: Routes = [
  {
    path: 'contas',
    component: ContaPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['5']}
  },
  {
    path: 'contas/novo',
    component: ContaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['5']}
  },
  {
    path: 'contas/:codigo',
    component: ContaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['5']}
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ContaRoutingModule { }
