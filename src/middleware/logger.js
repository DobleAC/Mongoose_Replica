// src/middleware/logger.js
const redis = require('redis');
require('dotenv').config();  // Asegurarse de cargar las variables de entorno desde .env

// Crear el cliente Redis con las variables de entorno
const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

// Manejar la conexión a Redis
client.on('connect', () => {
  console.log('Conectado a Redis');
});

client.on('error', (err) => {
  console.error('Error de conexión a Redis:', err);
});

// Intentar conectar a Redis al iniciar la aplicación
client.connect().catch((err) => {
  console.error('Error al conectar a Redis:', err);
});

// Middleware para registrar las solicitudes y respuestas
module.exports = (req, res, next) => {
  // Registrar los logs después de que la respuesta ha sido procesada
  res.on('finish', async () => {
    // Verificar si el cliente de Redis está conectado antes de guardar los logs
    if (!client.isOpen) {
      console.error('El cliente Redis no está conectado.');
      return;
    }

    // Crear una clave única para el log (usando método, URL y timestamp)
    const key = `${req.method}:${Date.now()}:${req.originalUrl}`;
    
    // Crear el registro de la solicitud y respuesta con una estructura más ordenada
    const logEntry = {
      time: new Date().toISOString(),
      method: req.method,        // Nombre del método HTTP
      endpoint: req.originalUrl, // Endpoint solicitado
      req: {
        headers: req.headers,
        body: req.body // Guardar el body de la solicitud
      },
      res: {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage
      }
    };

    // Convertir el objeto logEntry a JSON string con un formato bonito y legible
    const formattedLogEntry = JSON.stringify(logEntry, null, 2); // 'null, 2' para tener una indentación de 2 espacios

    try {
      // Guardar el log en Redis con una expiración de 24 horas (86400 segundos)
      await client.set(key, formattedLogEntry, 'EX', 60 * 60 * 24);
      console.log('Log guardado en Redis');
    } catch (err) {
      console.error('Error al salvar el log en Redis:', err);
    }
  });

  // Pasar al siguiente middleware o ruta
  next();
};


