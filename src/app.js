// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Rutas
const enviosRoutes = require('./routes/enviosRoutes');
const oficinasRoutes = require('./routes/oficinasRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const tiposEnvioRoutes = require('./routes/tipoEnvioRoutes');

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware para parsear el cuerpo de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const logger = require('./middleware/logger');
app.use(logger);

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log('Error al conectar a MongoDB:', err));

// Rutas
app.use('/api/envios', enviosRoutes);
app.use('/api/oficinas', oficinasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/tiposenvio', tiposEnvioRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

module.exports = app;
