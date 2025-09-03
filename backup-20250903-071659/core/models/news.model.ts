// src/app/core/models/news.model.ts

/**
 * Interfaz que define la estructura de un artículo de noticia.
 * Contiene todos los campos necesarios para mostrar una noticia en la página de inicio
 * y para gestionarla en el panel de administración.
 */
export interface News {
  id?: string;                 // ID único del documento en Firebase (opcional)
  title: string;              // Título de la noticia
  content: string;            // Contenido HTML de la noticia (del ngx-editor)
  imageUrl: string;           // URL de la imagen de portada
  createdAt: Date;            // Fecha de creación de la noticia
  published: boolean;         // Estado de publicación (true si es visible para todos)
}
