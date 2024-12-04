// src/controllers/enviosController.js
const Envio = require('../models/envioModel');


// Crear un nuevo Envio
exports.crearEnvio = async (req, res) => {
  try {
    const envio = new Envio(req.body);
    await envio.save();
    res.status(201).json(envio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todos los envíos
exports.listarEnvios = async (req, res) => {
  try {
    const envios = await Envio.find().populate('origen destino tipo_envio cliente');
    res.status(200).json(envios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un Envio
exports.actualizarEnvio = async (req, res) => {
  try {
    const envio = await Envio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!envio) {
      return res.status(404).json({ message: 'Envio no encontrado' });
    }
    res.status(200).json(envio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un Envio
exports.eliminarEnvio = async (req, res) => {
  try {
    const envio = await Envio.findByIdAndDelete(req.params.id);
    if (!envio) {
      return res.status(404).json({ message: 'Envio no encontrado' });
    }
    res.status(200).json({ message: 'Envio eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
