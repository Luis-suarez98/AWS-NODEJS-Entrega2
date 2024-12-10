const express = require('express');
const router = express.Router();
const connection = require('../config/database');  // Importa la configuración de la base de datos

// Obtener todos los profesores
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM profesores';
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener los profesores', error: err });
        }
        res.status(200).json(results);
    });
});

// Crear un nuevo profesor
router.post('/', (req, res) => {
    const { nombres, apellidos, numeroEmpleado, horasClase } = req.body;

    if (!nombres || !apellidos || !numeroEmpleado || horasClase <= 0) {
        return res.status(400).json({ message: 'Campos inválidos' });
    }

    const sql = 'INSERT INTO profesores (nombres, apellidos, numeroEmpleado, horasClase) VALUES (?, ?, ?, ?)';
    connection.query(sql, [nombres, apellidos, numeroEmpleado, horasClase], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al agregar el profesor', error: err });
        }
        res.status(201).json({ id: results.insertId, nombres, apellidos, numeroEmpleado, horasClase });
    });
});

// Obtener un profesor por ID
router.get('/:id', (req, res) => {
    const profesorId = req.params.id;
    const sql = 'SELECT * FROM profesores WHERE id = ?';
    connection.query(sql, [profesorId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        res.status(200).json(results[0]);
    });
});

// Actualizar un profesor
router.put('/:id', (req, res) => {
    const profesorId = req.params.id;
    const { nombres, apellidos, numeroEmpleado, horasClase } = req.body;

    if (!nombres || !apellidos || !numeroEmpleado || horasClase <= 0) {
        return res.status(400).json({ message: 'Campos inválidos' });
    }

    const sql = 'UPDATE profesores SET nombres = ?, apellidos = ?, numeroEmpleado = ?, horasClase = ? WHERE id = ?';
    connection.query(sql, [nombres, apellidos, numeroEmpleado, horasClase, profesorId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al actualizar el profesor', error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        res.status(200).json({ message: 'Profesor actualizado exitosamente' });
    });
});

// Eliminar un profesor por ID
router.delete('/:id', (req, res) => {
    const profesorId = req.params.id;
    const sql = 'DELETE FROM profesores WHERE id = ?';
    connection.query(sql, [profesorId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar el profesor', error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        res.status(200).json({ message: 'Profesor eliminado exitosamente' });
    });
});

// Agregar manejo de DELETE para la ruta /profesores (sin id) y retornar el estado 405
router.delete('/', (req, res) => {
    res.status(405).json({ message: 'Método no permitido' });
});

module.exports = router;
