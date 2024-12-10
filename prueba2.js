const express = require('express');
const crypto = require('crypto');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Configuración de AWS DynamoDB
const client = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'ASIAY3ESGMEQKUWPXA6B',
        secretAccessKey: 'cBMG/FK0ixXKYWWL+wEZJXTcLkjkEHReYpDRaXIT',
        sessionToken: 'IQoJb3JpZ2luX2VjEML//////////wEaCXVzLXdlc3QtMiJGMEQCIDF+gSMj+Xph1819DI6c09DXA+UmaxGoWf+ovYywWMFnAiAL+aoee3RVih4jaintXMqYNn/6oKJ3EoF8QoI7Fdr8Hiq1Agh7EAIaDDYwODA0NDQ3NDY1NiIMKOnvnCqE2TZhNADRKpIC6I9ItT0ZfcBgUuojtoQY6iMAoiL3ajFmKEuQJwdMwfVLiU1icgCQGDnrDD66cME52o9iYEWldGlDiyrutgYlwsOWhDhZAGHjE9lYK6ShOdDBK6lzx/kn4KUMkIFGIe4P43imvDR1zWCPknXFayZH4oPCuNq3skkRLDDPX1IsybBJIbhe2ijFdbzC6bzD5Az+08jIpD3GRb16yb8bFM2wEldFbsMMLiSBgvwShsfX6L4C8nHfDfIl7sO7q91s6vYok4HR3iu5nNR2SCdAiAAsZ+ObxCBagUY3R/qnNHv5VwVClVy9InuY7/M12nKFjhhgw782L0WpMNiwXBJGWAaleNK319pxbu6Sw7uigOXGfuwjRjCY3ty6BjqeAWuYZmFRVjUHOWDgeIJcOeBuXioUknNdkBIpfe0Kuo+rQbyc+k5qpjSFFLlauN0IFfAJuMJeWBdOkE7JKQdHNsjpqsOAjLXLM43Xpn6RDHl+ARXGY4eyazvbx4PJ5/hkshtPxzQscPft2MJarmxqJejAXuYlPELKmjFQaghQpyIJLbPQH3OzCvgBMsvqjg3AoZF29yuJ3DX7rsghyZFz', // Tu session token
    },
});
const dynamoDB = DynamoDBDocumentClient.from(client);

// Inicializar Express
const app = express();
app.use(express.json());

const TABLE_NAME = 'UserLogin';

// Utilidades
const generateSessionString = () => crypto.randomBytes(64).toString('hex');
const getTTL = () => Math.floor(Date.now() / 1000) + 3600; // Expira en 1 hora

// Endpoint: Crear sesión (/alumnos/:alumnoId/session/login)
app.post('/alumnos/:alumnoId/session/login', async (req, res) => {
    const { alumnoId } = req.params;
    const { password } = req.body;

    try {
        const getParams = {
            TableName: TABLE_NAME,
            Key: { id: alumnoId },
        };

        const data = await dynamoDB.send(new GetCommand(getParams));

        if (!data.Item || data.Item.password !== password) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        const sessionString = generateSessionString();
        const ttl = getTTL();

        const updateParams = {
            TableName: TABLE_NAME,
            Key: { id: alumnoId },
            UpdateExpression: 'SET sessionString = :session, ttl = :ttl',
            ExpressionAttributeValues: {
                ':session': sessionString,
                ':ttl': ttl,
            },
        };

        await dynamoDB.send(new UpdateCommand(updateParams));
        res.status(200).json({ sessionString });
    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Endpoint: Verificar sesión (/alumnos/:alumnoId/session/verify)
app.post('/alumnos/:alumnoId/session/verify', async (req, res) => {
    const { alumnoId } = req.params;
    const { sessionString } = req.body;

    try {
        const getParams = {
            TableName: TABLE_NAME,
            Key: { id: alumnoId },
        };

        const data = await dynamoDB.send(new GetCommand(getParams));

        if (!data.Item || data.Item.sessionString !== sessionString) {
            return res.status(400).json({ error: 'Sesión inválida' });
        }

        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime > data.Item.ttl) {
            return res.status(400).json({ error: 'Sesión expirada' });
        }

        res.status(200).json({ valid: true });
    } catch (err) {
        console.error('Error en verifySession:', err);
        res.status(500).json({ error: 'Error al verificar sesión' });
    }
});

// Endpoint: Cerrar sesión (/alumnos/:alumnoId/session/logout)
app.post('/alumnos/:alumnoId/session/logout', async (req, res) => {
    const { alumnoId } = req.params;

    try {
        const updateParams = {
            TableName: TABLE_NAME,
            Key: { id: alumnoId },
            UpdateExpression: 'REMOVE sessionString, ttl',
        };

        await dynamoDB.send(new UpdateCommand(updateParams));
        res.status(200).json({ logout: true });
    } catch (err) {
        console.error('Error en logout:', err);
        res.status(500).json({ error: 'Error al cerrar sesión' });
    }
});

// Inicializar servidor
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
