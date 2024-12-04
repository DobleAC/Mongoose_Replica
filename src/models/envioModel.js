// src/models/envio.js
const mongoose = require('mongoose');

const envioSchema = new mongoose.Schema({
  fecha_envio: Date,
  origen: { type: mongoose.Schema.Types.ObjectId, ref: 'Oficina' },
  destino: { type: mongoose.Schema.Types.ObjectId, ref: 'Oficina' },
  tipo_envio: { type: mongoose.Schema.Types.ObjectId, ref: 'TipoEnvio' },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  peso: Number,
  dimensiones: {
    largo: Number,
    ancho: Number,
    alto: Number
  },
  costo_total: Number,
  estatus: { type: String, enum: ['pendiente', 'transito', 'entregado'] }
});

module.exports = mongoose.model('Envio', envioSchema);
