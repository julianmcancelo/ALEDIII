/**
 * @file registro-usuario-routing.module.ts
 * @description Configuración de rutas para el módulo de registro de usuarios
 * 
 * TP Final Algoritmos y Estructuras de Datos III - 2025
 * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
 * Profesor: Sebastian Saldivar
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroUsuarioComponent } from './registro-usuario.component';
import { AuthGuard } from '../../../nucleo/guardias/auth.guard';
import { RoleGuard } from '../../../nucleo/guardias/role.guard';

/**
 * @constant routes
 * @description Definición de rutas para el módulo de registro de usuarios
 */
const routes: Routes = [
  // Ruta para el formulario de registro (ya incluye la estructura MySQL completa)
  {
    path: '',
    component: RegistroUsuarioComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['admin']
    }
  }
];

/**
 * @class RegistroUsuarioRoutingModule
 * @description Módulo de configuración de rutas para el registro de usuarios
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroUsuarioRoutingModule { }
