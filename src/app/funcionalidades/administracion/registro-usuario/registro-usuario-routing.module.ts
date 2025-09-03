import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroUsuarioComponent } from './registro-usuario.component';
import { AuthGuard } from '../../../nucleo/guardias/auth.guard';
import { RoleGuard } from '../../../nucleo/guardias/role.guard';

const routes: Routes = [
  {
    path: '',
    component: RegistroUsuarioComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['admin']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroUsuarioRoutingModule { }
