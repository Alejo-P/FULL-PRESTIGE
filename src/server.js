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

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Empleados',
            version: '1.0.0',
            description: 'API para la gestión de empleados de una empresa',
            contact: {
                name: 'Equipo 4',
                email: 'emali1.com',
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

// Ruta para la documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

export default app;