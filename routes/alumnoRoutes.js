const express = require('express');
const router = express.Router();
const connection = require('../config/database');  // Importa la configuración de la base de datos
const { PublishCommand } = require('@aws-sdk/client-sns');
const snsClient = require('../config/awsConfigSns'); // Importar configuración de SNS

// Ruta para obtener todos los alumnos
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM alumnos';
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener los alumnos', error: err });
        }
        res.json(results);
    });
});

// Ruta para agregar un nuevo alumno
router.post('/', (req, res) => {
    const { nombres, apellidos, matricula, promedio, password } = req.body;

    // Validación de los campos
    if (!nombres || nombres.trim() === '') {
        return res.status(400).json({ message: 'El campo "nombres" es obligatorio y no puede estar vacío.' });
    }
    if (!apellidos || apellidos.trim() === '') {
        return res.status(400).json({ message: 'El campo "apellidos" es obligatorio y no puede estar vacío.' });
    }
    if (promedio < 0 || promedio > 10) {
        return res.status(400).json({ message: 'El campo "promedio" debe ser un valor entre 0 y 10.' });
    }

    const sql = 'INSERT INTO alumnos (nombres, apellidos, matricula, promedio, password) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [nombres, apellidos, matricula, promedio, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al insertar el alumno', error: err });
        }
        res.status(201).json({ message: 'Alumno creado exitosamente', id: results.insertId });
    });
});

// Ruta para obtener un alumno por su ID
router.get('/:id', (req, res) => {
    const alumnoId = req.params.id;

    const sql = 'SELECT * FROM alumnos WHERE id = ?';
    connection.query(sql, [alumnoId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ message: 'Alumno no encontrado' });
        }
        res.json(results[0]);
    });
});

// Ruta para actualizar los datos de un alumno
router.put('/:id', (req, res) => {
    const alumnoId = req.params.id;
    const { nombres, apellidos, matricula, promedio, password } = req.body;

    // Validación de los campos
    if (!nombres || nombres.trim() === '') {
        return res.status(400).json({ message: 'El campo "nombres" es obligatorio y no puede estar vacío.' });
    }
    if (!apellidos || apellidos.trim() === '') {
        return res.status(400).json({ message: 'El campo "apellidos" es obligatorio y no puede estar vacío.' });
    }
    if (promedio < 0 || promedio > 10) {
        return res.status(400).json({ message: 'El campo "promedio" debe ser un valor entre 0 y 10.' });
    }

    const sql = 'UPDATE alumnos SET nombres = ?, apellidos = ?, matricula = ?, promedio = ?, password = ? WHERE id = ?';
    connection.query(sql, [nombres, apellidos, matricula, promedio, password, alumnoId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al actualizar el alumno', error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Alumno no encontrado' });
        }
        res.status(200).json({ message: 'Alumno actualizado exitosamente' });
    });
});

// Ruta para eliminar un alumno
router.delete('/:id', (req, res) => {
    const alumnoId = req.params.id;

    const sql = 'DELETE FROM alumnos WHERE id = ?';
    connection.query(sql, [alumnoId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar el alumno', error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Alumno no encontrado' });
        }
        res.status(200).json({ message: 'Alumno eliminado exitosamente' });
    });
});

// Ruta para manejar métodos no soportados
router.all('/', (req, res) => {
    res.status(405).json({ message: 'Método no permitido en esta ruta' });
});

// Ruta para enviar correo a un alumno (solo si existe)
router.post('/:id/email', (req, res) => {
    const alumnoId = req.params.id;

    console.log('Iniciando proceso de envío de correo para alumno con ID:', alumnoId);

    // Buscar al alumno en la base de datos
    const sql = 'SELECT nombres, promedio FROM alumnos WHERE id = ?';
    connection.query(sql, [alumnoId], async (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).json({ message: 'Error interno al consultar la base de datos' });
        }

        if (results.length === 0) {
            console.log('No se encontró al alumno con ID:', alumnoId);
            return res.status(404).json({ message: 'Alumno no encontrado' });
        }

        const alumno = results[0];
        const { nombres, promedio } = alumno;

        console.log(`Alumno encontrado: Nombre=${nombres}, Calificación=${promedio}`);

        // Construir el mensaje para SNS
        const params = {
            Message: `Hola ${nombres}, tu calificación es ${promedio}. ¡Sigue esforzándote!`,
            Subject: 'Calificación de tu evaluación',
            TopicArn: 'arn:aws:sns:us-east-1:608044474656:EmailAWS' // Sustituye con tu ARN
        };

        console.log('Enviando mensaje SNS con parámetros:', params);

        try {
            // Publicar el mensaje en SNS
            const data = await snsClient.send(new PublishCommand(params));
            console.log('Mensaje enviado exitosamente. ID del mensaje SNS:', data.MessageId);

            res.status(200).json({
                message: 'Mensaje enviado exitosamente mediante SNS',
                snsMessageId: data.MessageId
            });
        } catch (error) {
            console.error('Error al enviar el mensaje SNS:', error);
            res.status(500).json({ message: 'Error al enviar el mensaje mediante SNS' });
        }
    });
});
/************************************************************ */

//const express = require('express');
//const router = express.Router();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const uuid = require('uuid'); // Para generar un ID único para la sesión

// Configuración de DynamoDB
const client = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'ASIAY3ESGMEQKUWPXA6B', // Tu clave de acceso
        secretAccessKey: 'cBMG/FK0ixXKYWWL+wEZJXTcLkjkEHReYpDRaXIT', // Tu clave secreta
        sessionToken: 'IQoJb3JpZ2luX2VjEML//////////wEaCXVzLXdlc3QtMiJGMEQCIDF+gSMj+Xph1819DI6c09DXA+UmaxGoWf+ovYywWMFnAiAL+aoee3RVih4jaintXMqYNn/6oKJ3EoF8QoI7Fdr8Hiq1Agh7EAIaDDYwODA0NDQ3NDY1NiIMKOnvnCqE2TZhNADRKpIC6I9ItT0ZfcBgUuojtoQY6iMAoiL3ajFmKEuQJwdMwfVLiU1icgCQGDnrDD66cME52o9iYEWldGlDiyrutgYlwsOWhDhZAGHjE9lYK6ShOdDBK6lzx/kn4KUMkIFGIe4P43imvDR1zWCPknXFayZH4oPCuNq3skkRLDDPX1IsybBJIbhe2ijFdbzC6bzD5Az+08jIpD3GRb16yb8bFM2wEldFbsMMLiSBgvwShsfX6L4C8nHfDfIl7sO7q91s6vYok4HR3iu5nNR2SCdAiAAsZ+ObxCBagUY3R/qnNHv5VwVClVy9InuY7/M12nKFjhhgw782L0WpMNiwXBJGWAaleNK319pxbu6Sw7uigOXGfuwjRjCY3ty6BjqeAWuYZmFRVjUHOWDgeIJcOeBuXioUknNdkBIpfe0Kuo+rQbyc+k5qpjSFFLlauN0IFfAJuMJeWBdOkE7JKQdHNsjpqsOAjLXLM43Xpn6RDHl+ARXGY4eyazvbx4PJ5/hkshtPxzQscPft2MJarmxqJejAXuYlPELKmjFQaghQpyIJLbPQH3OzCvgBMsvqjg3AoZF29yuJ3DX7rsghyZFz', // Tu session token
    },
});
const dynamoDB = DynamoDBDocumentClient.from(client);

// Ruta para crear una sesión de un alumno (login)
router.post('/:id/session/login', (req, res) => {
    const alumnoId = req.params.id;
    const { password } = req.body;

    // Verificar si el alumno existe y si la contraseña es correcta
    const sql = 'SELECT * FROM alumnos WHERE id = ? AND password = ?';
    connection.query(sql, [alumnoId, password], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Generar un sessionString único para la sesión
        const sessionString = uuid.v4();

        // Guardar la sesión en DynamoDB
        const params = {
            TableName: 'Sessions', // Tabla de sesiones
            Item: {
                alumnoId,
                sessionString,
                createdAt: new Date().toISOString(),
            },
        };

        try {
            await dynamoDB.send(new PutCommand(params));
            res.status(200).json({ sessionString });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear sesión', error });
        }
    });
});

// Ruta para verificar la sesión de un alumno
router.post('/:id/session/verify', async (req, res) => {
    const alumnoId = req.params.id;
    const { sessionString } = req.body;

    const params = {
        TableName: 'Sessions',
        Key: { alumnoId, sessionString },
    };

    try {
        const { Item } = await dynamoDB.send(new GetCommand(params));
        if (!Item) {
            return res.status(400).json({ message: 'Sesión no válida o expirada' });
        }
        res.status(200).json({ message: 'Sesión válida' });
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar la sesión', error });
    }
});

// Ruta para cerrar sesión (logout)
router.post('/:id/session/logout', async (req, res) => {
    const alumnoId = req.params.id;
    const { sessionString } = req.body;

    const params = {
        TableName: 'Sessions',
        Key: { alumnoId, sessionString },
    };

    try {
        await dynamoDB.send(new DeleteCommand(params));
        res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cerrar sesión', error });
    }
});
module.exports = router;
