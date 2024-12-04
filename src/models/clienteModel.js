// src/models/cliente.js
const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  curp: String,
  nombre: String,
  apellidos: String,
  email: String
});

module.exports = mongoose.model('Cliente', clienteSchema);
