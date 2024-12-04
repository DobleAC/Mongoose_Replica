// src/models/tipoEnvio.js
const mongoose = require('mongoose');

const tipoEnvioSchema = new mongoose.Schema({
  descripcion: String, // terrestre, aéreo, express
  precio_por_km: Number,
  tiempo_entrega_estimado: String
});

module.exports = mongoose.model('TipoEnvio', tipoEnvioSchema);
