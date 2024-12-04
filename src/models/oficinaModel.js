// src/models/oficina.js
const mongoose = require('mongoose');

const oficinaSchema = new mongoose.Schema({
  nombre: String,
  direccion: {
    calle: String,
    numero: String,
    ciudad: String,
    codigo_postal: String
  },
  telefono: String,
  email: String
});

module.exports = mongoose.model('Oficina', oficinaSchema);
