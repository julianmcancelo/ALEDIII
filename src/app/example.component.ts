 /**
 * @file example.component.ts
 * @description Componente de ejemplo que demuestra las nuevas características de Angular 17
 * Incluye demostraciones de signals, nueva sintaxis de flujo de control y componentes independientes
 */
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * @class ExampleComponent
 * @description Componente que demuestra las características principales de Angular 17
 * Utiliza la nueva arquitectura de componentes independientes (standalone)
 */
@Component({
  selector: 'app-example', // Selector CSS para usar este componente: <app-example></app-example>
  standalone: true,        // Indica que es un componente independiente (no requiere un NgModule)
  imports: [CommonModule, FormsModule], // Importaciones necesarias para este componente
  // Plantilla del componente utilizando sintaxis de template literal
  template: `
    <div class="example-container">
      <h2>Demostración de Características de Angular 17</h2>
      
      <!-- Demostración de Signals -->
      <div class="section">
        <h3>Signals (Nuevo en Angular 17)</h3>
        <p>Contador: {{ count() }}</p>
        <p>Contador Doble: {{ doubleCount() }}</p>
        <button (click)="increment()">Incrementar</button>
        <button (click)="reset()">Reiniciar</button>
      </div>

      <!-- Demostración de la nueva sintaxis de flujo de control -->
      <div class="section">
        <h3>Nueva Sintaxis de Flujo de Control</h3>
        <!-- Uso de @if/@else para renderizado condicional -->
        @if (count() > 0) {
          <p class="positive">¡El contador es positivo!</p>
        } @else {
          <p class="zero">El contador es cero o negativo</p>
        }

        <!-- Uso de @for para bucles con seguimiento por ID y caso vacío -->
        @for (item of items(); track item.id) {
          <div class="item">{{ item.name }}</div>
        } @empty {
          <p>No hay elementos disponibles</p>
        }
      </div>

      <!-- Demostración de entrada de datos -->
      <div class="section">
        <h3>Entrada Interactiva</h3>
        <!-- Enlace bidireccional (two-way binding) con ngModel -->
        <input 
          [(ngModel)]="inputValue" 
          placeholder="Escribe algo..."
          class="input-field"
        >
        <p>Has escrito: {{ inputValue }}</p>
      </div>
    </div>
  `,
  // Estilos encapsulados para este componente utilizando CSS en template literal
  styles: [`
    /* Contenedor principal con ancho máximo y centrado */
    .example-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* Estilo para cada sección de demostración */
    .section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    /* Estilo para el título principal */
    h2 {
      color: #333;
      text-align: center;
      margin-bottom: 2rem;
    }

    /* Estilo para los subtítulos */
    h3 {
      color: #555;
      margin-bottom: 1rem;
    }

    /* Estilo para los botones */
    button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      margin: 0.25rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    /* Efecto hover para los botones */
    button:hover {
      background-color: #0056b3;
    }

    /* Estilo para texto positivo (verde) */
    .positive {
      color: #28a745;
      font-weight: bold;
    }

    /* Estilo para texto neutro (gris) */
    .zero {
      color: #6c757d;
    }

    /* Estilo para los elementos de la lista */
    .item {
      background-color: #e9ecef;
      padding: 0.5rem;
      margin: 0.25rem 0;
      border-radius: 4px;
    }

    /* Estilo para el campo de entrada */
    .input-field {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
  `]
})
/**
 * Clase principal del componente de ejemplo
 */
export class ExampleComponent {
  /**
   * @property count
   * @description Signal que contiene el valor del contador
   * Los signals son una nueva característica de Angular 17 para estado reactivo
   */
  count = signal(0); // Inicializado con valor 0
  
  /**
   * @property doubleCount
   * @description Signal computado que siempre contiene el doble del valor de count
   * Se actualiza automáticamente cuando count cambia
   */
  doubleCount = computed(() => this.count() * 2);
  
  /**
   * @property items
   * @description Signal que contiene un array de elementos para mostrar
   * Demuestra el uso de @for con la propiedad track para optimización
   */
  items = signal([
    { id: 1, name: 'Angular 17' },
    { id: 2, name: 'Componentes Independientes' },
    { id: 3, name: 'Signals' },
    { id: 4, name: 'Nuevo Flujo de Control' }
  ]);

  /**
   * @property inputValue
   * @description Propiedad para demostrar el enlace bidireccional con ngModel
   */
  inputValue = '';

  /**
   * @method increment
   * @description Incrementa el valor del contador en 1 usando el método update del signal
   * Demuestra cómo actualizar un signal basado en su valor previo
   */
  increment() {
    // El método update permite modificar el valor basado en el valor anterior
    this.count.update(value => value + 1);
  }

  /**
   * @method reset
   * @description Reinicia el contador a 0 usando el método set del signal
   * Demuestra cómo asignar un valor directamente a un signal
   */
  reset() {
    // El método set permite asignar un nuevo valor directamente
    this.count.set(0);
  }
}
