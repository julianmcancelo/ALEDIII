# Guía para Actualizar Importaciones

Después de ejecutar el script de migración `migracion-carpetas.ps1`, deberás actualizar manualmente las rutas en las importaciones de todos los archivos. Aquí hay una lista de reemplazos a realizar:

## Cambios de Carpetas Principales

| Buscar                 | Reemplazar con            |
|------------------------|---------------------------|
| `from '../core/`       | `from '../nucleo/`        |
| `from '../../core/`    | `from '../../nucleo/`     |
| `from '../../../core/` | `from '../../../nucleo/`  |
| `from './core/`        | `from './nucleo/`         |
| `from '../features/`   | `from '../funcionalidades/` |
| `from '../../features/`| `from '../../funcionalidades/` |
| `from './features/`    | `from './funcionalidades/`  |
| `from '../shared/`     | `from '../compartido/`    |
| `from '../../shared/`  | `from '../../compartido/` |
| `from './shared/`      | `from './compartido/`     |
| `from '../layout/`     | `from '../diseno/`        |
| `from '../../layout/`  | `from '../../diseno/`     |
| `from './layout/`      | `from './diseno/`         |
| `from '../assets/`     | `from '../recursos/`      |
| `from '../environments/` | `from '../entornos/`    |
| `from '../../environments/` | `from '../../entornos/` |

## Cambios de Subcarpetas

| Buscar                 | Reemplazar con            |
|------------------------|---------------------------|
| `/guards/`             | `/guardias/`              |
| `/models/`             | `/modelos/`               |
| `/services/`           | `/servicios/`             |
| `/admin/`              | `/administracion/`        |
| `/auth/`               | `/autenticacion/`         |
| `/login/`              | `/inicio-sesion/`         |
| `/students/`           | `/estudiantes/`           |
| `/student-form/`       | `/formulario-estudiante/` |
| `/student-list/`       | `/lista-estudiantes/`     |
| `/directives/`         | `/directivas/`            |
| `/dashboard/`          | `/panel/`                 |
| `/dashboard-home/`     | `/panel-inicio/`          |
| `/home/`               | `/inicio/`                |
| `/gallery/`            | `/galeria/`               |

## Tips para actualizar

1. Usa la búsqueda y reemplazo de tu IDE con la opción "Buscar en archivos" o "Buscar en proyecto"
2. Realiza los reemplazos en orden, comenzando por las rutas más específicas
3. Después de cada conjunto de reemplazos, intenta compilar el proyecto con `ng build` para verificar si hay errores
4. Si encuentras errores, revisa las rutas específicas que están fallando
