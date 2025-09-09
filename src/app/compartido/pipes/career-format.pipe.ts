/**
 * @file career-format.pipe.ts
 * @description Pipe personalizado para formatear nombres de carreras
 * Añade iconos emoji a los nombres de las carreras para mejor visualización
 * 
 * TP Final Algoritmos y Estructuras de Datos III - 2025
 * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
 */
import { Pipe, PipeTransform } from '@angular/core';

/**
 * @class CareerFormatPipe
 * @description Pipe para dar formato visual a los nombres de carreras
 * Añade iconos representativos a cada carrera para mejorar la experiencia de usuario
 */
@Pipe({
  name: 'careerFormat',  // Nombre del pipe para usar en templates: {{ value | careerFormat }}
  standalone: true       // Componente independiente (arquitectura moderna de Angular)
})
/**
 * Clase que implementa la transformación de nombres de carreras
 * agregando iconos emoji representativos
 */
export class CareerFormatPipe implements PipeTransform {
  /**
   * @method transform
   * @description Método principal del pipe que realiza la transformación
   * @param career Nombre de la carrera a formatear
   * @returns Nombre de la carrera con icono representativo
   */
  transform(career: string): string {
    // Mapeo de carreras a sus representaciones con iconos
    const careerMap: { [key: string]: string } = {
      'Sistemas': '💻 Sistemas',                 // Emoji de computadora
      'Enfermería': '🏥 Enfermería',          // Emoji de hospital
      'Radiología': '🔬 Radiología',          // Emoji de microscopio
      'Higiene y Seguridad': '🛡️ Higiene y Seguridad', // Emoji de escudo
      'Comunicación Multimedial': '🎨 Comunicación Multimedial', // Emoji de paleta
      'Diseño Industrial': '🏭 Diseño Industrial', // Emoji de fábrica
      'Administración de Pymes': '📊 Administración de Pymes', // Emoji de gráfico
      'Contable': '📈 Contable',                // Emoji de gráfico ascendente
      'Ciencia de Datos e IA': '🤖 Ciencia de Datos e IA' // Emoji de robot
    };
    
    // Retorna la versión formateada o el original si no está en el mapeo
    return careerMap[career] || career;
  }
}
