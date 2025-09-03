import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styles: [`
    .gallery-container {
      background-color: #f9fafb;
    }
    
    /* Efecto de zoom suave al hover en las miniaturas */
    .gallery-container img:hover {
      transform: scale(1.05);
      transition: transform 0.3s ease-out;
    }
    
    /* Animación para transiciones de imágenes */
    .main-image-container img {
      transition: all 0.5s ease-in-out;
      animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0.7; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }
    
    /* Estilizando los botones de navegación */
    button:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
    }
    
    /* Efecto hover para los botones de navegación */
    button:hover svg {
      transform: scale(1.2);
      transition: transform 0.2s;
    }
    
    /* Efecto para los botones de navegación */
    button.rounded-full {
      transition: all 0.3s;
    }
    
    button.rounded-full:hover {
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    }
    
    /* Estilos para la descripción con efecto de fade in */
    .absolute.bottom-0 {
      transform: translateY(0);
      transition: all 0.4s ease;
      animation: slideUp 0.4s ease-out;
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    /* Estilos para las miniaturas seleccionadas */
    .ring-2 {
      transition: all 0.3s ease;
      transform: translateY(-5px);
    }
    
    /* Responsive design ajustes */
    @media (max-width: 640px) {
      .main-image-container {
        height: 300px;
      }
    }
  `]
})
export class GalleryComponent {
  // Array de imágenes para la galería con URLs públicas
  images = signal<GalleryImage[]>([
    {
      src: 'https://images.unsplash.com/photo-1588072432836-e10032774350',
      alt: 'Aula de Informática',
      title: 'Aula de Informática',
      description: 'Nuestras aulas de informática cuentan con equipamiento de última generación para el desarrollo de habilidades técnicas y profesionales.'
    },
    {
      src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      alt: 'Taller de Metalurgia',
      title: 'Taller de Metalurgia',
      description: 'El taller de metalurgia está equipado con maquinaria industrial para la formación práctica en el sector metalmecánico.'
    },
    {
      src: 'https://images.unsplash.com/photo-1581092335397-9fa341163a6a',
      alt: 'Laboratorio de Electrónica',
      title: 'Laboratorio de Electrónica',
      description: 'Laboratorio especializado para el desarrollo de proyectos de electrónica y automación.'
    },
    {
      src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da',
      alt: 'Biblioteca',
      title: 'Biblioteca',
      description: 'Nuestra biblioteca cuenta con material bibliográfico especializado para todas las carreras técnicas.'
    },
    {
      src: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272',
      alt: 'Auditorio',
      title: 'Auditorio',
      description: 'Espacio para conferencias, charlas y eventos institucionales con capacidad para 200 personas.'
    }
  ]);

  // Índice de la imagen actual
  currentIndex = signal<number>(0);

  // Método para mostrar la siguiente imagen
  next(): void {
    if (this.currentIndex() < this.images().length - 1) {
      this.currentIndex.update(index => index + 1);
    } else {
      this.currentIndex.set(0); // Volver al principio si es la última imagen
    }
  }

  // Método para mostrar la imagen anterior
  prev(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(index => index - 1);
    } else {
      this.currentIndex.set(this.images().length - 1); // Ir a la última si es la primera imagen
    }
  }

  // Método para mostrar una imagen específica
  showImage(index: number): void {
    if (index >= 0 && index < this.images().length) {
      this.currentIndex.set(index);
    }
  }
}
