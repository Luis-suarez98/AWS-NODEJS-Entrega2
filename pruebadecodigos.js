const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Importar las rutas
const alumnoRoutes = require('./routes/alumnoRoutes');
const profesorRoutes = require('./routes/profesorRoutes');
const sessionRoutes = require('./routes/sessionRoutes'); // Ruta de sesión
const fotoPerfilRoutes = require('./routes/fotoPerfilRoutes'); // Ruta de foto de perfil


// Middleware para parsear los datos JSON en las solicitudes
app.use(bodyParser.json());

// Usar las rutas en la aplicación
app.use('/alumnos', sessionRoutes); // Integrar las rutas de sesión
app.use('/alumnos', alumnoRoutes);
app.use('/profesores', profesorRoutes);
app.use('/alumnos', fotoPerfilRoutes); // Integrar la ruta para foto de perfil

// Configurar el puerto
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor en ejecución en el puerto ${port}`);
});
