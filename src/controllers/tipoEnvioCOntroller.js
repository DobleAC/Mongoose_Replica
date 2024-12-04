// src/controllers/tiposEnvioController.js
const TipoEnvio = require('../models/tipoEnvioModel');

// Crear un nuevo Tipo de Envio
exports.crearTipoEnvio = async (req, res) => {
  try {
    const tipoEnvio = new TipoEnvio(req.body);
    await tipoEnvio.save();
    res.status(201).json(tipoEnvio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todos los Tipos de Envio
exports.listarTiposEnvio = async (req, res) => {
  try {
    const tiposEnvio = await TipoEnvio.find();
    res.status(200).json(tiposEnvio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un Tipo de Envio
exports.actualizarTipoEnvio = async (req, res) => {
  try {
    const tipoEnvio = await TipoEnvio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tipoEnvio) {
      return res.status(404).json({ message: 'Tipo de Envio no encontrado' });
    }
    res.status(200).json(tipoEnvio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un Tipo de Envio
exports.eliminarTipoEnvio = async (req, res) => {
  try {
    const tipoEnvio = await TipoEnvio.findByIdAndDelete(req.params.id);
    if (!tipoEnvio) {
      return res.status(404).json({ message: 'Tipo de Envio no encontrado' });
    }
    res.status(200).json({ message: 'Tipo de Envio eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
