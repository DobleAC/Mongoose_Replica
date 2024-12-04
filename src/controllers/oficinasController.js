// src/controllers/oficinasController.js
const Oficina = require('../models/oficinaModel');

// Crear una nueva Oficina
exports.crearOficina = async (req, res) => {
  try {
    const oficina = new Oficina(req.body);
    await oficina.save();
    res.status(201).json(oficina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todas las Oficinas
exports.listarOficinas = async (req, res) => {
  try {
    const oficinas = await Oficina.find();
    res.status(200).json(oficinas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar una Oficina
exports.actualizarOficina = async (req, res) => {
  try {
    const oficina = await Oficina.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!oficina) {
      return res.status(404).json({ message: 'Oficina no encontrada' });
    }
    res.status(200).json(oficina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar una Oficina
exports.eliminarOficina = async (req, res) => {
  try {
    const oficina = await Oficina.findByIdAndDelete(req.params.id);
    if (!oficina) {
      return res.status(404).json({ message: 'Oficina no encontrada' });
    }
    res.status(200).json({ message: 'Oficina eliminada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

