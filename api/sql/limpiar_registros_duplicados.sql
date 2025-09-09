-- Script para eliminar registros duplicados o innecesarios
-- TP Final Algoritmos y Estructuras de Datos III - 2025
-- Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)

-- 1. Mostrar todos los usuarios para identificar duplicados o innecesarios
SELECT id, email, name, role, created_at FROM usuarios ORDER BY created_at DESC;

-- 2. Eliminar usuarios duplicados (manteniendo el más reciente de cada email)
-- PRIMERO EJECUTAR ESTA CONSULTA PARA VERIFICAR QUÉ SE VA A ELIMINAR:
SELECT u1.id, u1.email, u1.name, u1.role, u1.created_at
FROM usuarios u1
JOIN (
    SELECT email, MIN(created_at) as min_created
    FROM usuarios
    GROUP BY email
    HAVING COUNT(*) > 1
) u2 ON u1.email = u2.email AND u1.created_at > u2.min_created;

-- LUEGO EJECUTAR ESTA SENTENCIA PARA ELIMINAR (DESCOMENTAR CUANDO ESTÉS SEGURO):
-- DELETE u1 FROM usuarios u1
-- JOIN (
--    SELECT email, MIN(created_at) as min_created
--    FROM usuarios
--    GROUP BY email
--    HAVING COUNT(*) > 1
-- ) u2 ON u1.email = u2.email AND u1.created_at > u2.min_created;

-- 3. Eliminar usuarios de prueba por patrón de email (ajustar según necesidad)
-- PRIMERO VERIFICAR QUÉ SE VA A ELIMINAR:
SELECT id, email, name, role FROM usuarios 
WHERE email LIKE '%prueba%' 
   OR email LIKE '%test%'
   OR email LIKE '%ejemplo%';

-- LUEGO EJECUTAR PARA ELIMINAR (DESCOMENTAR CUANDO ESTÉS SEGURO):
-- DELETE FROM usuarios
-- WHERE email LIKE '%prueba%' 
--    OR email LIKE '%test%'
--    OR email LIKE '%ejemplo%';

-- 4. Eliminar usuarios específicos por ID (ajustar según necesidad)
-- Reemplazar 'id1', 'id2', etc., con los IDs reales a eliminar

-- PRIMERO VERIFICAR QUÉ SE VA A ELIMINAR:
-- SELECT id, email, name, role FROM usuarios 
-- WHERE id IN ('id1', 'id2', 'id3');

-- LUEGO EJECUTAR PARA ELIMINAR (DESCOMENTAR Y AJUSTAR CUANDO ESTÉS SEGURO):
-- DELETE FROM usuarios
-- WHERE id IN ('id1', 'id2', 'id3');

-- IMPORTANTE: Hacer backup de la base de datos antes de ejecutar estos comandos DELETE
