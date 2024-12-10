const express = require('express');
const router = express.Router();
const AWS = require('../config/awsConfigS3');
const multer = require('multer');
const fs = require('fs');
const connection = require('../config/database');  // Conexión a la base de datos
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const upload = multer({ dest: 'uploads/' });

// Ruta para cargar la foto de perfil
router.post('/:alumnoId/fotoPerfil', upload.single('foto'), (req, res) => {
  const alumnoId = req.params.alumnoId;
  const file = req.file;

  // Asegurarse de que el archivo esté presente
  console.log('Archivo recibido:', file);

  if (!file) {
    console.error('No se ha recibido un archivo.');
    return res.status(400).json({ message: 'No se ha recibido un archivo.' });
  }

  // Parámetros para la carga a S3
  const params = {
    Bucket: 'user-profile-uadyaws', // Nombre del bucket S3
    Key: `imagenes/${alumnoId}/${file.originalname}`, // Ruta y nombre del archivo
    Body: fs.createReadStream(file.path), // Leer el archivo subido
    ContentType: file.mimetype // Tipo de contenido
  };

  // Verificar que la conexión a la base de datos esté activa
  console.log('Conectando a la base de datos...');
  connection.query('SELECT 1', (err, result) => {
    if (err) {
      console.error('Error de conexión a la base de datos:', err);
      return res.status(500).json({ message: 'Error al conectar con la base de datos.' });
    }
    console.log('Conexión exitosa');
  });

  // Subir el archivo a S3
  AWS.send(new PutObjectCommand(params))
    .then(() => {
      // Crear la URL pública del archivo en S3
      const fileUrl = `https://user-profile-uadyaws.s3.amazonaws.com/${params.Key}`;

      console.log('Subida exitosa. URL de la foto de perfil:', fileUrl);

      // Verificar si el alumno existe en la base de datos antes de proceder con la actualización
      connection.query('SELECT * FROM alumnos WHERE id = ?', [alumnoId], (err, result) => {
        if (err) {
          console.error('Error al verificar el alumno en la base de datos:', err);
          return res.status(500).json({ message: 'Error al verificar el alumno.' });
        }
        if (result.length === 0) {
          console.error('Alumno no encontrado.');
          return res.status(404).json({ message: 'Alumno no encontrado.' });
        }
        console.log('Alumno encontrado, procediendo con la actualización...');

        // Actualizar la URL de la foto en la base de datos (campo fotoPerfilUrl)
        const sqlUpdate = 'UPDATE alumnos SET fotoPerfilUrl = ? WHERE id = ?';
        console.log('Actualizando base de datos con:', fileUrl, alumnoId);
        connection.query(sqlUpdate, [fileUrl, alumnoId], (err, result) => {
          if (err) {
            console.error('Error al actualizar la base de datos:', err);
            return res.status(500).json({ message: 'Error al actualizar la foto en la base de datos.' });
          }
          console.log('URL de foto actualizada en la base de datos');

          // Retornar la URL pública del archivo subido
          res.status(200).json({
            fotoPerfilUrl: fileUrl // URL pública de S3
          });
        });
      });
    })
    .catch((error) => {
      console.error('Error al subir la foto de perfil:', error);
      res.status(500).json({ message: 'Error al subir la foto de perfil.' });
    });
});

module.exports = router;
