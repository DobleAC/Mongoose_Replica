// Importar los módulos necesarios
const mongoose = require('mongoose'); // Módulo para interactuar con MongoDB
const redis = require('redis'); // Módulo para interactuar con Redis
require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Este es el único parámetro necesario
})
.then(() => {
  console.log('Conectado a MongoDB');
})
.catch((error) => {
  console.error('Error al conectar a MongoDB:', error);
});

/// Configuración de Redis
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,  // Dirección del host de Redis
    port: process.env.REDIS_PORT   // Puerto del contenedor Redis
  }
});

// Manejo de errores en la conexión de Redis
redisClient.on('error', (err) => {
  console.error('Error en la conexión a Redis:', err); // Mensaje de error en la conexión a Redis
});

// Intentar conectar a Redis
redisClient.connect()
.then(() => {
  console.log('Conectado a Redis');
})
.catch((err) => {
  console.error('No se pudo conectar a Redis:', err); // Mensaje si la conexión a Redis falla
});

// Exportar las instancias de mongoose y redisClient para ser utilizadas en otras partes de la aplicación
module.exports = { mongoose, redisClient };