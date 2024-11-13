import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import EmpleadosRoutes from './routers/EmpleadosRoutes.js';
import AsistenciasRoutes from './routers/AsistenciasRoutes.js';
import PagosRoutes from './routers/PagosRoutes.js';
import ClientesRoutes from './routers/ClientesRoutes.js';
import VehiculosRoutes from './routers/VehiculosRoutes.js';
import MantenimientosRoutes from './routers/MantenimientosRoutes.js';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Full Prestige - API',
            version: '1.0.0',
            description: 'API para la gestión de un taller automotriz',
            contact: {
                name: 'Marcelo Pinzón',
                email: 'marcelo.pinzon@epn.edu.ec',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1',
            },
        ],
    },
    apis: ['./src/routers/*.js'],
};

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(morgan('dev'));

// Ruta principal
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Uso de rutas
app.use('/api/v1', EmpleadosRoutes);
app.use('/api/v1', AsistenciasRoutes);
app.use('/api/v1', PagosRoutes);
app.use('/api/v1', ClientesRoutes);
app.use('/api/v1', VehiculosRoutes);
app.use('/api/v1', MantenimientosRoutes);

// Ruta para la documentación
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

export default app;