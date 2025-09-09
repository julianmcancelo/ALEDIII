<?php
/**
 * PasswordHashService.php
 * Servicio para el manejo seguro de contraseñas utilizando hashing moderno
 * 
 * TP Final Algoritmos y Estructuras de Datos III - 2025
 * Alumnos: CANCELO JULIAN - NICOLAS OTERO (Curso 3ra 1RA)
 * Profesor: Sebastian Saldivar
 */

class PasswordHashService {
    /**
     * Genera un hash seguro de una contraseña utilizando el algoritmo recomendado actual
     * 
     * @param string $password Contraseña en texto plano
     * @return string Hash de la contraseña
     */
    public static function hashPassword(string $password): string {
        // Utilizamos el algoritmo de hash PASSWORD_BCRYPT con un costo de 12
        // Este es un buen equilibrio entre seguridad y rendimiento
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }
    
    /**
     * Verifica si una contraseña en texto plano coincide con un hash almacenado
     * 
     * @param string $password Contraseña en texto plano a verificar
     * @param string $hash Hash almacenado con el que comparar
     * @return bool True si coinciden, false en caso contrario
     */
    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }
    
    /**
     * Verifica si un hash necesita ser actualizado
     * Útil cuando se cambian los algoritmos o parámetros de hash con el tiempo
     * 
     * @param string $hash Hash a verificar
     * @return bool True si el hash debe actualizarse, false en caso contrario
     */
    public static function needsRehash(string $hash): bool {
        return password_needs_rehash($hash, PASSWORD_BCRYPT, ['cost' => 12]);
    }
    
    /**
     * Genera una sal criptográficamente segura
     * Útil para añadir entropía adicional cuando sea necesario
     * 
     * @param int $length Longitud de la sal en bytes
     * @return string Sal en formato hexadecimal
     */
    public static function generateSalt(int $length = 16): string {
        return bin2hex(random_bytes($length));
    }
}
?>
