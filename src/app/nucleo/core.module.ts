/**
 * @file core.module.ts
 * @description Módulo principal del núcleo de la aplicación
 * Este módulo centraliza la funcionalidad principal y los componentes
 * compartidos que se utilizarán en toda la aplicación.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Importamos el módulo de rutas del núcleo que define las rutas principales
 * y la estructura de navegación de esta sección
 */
import { CoreRoutingModule } from './core-routing.module';

/**
 * @class NucleoModule
 * @description Módulo núcleo que proporciona la funcionalidad central de la aplicación
 * Actúa como un contenedor para servicios, guardias, interceptores y componentes compartidos
 * que son fundamentales para el funcionamiento de la aplicación.
 */
@NgModule({
  // No se declaran componentes directamente en este módulo
  declarations: [],
  imports: [
    CommonModule,  // Módulo que proporciona directivas Angular básicas como ngIf, ngFor, etc.
    CoreRoutingModule  // Configuración de rutas específicas del núcleo
  ]
})
export class NucleoModule { }
