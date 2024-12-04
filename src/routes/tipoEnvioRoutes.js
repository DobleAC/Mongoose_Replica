// src/routes/tiposEnvioRoutes.js
const express = require('express');
const router = express.Router();
const tiposEnvioController = require('../controllers/tipoEnvioCOntroller');

// Crear, Listar, Actualizar y Eliminar Tipos de Envio
router.post('/', tiposEnvioController.crearTipoEnvio);
router.get('/', tiposEnvioController.listarTiposEnvio);
router.put('/:id', tiposEnvioController.actualizarTipoEnvio);
router.delete('/:id', tiposEnvioController.eliminarTipoEnvio);

module.exports = router;
