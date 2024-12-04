// src/routes/clientesRoutes.js
const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

// Crear, Listar, Actualizar y Eliminar Clientes
router.post('/', clientesController.crearCliente);
router.get('/', clientesController.listarClientes);
router.put('/:id', clientesController.actualizarCliente);
router.delete('/:id', clientesController.eliminarCliente);

module.exports = router;
