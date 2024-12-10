const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const axios = require('axios');

const s3 = new S3Client({
  region: 'us-east-1', // Asegúrate de que la región esté configurada correctamente
  credentials: {
    accessKeyId: 'ASIAY3ESGMEQJPQ5MCLR', // Tu clave de acceso
    secretAccessKey: '+f5YLuaNOQN1sgY4h9OLlc21WYCNQbdMUBqtpEPn', // Tu clave secreta
    sessionToken: 'IQoJb3JpZ2luX2VjEMb//////////wEaCXVzLXdlc3QtMiJIMEYCIQCpLwDgHZ8pf6+4eH2UKQlxUAU6L+jXTjMgIUU3W4Zc8wIhAKMTanzREUFvqF7SnqGfq4n4TuIgB8gVRP+7fn4rh6LhKrUCCH8QAhoMNjA4MDQ0NDc0NjU2Igx/9hCOo6MSEAyX5z4qkgJ54iBbV2FiX3RK0xkH7eNmCQuSeeLCWSjkpthkGLaevNLezJsW64tuQhD9oI6e89f8HOpF746NXeA6yvTHWqtMVgZcd0HofhAzmXs8CmdfLlR3nS2JGpUmV/c7YZpXAHFgscLg6oQcZulWJFf6r29CTjEJ80XjcWJNOv8HsveScZoxE3PstiXHT+Ofm6x6H/mxXNxrXNPmlQ9EOqvWNbWCIhU7crYiwcRtP7qnVBWQig21rX1p9gLUCVB9zw/p2tIm2QYeFWRubH0ZD2oKyMxz0uh/ZCbyJObxNK48Q10kiKHGhLHeJoCgE3UlvPZgOCtSf1aNi3xJItdDT6ZN29exmIMGQW7w+u3fGQquTlsmHPKuMJbW3boGOpwBh0ZUpI+3Pw8lM/mJkx0GtNDaZeQrieJTgZgBuAKhUgTNUjcxkzKUbzpEPZ0kUFLHUzix+RdkYttPWta4W5kGzlnBlG7KNkYWts87+Rj3lhsF8Nd9Pfqjqt5IZzuL9XlH7SuhXe1c6+MzhxpIfc6xHKEjzzlkpTJ0KCXRkjPIBXae+1k7o8iGp72snTKp0Dda6nHP0uVNSidroM1l', // Tu session token
  }
});

const uploadParams = {
  Bucket: 'user-profile-uadyaws',
  Key: 'imagenes/imagen_perrito3.jpg',  // Ruta y nombre del archivo en S3
  Body: null, // Este campo lo llenamos con el contenido de la imagen descargada
  ContentType: 'image/jpeg',
};

const imageUrl = 'https://www.aiseesoft.es/images/tutorial/jpg-to-url/jpg-to-url.jpg'; // Reemplaza con la URL de la imagen real

const run = async () => {
  try {
    // Descargar la imagen desde la URL
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    // Establecer el cuerpo de la solicitud con los datos de la imagen descargada
    uploadParams.Body = response.data;

    // Subir la imagen a S3
    const data = await s3.send(new PutObjectCommand(uploadParams));
    console.log('Imagen subida con éxito', data);

    // Generar URL pública
    const publicUrl = `https://${uploadParams.Bucket}.s3.${s3.config.region}.amazonaws.com/${uploadParams.Key}`;
    console.log('URL pública de la imagen:', publicUrl);
  } catch (err) {
    console.error('Error al subir la imagen:', err);
  }
};

run();
