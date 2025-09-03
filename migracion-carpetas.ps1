# Script de migración para renombrar carpetas de inglés a español
# Migración controlada para proyecto Angular

# Función para crear respaldo de la estructura antes de migrar
function Create-Backup {
    Write-Host "Creando respaldo de la estructura actual..." -ForegroundColor Cyan
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupDir = ".\backup-$timestamp"
    
    # Crear directorio de respaldo
    New-Item -ItemType Directory -Path $backupDir -Force
    
    # Copiar estructura de src/app a backup
    Copy-Item -Path ".\src\app\*" -Destination "$backupDir" -Recurse
    
    Write-Host "Respaldo creado en: $backupDir" -ForegroundColor Green
}

# Función para renombrar un directorio
function Rename-Directory {
    param (
        [string]$oldPath,
        [string]$newPath
    )
    
    if (Test-Path $oldPath) {
        # Verificar que el directorio de destino no existe
        if (-not (Test-Path $newPath)) {
            # Crear directorio padre si no existe
            $parentDir = Split-Path -Path $newPath -Parent
            if (-not (Test-Path $parentDir)) {
                New-Item -ItemType Directory -Path $parentDir -Force
            }
            
            Write-Host "Renombrando: $oldPath -> $newPath" -ForegroundColor Yellow
            
            # Mover el contenido en lugar de renombrar (más seguro)
            New-Item -ItemType Directory -Path $newPath -Force
            Copy-Item -Path "$oldPath\*" -Destination $newPath -Recurse
            Remove-Item -Path $oldPath -Recurse -Force
            
            return $true
        } else {
            Write-Host "ERROR: El directorio destino ya existe: $newPath" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "ERROR: El directorio origen no existe: $oldPath" -ForegroundColor Red
        return $false
    }
}

# Crear respaldo primero
Create-Backup

# Definir mapeos de directorios (orden importante para evitar conflictos)
$directoryMappings = @(
    # Nivel 1
    @{ Old = ".\src\app\core"; New = ".\src\app\nucleo" },
    @{ Old = ".\src\app\features"; New = ".\src\app\funcionalidades" },
    @{ Old = ".\src\app\shared"; New = ".\src\app\compartido" },
    @{ Old = ".\src\app\layout"; New = ".\src\app\diseno" },
    @{ Old = ".\src\app\assets"; New = ".\src\app\recursos" },
    @{ Old = ".\src\app\environments"; New = ".\src\app\entornos" },
    
    # Nivel 2 - nucleo
    @{ Old = ".\src\app\nucleo\guards"; New = ".\src\app\nucleo\guardias" },
    @{ Old = ".\src\app\nucleo\models"; New = ".\src\app\nucleo\modelos" },
    @{ Old = ".\src\app\nucleo\services"; New = ".\src\app\nucleo\servicios" },
    
    # Nivel 2 - funcionalidades
    @{ Old = ".\src\app\funcionalidades\admin"; New = ".\src\app\funcionalidades\administracion" },
    @{ Old = ".\src\app\funcionalidades\auth"; New = ".\src\app\funcionalidades\autenticacion" },
    @{ Old = ".\src\app\funcionalidades\students"; New = ".\src\app\funcionalidades\estudiantes" },
    @{ Old = ".\src\app\funcionalidades\home"; New = ".\src\app\funcionalidades\inicio" },
    @{ Old = ".\src\app\funcionalidades\gallery"; New = ".\src\app\funcionalidades\galeria" },
    
    # Nivel 3 - dentro de autenticación
    @{ Old = ".\src\app\funcionalidades\autenticacion\login"; New = ".\src\app\funcionalidades\autenticacion\inicio-sesion" },
    
    # Nivel 3 - dentro de estudiantes
    @{ Old = ".\src\app\funcionalidades\estudiantes\student-form"; New = ".\src\app\funcionalidades\estudiantes\formulario-estudiante" },
    @{ Old = ".\src\app\funcionalidades\estudiantes\student-list"; New = ".\src\app\funcionalidades\estudiantes\lista-estudiantes" },
    
    # Nivel 2 - compartido
    @{ Old = ".\src\app\compartido\directives"; New = ".\src\app\compartido\directivas" },
    # Nota: 'pipes' se mantiene en inglés según instrucción del usuario
    
    # Nivel 2 - diseño
    @{ Old = ".\src\app\diseno\dashboard"; New = ".\src\app\diseno\panel" },
    
    # Nivel 3 - dentro de panel
    @{ Old = ".\src\app\diseno\panel\dashboard-home"; New = ".\src\app\diseno\panel\panel-inicio" }
)

# Proceso de migración
$successCount = 0
$errorCount = 0

Write-Host "Iniciando migración de estructura de directorios..." -ForegroundColor Cyan

foreach ($mapping in $directoryMappings) {
    $result = Rename-Directory -oldPath $mapping.Old -newPath $mapping.New
    if ($result) {
        $successCount++
    } else {
        $errorCount++
    }
}

Write-Host "Migración completada con: $successCount directorios renombrados, $errorCount errores" -ForegroundColor Cyan

Write-Host "IMPORTANTE: Ahora debes actualizar todas las rutas de importación en los archivos .ts" -ForegroundColor Yellow
Write-Host "Utiliza la herramienta de búsqueda y reemplazo de tu IDE para actualizar las rutas en los imports" -ForegroundColor Yellow

# Notas para el usuario
Write-Host "`nPasos recomendados para completar la migración:" -ForegroundColor Green
Write-Host "1. Actualiza las rutas en las declaraciones import de todos los archivos .ts" -ForegroundColor Green
Write-Host "2. Actualiza las rutas en el archivo angular.json si hay referencias" -ForegroundColor Green
Write-Host "3. Ejecuta 'ng build' para verificar que todo funcione correctamente" -ForegroundColor Green
