const express = require('express');
const router = express.Router();
const connection = require('../config/database'); // MySQL
const dynamoDB = require('../config/dynamodb'); // DynamoDB
const { PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const crypto = require('crypto');

// Obtener alumno desde MySQL
async function getAlumnoFromDatabaseMySQL(alumnoId) {
    return new Promise((resolve, reject) => {
        console.log('Fetching alumno from MySQL with ID:', alumnoId);
        const sql = 'SELECT * FROM alumnos WHERE id = ?';
        connection.query(sql, [alumnoId], (err, results) => {
            if (err) {
                console.error('Error fetching alumno from MySQL:', err);
                return reject(err);
            }
            console.log('Alumno fetched from MySQL:', results);
            resolve(results.length ? results[0] : null);
        });
    });
}

// Generar cadena de sesión aleatoria
function generateSessionString() {
    const sessionString = crypto.randomBytes(64).toString('hex');
    console.log('Generated session string:', sessionString);
    return sessionString;
}

// Login
router.post('/:id/session/login', async (req, res) => {
    const id = req.params.id; // Usar id en minúscula
    const { password } = req.body;

    console.log('Login request received:', { id, password });

    if (!password) {
        console.warn('Missing password in login request');
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    try {
        const alumno = await getAlumnoFromDatabaseMySQL(id);
        console.log('Alumno data:', alumno);

        if (alumno && alumno.password === password) {
            const sessionString = generateSessionString();
            const params = {
                TableName: 'UserLogin',
                Item: {
                    id: id, // session ID (UUID generado automáticamente)
                    fecha: Date.now(),
                    alumnoId: id,
                    active: true,
                    sessionString: sessionString,
                },
            };

            console.log('Storing session in DynamoDB:', params);
            await dynamoDB.send(new PutCommand(params));
            console.log('Session stored successfully');
            return res.status(200).json({ sessionString });
        } else {
            console.warn('Invalid credentials');
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Error al crear la sesión', error });
    }
});

// Verificar sesión
router.post('/:id/session/verify', async (req, res) => {
    const id = req.params.id; // Usar id en minúscula
    const { sessionString } = req.body;

    console.log('Verify session request received:', { id, sessionString });

    if (!sessionString) {
        console.warn('Missing sessionString in verify request');
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    try {
        const params = {
            TableName: 'UserLogin',
            Key: { id: id },
        };

        console.log('Fetching session from DynamoDB:', params);
        const result = await dynamoDB.send(new GetCommand(params));
        console.log('Session fetched from DynamoDB:', result);

        if (result.Item && result.Item.sessionString === sessionString && result.Item.active) {
            console.log('Session is valid');
            return res.status(200).json({ message: 'Sesión válida' });
        } else {
            console.warn('Session is invalid or inactive');
            return res.status(400).json({ message: 'Sesión inválida o inactiva' });
        }
    } catch (error) {
        console.error('Error during session verification:', error);
        return res.status(500).json({ message: 'Error al verificar la sesión', error });
    }
});

// Cerrar sesión
router.post('/:id/session/logout', async (req, res) => {
    const id = req.params.id; // Usar id en minúscula
    const { sessionString } = req.body;

    console.log('Logout request received:', { id, sessionString });

    if (!sessionString) {
        console.warn('Missing sessionString in logout request');
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    try {
        const params = {
            TableName: 'UserLogin',
            Key: { id: id },
            UpdateExpression: 'SET active = :active',
            ExpressionAttributeValues: {
                ':active': false,
            },
        };

        console.log('Marking session as inactive in DynamoDB:', params);
        await dynamoDB.send(new UpdateCommand(params));
        console.log('Session marked as inactive');
        return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Error al cerrar la sesión', error });
    }
});

module.exports = router;
