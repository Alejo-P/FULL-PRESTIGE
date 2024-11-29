import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

import EmpleadosRoutes from './routers/EmpleadosRoutes.js';
import AsistenciasRoutes from './routers/AsistenciasRoutes.js';
import PagosRoutes from './routers/PagosRoutes.js';
import ClientesRoutes from './routers/ClientesRoutes.js';
import VehiculosRoutes from './routers/VehiculosRoutes.js';
import MantenimientosRoutes from './routers/MantenimientosRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(morgan('dev'));

// Ruta principal
app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

// Uso de rutas
app.use('/api/v1', EmpleadosRoutes);
app.use('/api/v1', AsistenciasRoutes);
app.use('/api/v1', PagosRoutes);
app.use('/api/v1', ClientesRoutes);
app.use('/api/v1', VehiculosRoutes);
app.use('/api/v1', MantenimientosRoutes);

// Documentación de la API
const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve('./API-Documentation.json'), 'utf8')
);

// Ruta para la documentación de Swagger UI
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

export default app;