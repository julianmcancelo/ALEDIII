/**
 * @file registro-usuario.module.ts
 * @description Módulo para la funcionalidad de registro de usuarios
 * Este módulo maneja la creación de nuevos usuarios en el sistema
 * Actualizado para usar el componente principal con la estructura MySQL completa
 * 
 * TP Final Algoritmos y Estructuras de Datos III - 2025
 * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
 * Profesor: Sebastian Saldivar
 */
import { NgModule } from '@angular/core';  // Decorador principal para crear módulos
import { CommonModule } from '@angular/common';  // Módulo que provee directivas comunes
import { ReactiveFormsModule } from '@angular/forms';  // Soporte para formularios reactivos
import { RegistroUsuarioRoutingModule } from './registro-usuario-routing.module';  // Configuración de rutas
import { RegistroUsuarioComponent } from './registro-usuario.component';  // Componente principal (actualizado con estructura MySQL)

/**
 * @class RegistroUsuarioModule
 * @description Módulo que agrupa toda la funcionalidad relacionada con el registro de usuarios
 */
@NgModule({
  declarations: [], // No se declaran componentes aquí ya que RegistroUsuarioComponent es standalone
  imports: [
    CommonModule,                   // Proporciona directivas como ngIf y ngFor
    ReactiveFormsModule,            // Necesario para manejar formularios reactivos
    RegistroUsuarioRoutingModule,   // Configuración de rutas para esta funcionalidad
    RegistroUsuarioComponent        // Componente principal importado con estructura MySQL completa (es standalone)
  ]
})
export class RegistroUsuarioModule { }
