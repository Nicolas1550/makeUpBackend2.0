const express = require('express');
const moment = require('moment'); // Importar moment.js
const Disponibilidad = require('../models/Disponibilidad');
const router = express.Router();
const Servicio = require('../models/Services');

// Ruta para obtener todas las disponibilidades
router.get('/', async (req, res) => {
  try {
    const disponibilidades = await Disponibilidad.findAll({
      include: {
        model: Servicio,
        as: 'servicio',
        attributes: ['nombre', 'precio']
      }
    });

    const formattedDisponibilidades = disponibilidades.map(disp => ({
      id: disp.id,
      servicio_nombre: disp.servicio.nombre,
      servicio_precio: disp.servicio.precio,
      fecha_inicio: disp.fecha_inicio,
      fecha_fin: disp.fecha_fin,
      disponible: disp.disponible
    }));

    res.json(formattedDisponibilidades);
  } catch (error) {
    console.error('Error fetching disponibilidades:', error.message);
    res.status(500).json({ message: 'Error fetching disponibilidades' });
  }
});

// Ruta para obtener disponibilidades segmentadas por servicio_id
router.get('/servicio/:id', async (req, res) => {
  const servicioId = req.params.id;
  try {
    const disponibilidades = await Disponibilidad.findAll({
      where: { servicio_id: servicioId },
      include: {
        model: Servicio,
        as: 'servicio',
        attributes: ['nombre', 'precio']
      }
    });

    const formattedDisponibilidades = disponibilidades.map(disp => ({
      id: disp.id,
      servicio_nombre: disp.servicio.nombre,
      servicio_precio: disp.servicio.precio,
      fecha_inicio: disp.fecha_inicio,
      fecha_fin: disp.fecha_fin,
      disponible: disp.disponible
    }));

    res.json(formattedDisponibilidades);
  } catch (error) {
    console.error('Error fetching disponibilidades:', error.message);
    res.status(500).json({ message: 'Error fetching disponibilidades' });
  }
});

// Ruta para agregar nueva disponibilidad
router.post('/', async (req, res) => {
  const { servicio_id, fecha_inicio, fecha_fin, disponible } = req.body;

  try {
    // Restar 3 horas antes de almacenar
    const fechaInicioUTC = moment(fecha_inicio).subtract(3, 'hours').toISOString();
    const fechaFinUTC = moment(fecha_fin).subtract(3, 'hours').toISOString();
    
    const nuevaDisponibilidad = await Disponibilidad.create({
      servicio_id,
      fecha_inicio: fechaInicioUTC,
      fecha_fin: fechaFinUTC,
      disponible,
    });
    console.log('Nueva disponibilidad creada:', nuevaDisponibilidad);

    res.status(201).json(nuevaDisponibilidad);
  } catch (error) {
    console.error('Error adding disponibilidad:', error.message);
    res.status(400).json({ message: error.message });
  }
});


// Ruta para modificar disponibilidad existente
router.put('/:id', async (req, res) => {
  const { servicio_id, fecha_inicio, fecha_fin, disponible } = req.body;
  try {
    console.log('Updating disponibilidad:', req.params.id, req.body);
    const disponibilidad = await Disponibilidad.findByPk(req.params.id); // findByPk para buscar por ID
    if (!disponibilidad) {
      return res.status(404).json({ message: 'Disponibilidad not found' });
    }
    // Restar 3 horas antes de actualizar
    disponibilidad.servicio_id = servicio_id;
    disponibilidad.fecha_inicio = moment(fecha_inicio).subtract(3, 'hours').toISOString();
    disponibilidad.fecha_fin = moment(fecha_fin).subtract(3, 'hours').toISOString();
    disponibilidad.disponible = disponible;
    await disponibilidad.save();
    console.log('Disponibilidad actualizada:', disponibilidad);
    res.json(disponibilidad);
  } catch (error) {
    console.error('Error updating disponibilidad:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// Ruta para eliminar disponibilidad
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting disponibilidad:', req.params.id);
    await Disponibilidad.destroy({ where: { id: req.params.id } });
    console.log('Disponibilidad eliminada:', req.params.id);
    res.json({ message: 'Disponibilidad eliminada' });
  } catch (error) {
    console.error('Error deleting disponibilidad:', error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
