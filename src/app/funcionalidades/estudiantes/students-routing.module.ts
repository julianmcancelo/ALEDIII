import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormularioEstudianteComponent } from './formulario-estudiante/formulario-estudiante.component';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-estudiantes/student-list.component').then(c => c.StudentListComponent)
  },
  {
    path: 'nuevo',
    component: FormularioEstudianteComponent
  },
  {
    path: 'editar/:id',
    component: FormularioEstudianteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
