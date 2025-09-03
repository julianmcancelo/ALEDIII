import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroUsuarioRoutingModule } from './registro-usuario-routing.module';
import { RegistroUsuarioComponent } from './registro-usuario.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RegistroUsuarioRoutingModule,
    RegistroUsuarioComponent
  ]
})
export class RegistroUsuarioModule { }
