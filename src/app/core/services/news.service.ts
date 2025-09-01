// src/app/core/services/news.service.ts
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';

/**
 * Servicio para gestionar las operaciones CRUD de noticias con Firebase Firestore.
 */
@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private firestore: Firestore = inject(Firestore);
  private newsCollection = collection(this.firestore, 'news');

  /**
   * Obtiene todas las noticias publicadas, ordenadas por fecha de creación descendente.
   * Ideal para mostrar en la página de inicio.
   * @returns Un observable con un array de noticias publicadas.
   */
  getPublishedNews(): Observable<News[]> {
    const q = query(this.newsCollection, where('published', '==', true), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<News[]>;
  }

  /**
   * Obtiene TODAS las noticias (publicadas y no publicadas), ordenadas por fecha.
   * Ideal para el panel de administración.
   * @returns Un observable con un array de todas las noticias.
   */
  getAllNews(): Observable<News[]> {
    const q = query(this.newsCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<News[]>;
  }

  /**
   * Crea un nuevo artículo de noticia en la base de datos.
   * @param news El objeto de noticia a crear.
   * @returns Una promesa que se resuelve con la referencia al documento creado.
   */
  createNews(news: News) {
    return addDoc(this.newsCollection, news);
  }

  /**
   * Actualiza un artículo de noticia existente.
   * @param id El ID del documento de la noticia a actualizar.
   * @param data Un objeto con los campos a actualizar.
   * @returns Una promesa que se resuelve cuando la actualización se completa.
   */
  updateNews(id: string, data: Partial<News>) {
    const newsDoc = doc(this.firestore, `news/${id}`);
    return updateDoc(newsDoc, data);
  }

  /**
   * Elimina un artículo de noticia de la base de datos.
   * @param id El ID del documento de la noticia a eliminar.
   * @returns Una promesa que se resuelve cuando la eliminación se completa.
   */
  deleteNews(id: string) {
    const newsDoc = doc(this.firestore, `news/${id}`);
    return deleteDoc(newsDoc);
  }
}
