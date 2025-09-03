import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentFormComponent } from './student-form/student-form.component';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./student-list/student-list.component').then(c => c.StudentListComponent)
  },
  {
    path: 'nuevo',
    component: StudentFormComponent
  },
  {
    path: 'editar/:id',
    component: StudentFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
