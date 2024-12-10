const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Configuración de AWS con las credenciales temporales
const client = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'ASIAY3ESGMEQJPQ5MCLR', // Tu clave de acceso
        secretAccessKey: '+f5YLuaNOQN1sgY4h9OLlc21WYCNQbdMUBqtpEPn', // Tu clave secreta
        sessionToken: 'IQoJb3JpZ2luX2VjEMb//////////wEaCXVzLXdlc3QtMiJIMEYCIQCpLwDgHZ8pf6+4eH2UKQlxUAU6L+jXTjMgIUU3W4Zc8wIhAKMTanzREUFvqF7SnqGfq4n4TuIgB8gVRP+7fn4rh6LhKrUCCH8QAhoMNjA4MDQ0NDc0NjU2Igx/9hCOo6MSEAyX5z4qkgJ54iBbV2FiX3RK0xkH7eNmCQuSeeLCWSjkpthkGLaevNLezJsW64tuQhD9oI6e89f8HOpF746NXeA6yvTHWqtMVgZcd0HofhAzmXs8CmdfLlR3nS2JGpUmV/c7YZpXAHFgscLg6oQcZulWJFf6r29CTjEJ80XjcWJNOv8HsveScZoxE3PstiXHT+Ofm6x6H/mxXNxrXNPmlQ9EOqvWNbWCIhU7crYiwcRtP7qnVBWQig21rX1p9gLUCVB9zw/p2tIm2QYeFWRubH0ZD2oKyMxz0uh/ZCbyJObxNK48Q10kiKHGhLHeJoCgE3UlvPZgOCtSf1aNi3xJItdDT6ZN29exmIMGQW7w+u3fGQquTlsmHPKuMJbW3boGOpwBh0ZUpI+3Pw8lM/mJkx0GtNDaZeQrieJTgZgBuAKhUgTNUjcxkzKUbzpEPZ0kUFLHUzix+RdkYttPWta4W5kGzlnBlG7KNkYWts87+Rj3lhsF8Nd9Pfqjqt5IZzuL9XlH7SuhXe1c6+MzhxpIfc6xHKEjzzlkpTJ0KCXRkjPIBXae+1k7o8iGp72snTKp0Dda6nHP0uVNSidroM1l', // Tu session token
    },
});

const dynamoDB = DynamoDBDocumentClient.from(client);

// Datos que quieres insertar en la tabla
const params = {
    TableName: 'UserLogin',
    Item: {
        id: '54321'
    },
};

// Insertar el item en DynamoDB
async function insertItem() {
    try {
        const data = await dynamoDB.send(new PutCommand(params));
        console.log('Elemento insertado con éxito:', data);
    } catch (err) {
        console.error('Error al insertar datos:', err);
    }
}

insertItem();
