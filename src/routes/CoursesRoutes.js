const express = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const isAdmin = require('../middleware/IsAdmin');
const router = express.Router();
const { query } = require('../db'); 

// Middleware de validación para los cursos
const validateCourse = [
    body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio.'),
    body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0.'),
    body('duracion').isString().notEmpty().withMessage('La duración es obligatoria.'),
    body('nivel').isString().notEmpty().withMessage('El nivel es obligatorio.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// Ruta para obtener todos los cursos
router.get('/cursos', async (req, res) => {
    try {
        const cursosQuery = 'SELECT * FROM cursos_sin_imagen';
        const cursos = await query(cursosQuery);
        res.status(200).json(cursos);
    } catch (error) {
        console.error('Error al obtener los cursos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para obtener un curso por ID junto con sus clases, fechas y horarios
router.get('/cursos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const cursoQuery = 'SELECT * FROM cursos_sin_imagen WHERE id = ?';
        const curso = await query(cursoQuery, [id]);

        if (curso.length === 0) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }

        const clasesQuery = 'SELECT * FROM clases WHERE curso_id = ? ORDER BY orden';
        const clases = await query(clasesQuery, [id]);

        const fechasQuery = 'SELECT * FROM fechas_curso WHERE curso_id = ?';
        const fechas = await query(fechasQuery, [id]);

        res.status(200).json({
            curso: curso[0], 
            clases: clases,  
            fechas: fechas   
        });

    } catch (error) {
        console.error('Error al obtener el curso con sus clases y fechas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para agregar una nueva fecha y horario a un curso
router.post('/cursos/:id/fechas',
    passport.authenticate('jwt', { session: false }), 
    isAdmin,
    [
        body('fecha_inicio')
            .custom(value => {
                if (!value) {
                    throw new Error('La fecha de inicio es obligatoria.');
                }
                const fechaValida = !isNaN(Date.parse(value));
                if (!fechaValida) {
                    throw new Error('La fecha de inicio no es válida.');
                }
                return true;
            }),
        body('fecha_fin')
            .custom(value => {
                if (!value) {
                    throw new Error('La fecha de fin es obligatoria.');
                }
                const fechaValida = !isNaN(Date.parse(value));
                if (!fechaValida) {
                    throw new Error('La fecha de fin no es válida.');
                }
                return true;
            }),
        body('hora_inicio')
            .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
            .withMessage('Hora de inicio no válida'),
        body('hora_fin')
            .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
            .withMessage('Hora de fin no válida'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.error('Errores de validación:', errors.array()); 
                return res.status(400).json({ errors: errors.array() });
            }

            next();
        }
    ],
    async (req, res) => {
        const { id } = req.params;
        const { fecha_inicio, fecha_fin, hora_inicio, hora_fin } = req.body;

        try {
            
            const insertFechaQuery = `
                INSERT INTO fechas_curso (curso_id, fecha_inicio, fecha_fin, hora_inicio, hora_fin) 
                VALUES (?, ?, ?, ?, ?)
            `;
            await query(insertFechaQuery, [id, fecha_inicio, fecha_fin, hora_inicio, hora_fin]);

            res.status(200).json({ message: 'Fecha y horario agregados con éxito.' });
        } catch (error) {
            console.error('Error al agregar las fechas y horarios:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
);

// Ruta para actualizar una fecha y horario de un curso
router.put('/cursos/:id/fechas/:fechaId',
    passport.authenticate('jwt', { session: false }), 
    isAdmin,
    [
        body('fecha_inicio')
            .custom(value => {
                if (!value) {
                    throw new Error('La fecha de inicio es obligatoria.');
                }
                const fechaValida = !isNaN(Date.parse(value));
                if (!fechaValida) {
                    throw new Error('La fecha de inicio no es válida.');
                }
                return true;
            }),
        body('fecha_fin')
            .custom(value => {
                if (!value) {
                    throw new Error('La fecha de fin es obligatoria.');
                }
                const fechaValida = !isNaN(Date.parse(value));
                if (!fechaValida) {
                    throw new Error('La fecha de fin no es válida.');
                }
                return true;
            }),
        body('hora_inicio')
            .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
            .withMessage('Hora de inicio no válida'),
        body('hora_fin')
            .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
            .withMessage('Hora de fin no válida'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.error('Errores de validación (PUT):', errors.array());
                return res.status(400).json({ errors: errors.array() });
            }

            next();
        }
    ],
    async (req, res) => {
        const { id: cursoId, fechaId } = req.params;
        const { fecha_inicio, fecha_fin, hora_inicio, hora_fin } = req.body;

        try {
            
            const checkFechaQuery = `SELECT * FROM fechas_curso WHERE id = ? AND curso_id = ?`;
            const fechaExistente = await query(checkFechaQuery, [fechaId, cursoId]);

            if (fechaExistente.length === 0) {
                return res.status(404).json({ message: 'Fecha no encontrada.' });
            }


            const updateFechaQuery = `
                UPDATE fechas_curso 
                SET fecha_inicio = ?, fecha_fin = ?, hora_inicio = ?, hora_fin = ?
                WHERE id = ? AND curso_id = ?
            `;
            const result = await query(updateFechaQuery, [fecha_inicio, fecha_fin, hora_inicio, hora_fin, fechaId, cursoId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No se pudo actualizar la fecha.' });
            }

            res.status(200).json({ message: 'Fecha y horario actualizados con éxito.' });
        } catch (error) {
            console.error('Error al actualizar la fecha:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
);


// Ruta para eliminar una fecha y horario de un curso
router.delete('/cursos/:id/fechas/:fechaId',
    passport.authenticate('jwt', { session: false }), 
    isAdmin,
    async (req, res) => {
        const { id: cursoId, fechaId } = req.params;

        try {
            const checkFechaQuery = `SELECT * FROM fechas_curso WHERE id = ? AND curso_id = ?`;
            const fechaExistente = await query(checkFechaQuery, [fechaId, cursoId]);

            if (fechaExistente.length === 0) {
                return res.status(404).json({ message: 'Fecha no encontrada.' });
            }

            const deleteFechaQuery = `DELETE FROM fechas_curso WHERE id = ? AND curso_id = ?`;
            const result = await query(deleteFechaQuery, [fechaId, cursoId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No se pudo eliminar la fecha.' });
            }

            res.status(200).json({ message: 'Fecha y horario eliminados con éxito.' });
        } catch (error) {
            console.error('Error al eliminar la fecha:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
);

// Ruta para actualizar un curso y sus clases por ID (solo administradores)
router.put('/cursos/update/:id',
    passport.authenticate('jwt', { session: false }), 
    isAdmin,
    validateCourse,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, descripcion, duracion, nivel, precio, clases } = req.body;

            const updateCursoQuery = `
                UPDATE cursos_sin_imagen 
                SET nombre = ?, descripcion = ?, duracion = ?, nivel = ?, precio = ?, updatedAt = NOW() 
                WHERE id = ?
            `;
            const result = await query(updateCursoQuery, [nombre, descripcion, duracion, nivel, precio, id]);

            if (result.affectedRows > 0) {
                if (clases && Array.isArray(clases)) {
                    for (const clase of clases) {
                        if (clase.id) {
                            const updateClaseQuery = `
                                UPDATE clases 
                                SET titulo = ?, descripcion = ?, orden = ?, video_url = ?, material_adicional = ? 
                                WHERE id = ? AND curso_id = ?
                            `;
                            await query(updateClaseQuery, [
                                clase.titulo, clase.descripcion, clase.orden, clase.video_url, clase.material_adicional, clase.id, id
                            ]);
                        } else {
                            const insertClaseQuery = `
                                INSERT INTO clases (curso_id, titulo, descripcion, orden, video_url, material_adicional) 
                                VALUES (?, ?, ?, ?, ?, ?)
                            `;
                            await query(insertClaseQuery, [
                                id, clase.titulo, clase.descripcion, clase.orden, clase.video_url, clase.material_adicional
                            ]);
                        }
                    }
                }

                const updatedCurso = await query('SELECT * FROM cursos_sin_imagen WHERE id = ?', [id]);
                const updatedClases = await query('SELECT * FROM clases WHERE curso_id = ? ORDER BY orden', [id]);

                res.status(200).json({
                    message: 'Curso y clases actualizados con éxito',
                    curso: updatedCurso[0],
                    clases: updatedClases
                });
            } else {
                res.status(404).json({ message: 'Curso no encontrado' });
            }
        } catch (error) {
            console.error('Error al actualizar el curso y sus clases:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
);
// Ruta para actualizar el precio de un curso específico
router.put('/cursos/:id/precio',
    passport.authenticate('jwt', { session: false }), 
    isAdmin,
    [
        body('precio')
            .isFloat({ min: 0 })
            .withMessage('El precio debe ser un número mayor o igual a 0.'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    async (req, res) => {
        const { id } = req.params;
        const { precio } = req.body;

        try {
            // Verificar si el curso existe
            const cursoExistente = await query('SELECT * FROM cursos_sin_imagen WHERE id = ?', [id]);
            if (cursoExistente.length === 0) {
                return res.status(404).json({ message: 'Curso no encontrado' });
            }

            // Actualizar el precio del curso
            const updatePrecioQuery = 'UPDATE cursos_sin_imagen SET precio = ? WHERE id = ?';
            const result = await query(updatePrecioQuery, [precio, id]);

            if (result.affectedRows === 0) {
                return res.status(400).json({ message: 'No se pudo actualizar el precio del curso' });
            }

            res.status(200).json({ message: 'Precio del curso actualizado con éxito', precio });
        } catch (error) {
            console.error('Error al actualizar el precio del curso:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
);

module.exports = router;
