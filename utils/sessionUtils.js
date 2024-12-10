const crypto = require('crypto');

// Función para generar un sessionString aleatorio de 128 caracteres
function generateSessionString() {
    return crypto.randomBytes(64).toString('hex'); // 128 caracteres hexadecimales
}

module.exports = {
    generateSessionString
};
