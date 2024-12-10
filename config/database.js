const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'database-2.cur8gf7ggtqy.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '12345678',
    database: 'databaseEntrega'
});

// Probar la conexión
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

module.exports = connection;  // Exporta la conexión para usarla en otras partes del proyecto
