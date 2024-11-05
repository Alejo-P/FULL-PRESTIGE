import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import EmpleadosRoutes from './routers/EmpleadosRoutes.js';
import AsistenciasRoutes from './routers/AsistenciasRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Uso de rutas
app.use('/api/v1', EmpleadosRoutes);
app.use('/api/v1', AsistenciasRoutes);

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

export default app;