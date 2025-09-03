export interface Estudiante {
  id: string;
  legajo: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  dni: string;
  fechaNacimiento: Date;
  carrera: string;
  fechaInscripcion: Date;
  estado: 'activo' | 'inactivo' | 'graduado';
  direccion: {
    calle: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
  };
  contactoEmergencia?: {
    nombre: string;
    telefono: string;
    parentesco: string;
  };
}

export interface CrearEstudianteRequest {
  legajo: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  dni: string;
  fechaNacimiento: Date;
  carrera: string;
  fechaInscripcion: Date;
  estado: 'activo' | 'inactivo' | 'graduado';
  direccion: {
    calle: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
  };
  contactoEmergencia?: {
    nombre: string;
    telefono: string;
    parentesco: string;
  };
}
