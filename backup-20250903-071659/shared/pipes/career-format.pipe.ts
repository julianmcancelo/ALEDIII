import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'careerFormat',
  standalone: true
})
export class CareerFormatPipe implements PipeTransform {
  transform(career: string): string {
    const careerMap: { [key: string]: string } = {
      'Sistemas': '💻 Sistemas',
      'Enfermería': '🏥 Enfermería',
      'Radiología': '🔬 Radiología',
      'Higiene y Seguridad': '🛡️ Higiene y Seguridad',
      'Comunicación Multimedial': '🎨 Comunicación Multimedial',
      'Diseño Industrial': '🏭 Diseño Industrial',
      'Administración de Pymes': '📊 Administración de Pymes',
      'Contable': '📈 Contable',
      'Ciencia de Datos e IA': '🤖 Ciencia de Datos e IA'
    };
    
    return careerMap[career] || career;
  }
}
