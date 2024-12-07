const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Almacenamiento en memoria
const alumnos = {};
const profesores = {};

// Generador de IDs aleatorios (Entre 1 y 1,000,000)
const generateId = () => {
    const id = Math.floor(Math.random() * 1000000) + 1; // Asegura que el ID esté entre 1 y 1,000,000
    return id;
};

// Validar los campos del alumno
const validateAlumno = (alumno) => {
    return (
        typeof alumno.nombres === "string" && alumno.nombres.trim() !== "" &&
        typeof alumno.apellidos === "string" && alumno.apellidos.trim() !== "" &&
        typeof alumno.matricula === "string" && alumno.matricula.trim() !== "" &&
        typeof alumno.promedio === "number" && alumno.promedio >= 0.00 && alumno.promedio <= 100.00
    );
};


// Validar los campos del profesor
const validateProfesor = (profesor) => {
    return (
        typeof profesor.nombres === "string" && profesor.nombres.trim() !== "" &&
        typeof profesor.apellidos === "string" && profesor.apellidos.trim() !== "" &&
        typeof profesor.numeroEmpleado === "number" && profesor.numeroEmpleado >= 0 &&
        typeof profesor.horasClase === "number" && profesor.horasClase >= 0 && profesor.horasClase <= 50
    );
};

// Rutas de Alumnos

app.get("/alumnos", (req, res) => {
    res.status(200).json(Object.values(alumnos));
});

app.post("/alumnos", (req, res) => {
    const alumno = req.body;

    // Validar los datos del alumno
    if (!validateAlumno(alumno)) {
        return res.status(400).json({ error: "Invalid alumno fields" });
    }

    // Validar que el ID no esté vacío y no exista ya
    if (!alumno.id) {
        return res.status(400).json({ error: "ID is required" });
    }
    if (alumnos[alumno.id]) {
        return res.status(400).json({ error: "Alumno with this ID already exists" });
    }

    // Guardar el alumno en memoria
    alumnos[alumno.id] = alumno;

    // Retornar el alumno con el ID asignado
    res.status(201).json(alumno);
});


app.get("/alumnos/:id", (req, res) => {
     const id = parseInt(req.params.id, 10);

     //Validar si el ID está dentro del rango permitido
    if (id < 1 || id > 1000000) {
        return res.status(400).json({ error: "ID out of range. ID must be between 1 and 1,000,000." });
    }

    // Buscar el alumno por el ID
    const alumno = alumnos[id];

    // Si no se encuentra, devolver error 404
    if (!alumno) {
        return res.status(404).json({ error: `Alumno with ID ${id} not found` });
    }

    // Devolver el alumno encontrado
    res.status(200).json(alumno);
});

app.put("/alumnos/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const alumno = alumnos[id];

    // Si el alumno no existe, devolver error 404
    if (!alumno) {
        return res.status(404).json({ error: "Alumno not found" });
    }

    const updatedAlumno = req.body;

    // Validar los datos del alumno actualizado
    if (!validateAlumno(updatedAlumno)) {
        return res.status(400).json({ error: "Invalid alumno fields" });
    }

    // Actualizar el alumno en memoria
    updatedAlumno.id = id;
    alumnos[id] = updatedAlumno;

    // Retornar el alumno actualizado
    res.status(200).json(updatedAlumno);
});

app.delete("/alumnos/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    // Verificar si el alumno existe
    if (!alumnos[id]) {
        return res.status(404).json({ error: "Alumno not found" });
    }

    // Eliminar el alumno
    delete alumnos[id];
    res.status(200).send();
});

// Rutas de Profesores

app.get("/profesores", (req, res) => {
    res.status(200).json(Object.values(profesores));
});

app.post("/profesores", (req, res) => {
    const profesor = req.body;

    // Validar los datos del profesor
    if (!validateProfesor(profesor)) {
        return res.status(400).json({ error: "Invalid profesor fields" });
    }

    // Validar que el ID no esté vacío y no exista ya
    if (!profesor.id) {
        return res.status(400).json({ error: "ID is required" });
    }
    if (profesores[profesor.id]) {
        return res.status(400).json({ error: "Profesor with this ID already exists" });
    }

    // Guardar el profesor en memoria
    profesores[profesor.id] = profesor;

    // Retornar el profesor con el ID asignado
    res.status(201).json(profesor);
});


app.get("/profesores/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    // Validar si el ID está dentro del rango permitido
    if (id < 1 || id > 1000000) {
        return res.status(400).json({ error: "ID out of range. ID must be between 1 and 1,000,000." });
    }

    // Buscar el profesor por el ID
    const profesor = profesores[id];

    // Si no se encuentra, devolver error 404
    if (!profesor) {
        return res.status(404).json({ error: `Profesor with ID ${id} not found` });
    }

    // Devolver el profesor encontrado
    res.status(200).json(profesor);
});

app.put("/profesores/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const profesor = profesores[id];

    // Si el profesor no existe, devolver error 404
    if (!profesor) {
        return res.status(404).json({ error: "Profesor not found" });
    }

    const updatedProfesor = req.body;

    // Validar los datos del profesor actualizado
    if (!validateProfesor(updatedProfesor)) {
        return res.status(400).json({ error: "Invalid profesor fields" });
    }

    // Actualizar el profesor en memoria
    updatedProfesor.id = id;
    profesores[id] = updatedProfesor;

    // Retornar el profesor actualizado
    res.status(200).json(updatedProfesor);
});

app.delete("/profesores/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    // Verificar si el profesor existe
    if (!profesores[id]) {
        return res.status(404).json({ error: "Profesor not found" });
    }

    // Eliminar el profesor
    delete profesores[id];
    res.status(200).send();
});

// Manejo de rutas no válidas y métodos no soportados
app.all(["/alumnos", "/profesores"], (req, res) => {
    res.status(405).json({ error: "Method not allowed" });
});

// Iniciar el servidor
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
