# Resumen de la Arquitectura del Proyecto - Sistema de Gestión Académica

## Introducción

Este documento describe la arquitectura y estructura del sistema de gestión académica desarrollado para el Instituto Tecnológico Beltrán como parte del trabajo práctico final de la materia Algoritmos y Estructuras de Datos III (2025).

**Autores:**
- CANCELO JULIAN 
- NICOLAS OTERO
- Curso: 3ra 1RA
- Profesor: Sebastian Saldivar

## Tecnologías Utilizadas

- **Frontend**: Angular 17
  - Componentes Standalone (Nueva arquitectura)
  - Signals para estado reactivo
  - Nueva sintaxis de flujo de control (@if, @for)
  - TailwindCSS para estilos
  - SweetAlert2 para notificaciones

- **Backend**: PHP con API RESTful
  - Controladores estructurados
  - Autenticación básica

## Estructura del Proyecto

### Organización de Carpetas

```
src/
├── app/
│   ├── compartido/          # Componentes y servicios compartidos
│   ├── diseno/              # Componentes de diseño (layouts, dashboard)
│   ├── entornos/            # Configuración de entornos
│   ├── features/            # Características/módulos principales
│   │   └── auth/            # Módulo de autenticación
│   │       └── login/       # Componente de inicio de sesión
│   ├── funcionalidades/     # Módulos funcionales
│   │   ├── administracion/  # Gestión administrativa
│   │   │   └── registro-usuario/  # Registro de usuarios
│   │   ├── autenticacion/   # Módulo de autenticación
│   │   ├── estudiantes/     # Módulo de gestión de estudiantes
│   │   ├── galeria/         # Componente de galería de instalaciones
│   │   └── inicio/          # Página de inicio
│   ├── nucleo/              # Núcleo de la aplicación
│   │   ├── guardias/        # Guardias de seguridad
│   │   └── servicios/       # Servicios principales
│   └── example.component.ts # Componente de ejemplo con nuevas características
├── assets/                  # Recursos estáticos
└── environments/            # Configuraciones de entorno
```

### Estructura de Autenticación

1. **Login Component** (`features/auth/login/login.component.ts`)
   - Formulario reactivo para inicio de sesión
   - Validación de campos
   - Integración con AuthService

2. **Auth Service** (`nucleo/servicios/auth.service.ts`)
   - Manejo de estado de autenticación
   - Comunicación con API de usuarios
   - Persistencia de sesión con localStorage

3. **Auth Guard** (`nucleo/guardias/auth.guard.ts`)
   - Protección de rutas para usuarios no autenticados
   - Redirección al login cuando sea necesario

4. **Role Guard** (`nucleo/guardias/role.guard.ts`)
   - Control de acceso basado en roles (admin, profesor, estudiante)

### Enrutamiento Principal

Las rutas principales están configuradas en `app.routes.ts`, siguiendo un esquema de carga perezosa (lazy loading) para optimizar el rendimiento:

- **/** - Página principal (pública)
- **/instalaciones** - Galería de instalaciones (pública)
- **/auth** - Módulo de autenticación
- **/dashboard** - Panel principal (requiere autenticación)
- **/estudiantes** - Gestión de estudiantes (requiere roles específicos)
- **/gestion-usuarios** - Administración de usuarios (solo admin)
- **/registro-usuario** - Registro de nuevos usuarios (solo admin)

### Servicios Principales

- **AuthService**: Gestión de autenticación
- **UserService**: Gestión de usuarios
- **StudentService**: Gestión de estudiantes
- **NewsService**: Gestión de noticias
- **NewsletterService**: Gestión del boletín informativo

### Características Modernas Implementadas

1. **Componentes Standalone**:
   - No requieren un NgModule contenedor
   - Importaciones directas de dependencias
   - Ejemplo: `login.component.ts`

2. **Signals para estado reactivo**:
   - Alternativa moderna a BehaviorSubject
   - Mejor rendimiento y sintaxis más limpia
   - Ejemplo: `example.component.ts`

3. **Nueva sintaxis de control de flujo**:
   - Uso de `@if` y `@else` en lugar de `*ngIf`
   - Uso de `@for` con tracking en lugar de `*ngFor`
   - Ejemplo: botón de inicio de sesión en `login.component.ts`

4. **Inyección de dependencias moderna**:
   - Uso de `inject()` en lugar del constructor tradicional

## Integración con Backend

La aplicación se comunica con un backend PHP que expone endpoints REST:

- `/api/users` - Gestión de usuarios y autenticación
- `/api/students` - Gestión de estudiantes
- `/api/news` - Gestión de noticias

## Consideraciones para la Presentación

Al explicar el proyecto, se recomienda enfocarse en:

1. La arquitectura modular y la separación de responsabilidades
2. Las características modernas de Angular 17 implementadas
3. El flujo de autenticación y autorización basado en roles
4. La interfaz de usuario implementada con TailwindCSS

Los comentarios añadidos a lo largo del código facilitan la explicación de cada componente y su función dentro del sistema.

---

*Documento preparado para la presentación del TP Final de Algoritmos y Estructuras de Datos III - 2025*
