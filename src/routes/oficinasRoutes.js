// src/routes/oficinasRoutes.js
const express = require('express');
const router = express.Router();
const oficinasController = require('../controllers/oficinasController');
const Oficina = require('../models/oficinaModel');

// Crear, Listar, Actualizar y Eliminar Oficinas
router.post('/', oficinasController.crearOficina);
router.get('/', oficinasController.listarOficinas);
router.put('/:id', oficinasController.actualizarOficina);
router.delete('/:id', oficinasController.eliminarOficina);

// Listar todas las oficinas
router.get('/', async (req, res) => {
    try {
      const oficinas = await Oficina.find();
      res.json(oficinas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


module.exports = router;