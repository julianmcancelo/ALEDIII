export interface Actividad {
  id: number;
  tipo: 'estudiante' | 'sistema' | 'academico' | 'usuario';
  mensaje: string;
  fecha: Date;
  detalles?: string;
}
