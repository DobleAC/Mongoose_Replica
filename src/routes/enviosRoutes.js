// src/routes/enviosRoutes.js
const express = require('express');
const router = express.Router();
const enviosController = require('../controllers/enviosController');
const Envio = require('../models/envioModel');
const Oficina = require('../models/oficinaModel');
const TipoEnvio = require('../models/tipoEnvioModel');
const mongoose = require('mongoose');

// Crear, Listar, Actualizar y Eliminar Envíos
router.post('/', enviosController.crearEnvio);
router.get('/', enviosController.listarEnvios);
router.put('/:id', enviosController.actualizarEnvio);
router.delete('/:id', enviosController.eliminarEnvio);

// Ruta para listar los envíos realizados en una oficina con estatus en tránsito
router.get('/oficina/:oficinaId/estatus/transito', async (req, res) => {
    try {
        const oficinaId = new mongoose.Types.ObjectId(req.params.oficinaId);  // Convertir el ID de oficina a ObjectId

        // Buscar envíos cuyo origen o destino coincidan con la oficina y estén en tránsito
        const envios = await Envio.find({
            $or: [
                { "origen": oficinaId },   // Referencia a oficina en origen
                { "destino": oficinaId }    // Referencia a oficina en destino
            ],
            estatus: "transito"
        })
        .populate('origen')           // Obtener la oficina de origen
        .populate('destino')          // Obtener la oficina de destino
        .populate('tipo_envio')       // Obtener el tipo de envío
        .populate('cliente');         // Obtener el cliente

        if (envios.length > 0) {
            res.json(envios);  // Devolver los envíos con las oficinas completas
        } else {
            res.status(404).json({ message: 'No se encontraron envíos en tránsito para esta oficina.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


  // Listar envíos por tipo de envío específico
router.get('/tipo/:tipoEnvioId', async (req, res) => {
    try {
      const tipoEnvioId = req.params.tipoEnvioId;
      const envios = await Envio.find({ tipo_envio: tipoEnvioId });
      res.json(envios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  /*

  // Listar envíos realizados por un cliente específico
router.get('/cliente/:clienteId', async (req, res) => {
    try {
      const clienteId = req.params.clienteId;
      const envios = await Envio.find({ 'cliente._id': clienteId });
      res.json(envios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
*/
// Ruta para listar los envíos realizados por un cliente en específico en todas las oficinas
router.get('/cliente/:clienteId', async (req, res) => {
    try {
        const clienteId = new mongoose.Types.ObjectId(req.params.clienteId); // Convertimos a ObjectId

        // Buscar los envíos del cliente, sin importar la oficina
        const envios = await Envio.find({ cliente: clienteId })
            .populate('origen')  // Obtener la oficina de origen
            .populate('destino') // Obtener la oficina de destino
            .populate('tipo_envio') // Obtener el tipo de envío
            .populate('cliente');  // Obtener el cliente (esto es redundante pero útil si necesitas datos completos)

        if (envios.length > 0) {
            res.json(envios);  // Si encontramos envíos, los devolvemos
        } else {
            res.status(404).json({ message: 'No se encontraron envíos para este cliente.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

/*
// Listar clientes que han realizado envíos en una oficina específica
router.get('/clientes/oficina/:oficinaId', async (req, res) => {
    try {
      const oficinaId = req.params.oficinaId;
      const envios = await Envio.find({ 'origen._id': oficinaId }).populate('clientes');
      const clientes = envios.map(envio => envio.cliente);
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
*/

// Ruta para listar los clientes que han realizado envíos en una determinada oficina
router.get('/oficina/:oficinaId/clientes', async (req, res) => {
    try {
        const oficinaId = new mongoose.Types.ObjectId(req.params.oficinaId); // Convertimos a ObjectId

        // Buscar los envíos que tienen esa oficina como origen o destino
        const envios = await Envio.find({
            $or: [
                { origen: oficinaId },  // Oficina de origen
                { destino: oficinaId }   // Oficina de destino
            ]
        })
        .populate('cliente')  // Obtener el cliente del envío
        .populate('origen')   // Obtener la oficina de origen
        .populate('destino'); // Obtener la oficina de destino

        // Extraer los clientes únicos de los envíos encontrados
        const clientes = envios.map(envio => envio.cliente);

        if (clientes.length > 0) {
            // Devolver una lista de clientes únicos (sin duplicados)
            const uniqueClientes = Array.from(new Set(clientes.map(c => c._id))).map(id => {
                return clientes.find(cliente => cliente._id.toString() === id.toString());
            });

            res.json(uniqueClientes);  // Retornar los clientes únicos que realizaron envíos en esa oficina
        } else {
            res.status(404).json({ message: 'No se encontraron clientes para esta oficina.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Listar envíos con estatus "entregado"
router.get('/estatus/entregado', async (req, res) => {
    try {
      const envios = await Envio.find({ estatus: 'entregado' });
      res.json(envios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // Ruta para listar los clientes y sus envíos que se han remitido por el servicio terrestre
router.get('/terrestre/clientes', async (req, res) => {
    try {
        // Buscar los envíos que tienen el tipo de envío "terrestre"
        const envios = await Envio.find({ tipo_envio: 'terrestre' })
            .populate('cliente')  // Obtener el cliente del envío
            .populate('tipo_envio') // Obtener el tipo de envío
            .populate('origen')   // Obtener la oficina de origen
            .populate('destino'); // Obtener la oficina de destino

        if (envios.length > 0) {
            // Crear un array de clientes y sus envíos
            const clientes = envios.map(envio => ({
                cliente: envio.cliente,
                envio: envio
            }));

            res.json(clientes);  // Retornar los clientes y sus envíos
        } else {
            res.status(404).json({ message: 'No se encontraron envíos terrestres.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


// Q8. Listar los clientes y sus envíos remitidos por el servicio 'express' considerando una oficina específica
router.get('/Express/clientes/:oficinaId', async (req, res) => {
    const oficinaId = req.params.oficinaId; // Obtener el ID de la oficina desde los parámetros de la URL

    // Convertir el oficinaId a un ObjectId
    if (!mongoose.Types.ObjectId.isValid(oficinaId)) {
        return res.status(400).json({ message: 'ID de oficina inválido.' });
    }

    try {
        // 1. Buscar el ObjectId del tipo de envío 'express'
        const tipoEnvioExpress = await TipoEnvio.findOne({ descripcion: 'Express' });

        if (!tipoEnvioExpress) {
            return res.status(404).json({ message: 'Tipo de envío express no encontrado.' });
        }

        // 2. Buscar los envíos de tipo 'express' para una oficina específica
        const enviosExpress = await Envio.find({
            tipo_envio: tipoEnvioExpress._id, // Usar el ObjectId de 'express'
            origen: new mongoose.Types.ObjectId(oficinaId)  // Convertir el ID de oficina a ObjectId
        })
        .populate('cliente')  // Poblar los datos del cliente
        .populate('tipo_envio')  // Poblar los datos del tipo de envío
        .populate('origen')  // Poblar la oficina de origen
        .populate('destino');  // Poblar la oficina de destino

        // 3. Verificar si se encontraron envíos y formatear la respuesta
        if (enviosExpress.length > 0) {
            const clientesEnvios = enviosExpress.map(envio => ({
                cliente: envio.cliente,  // Información del cliente
                envio: envio  // Información del envío
            }));

            res.json(clientesEnvios);  // Enviar los resultados
        } else {
            res.status(404).json({ message: 'No se encontraron envíos express para esta oficina.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al procesar la consulta', error: error.message });
    }
});



  /*
// Listar clientes y sus envíos remitidos por servicio terrestre
router.get('/clientes/envios/terrestre', async (req, res) => {
    try {
      const enviosTerrestres = await Envio.find({
        'tipo_envio.descripcion': 'terrestre'
      }).populate('cliente');
  
      const clientes = enviosTerrestres.map(envio => ({
        cliente: envio.cliente,
        envio: envio
      }));
  
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
*/
/*
// Listar clientes y sus envíos remitidos por servicio express en una oficina específica
router.get('/clientes/envios/express/oficina/:oficinaId', async (req, res) => {
    try {
      const oficinaId = req.params.oficinaId;
      const enviosExpress = await Envio.find({
        'tipo_envio.descripcion': 'express',
        'origen._id': oficinaId
      }).populate('cliente');
  
      const clientes = enviosExpress.map(envio => ({
        cliente: envio.cliente,
        envio: envio
      }));
  
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  */


/*

//q07
router.get('/envios/clientes/envios/terrestre', async (req, res) => {
    try {
        const envios = await Envio.find({ tipo_envio: "terrestre" });
        const clientes = envios.map(envio => ({ cliente: envio.cliente, envio }));
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
*/
module.exports = router;