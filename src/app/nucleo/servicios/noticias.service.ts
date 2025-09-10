import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Noticia {
  id?: number;
  titulo: string;
  resumen: string;
  contenido: string;
  imagen_url?: string;
  fecha_publicacion: string;
  autor: string;
  estado: 'borrador' | 'publicada' | 'archivada';
  categoria: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface PaginacionNoticias {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
}

export interface RespuestaNoticias {
  success: boolean;
  data: Noticia[];
  pagination?: PaginacionNoticias;
  message?: string;
}

export interface RespuestaNoticia {
  success: boolean;
  data?: Noticia;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://aled.jcancelo.dev/api';
  
  // Subject para notificar cambios en las noticias
  private noticiasSubject = new BehaviorSubject<Noticia[]>([]);
  public noticias$ = this.noticiasSubject.asObservable();

  /**
   * Obtener noticias públicas con paginación
   */
  obtenerNoticiasPublicas(page: number = 1, limit: number = 10): Observable<RespuestaNoticias> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<RespuestaNoticias>(`${this.API_URL}/noticias`, { params });
  }

  /**
   * Obtener todas las noticias para administración
   */
  obtenerNoticiasAdmin(): Observable<RespuestaNoticias> {
    const params = new HttpParams().set('admin', 'true');
    
    return this.http.get<RespuestaNoticias>(`${this.API_URL}/noticias`, { params })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.noticiasSubject.next(response.data);
          }
        })
      );
  }

  /**
   * Obtener una noticia específica por ID
   */
  obtenerNoticia(id: number): Observable<RespuestaNoticia> {
    return this.http.get<RespuestaNoticia>(`${this.API_URL}/noticias/${id}`);
  }

  /**
   * Crear nueva noticia
   */
  crearNoticia(noticia: Omit<Noticia, 'id'>): Observable<RespuestaNoticia> {
    return this.http.post<RespuestaNoticia>(`${this.API_URL}/noticias`, noticia)
      .pipe(
        tap(response => {
          if (response.success) {
            this.actualizarListaNoticias();
          }
        })
      );
  }

  /**
   * Actualizar noticia existente
   */
  actualizarNoticia(id: number, noticia: Partial<Noticia>): Observable<RespuestaNoticia> {
    return this.http.put<RespuestaNoticia>(`${this.API_URL}/noticias/${id}`, noticia)
      .pipe(
        tap(response => {
          if (response.success) {
            this.actualizarListaNoticias();
          }
        })
      );
  }

  /**
   * Eliminar noticia
   */
  eliminarNoticia(id: number): Observable<RespuestaNoticia> {
    return this.http.delete<RespuestaNoticia>(`${this.API_URL}/noticias/${id}`)
      .pipe(
        tap(response => {
          if (response.success) {
            this.actualizarListaNoticias();
          }
        })
      );
  }

  /**
   * Cambiar estado de una noticia (publicar/despublicar)
   */
  cambiarEstadoNoticia(id: number, estado: 'borrador' | 'publicada' | 'archivada'): Observable<RespuestaNoticia> {
    const params = new HttpParams().set('action', 'cambiar-estado');
    
    return this.http.post<RespuestaNoticia>(`${this.API_URL}/noticias/${id}`, { estado }, { params })
      .pipe(
        tap(response => {
          if (response.success) {
            this.actualizarListaNoticias();
          }
        })
      );
  }

  /**
   * Obtener noticias recientes para el home (últimas 3)
   */
  obtenerNoticiasRecientes(): Observable<Noticia[]> {
    return this.obtenerNoticiasPublicas(1, 3).pipe(
      map(response => response.success ? response.data : [])
    );
  }

  /**
   * Obtener categorías disponibles
   */
  obtenerCategorias(): string[] {
    return [
      'general',
      'institucional',
      'academico',
      'eventos',
      'deportes',
      'cultura',
      'tecnologia',
      'investigacion'
    ];
  }

  /**
   * Formatear fecha para mostrar
   */
  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formatear fecha corta para chips
   */
  formatearFechaCorta(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  /**
   * Obtener color del chip según la categoría
   */
  obtenerColorCategoria(categoria: string): 'primary' | 'accent' | 'warn' {
    const colores: { [key: string]: 'primary' | 'accent' | 'warn' } = {
      'institucional': 'primary',
      'academico': 'accent',
      'eventos': 'warn',
      'deportes': 'primary',
      'cultura': 'accent',
      'tecnologia': 'primary',
      'investigacion': 'accent',
      'general': 'primary'
    };
    
    return colores[categoria] || 'primary';
  }

  /**
   * Validar datos de noticia
   */
  validarNoticia(noticia: Partial<Noticia>): string[] {
    const errores: string[] = [];

    if (!noticia.titulo || noticia.titulo.trim().length === 0) {
      errores.push('El título es obligatorio');
    }

    if (!noticia.resumen || noticia.resumen.trim().length === 0) {
      errores.push('El resumen es obligatorio');
    }

    if (!noticia.contenido || noticia.contenido.trim().length === 0) {
      errores.push('El contenido es obligatorio');
    }

    if (noticia.titulo && noticia.titulo.length > 255) {
      errores.push('El título no puede exceder 255 caracteres');
    }

    if (noticia.resumen && noticia.resumen.length > 500) {
      errores.push('El resumen no puede exceder 500 caracteres');
    }

    return errores;
  }

  /**
   * Actualizar la lista de noticias en el subject
   */
  private actualizarListaNoticias(): void {
    this.obtenerNoticiasAdmin().subscribe();
  }

  /**
   * Limpiar cache de noticias
   */
  limpiarCache(): void {
    this.noticiasSubject.next([]);
  }
}
