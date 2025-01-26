import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import EmpleadosModel from '../models/EmpleadosModel.js';

dotenv.config();

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const empleado = await EmpleadosModel.findOne({ _id: decoded.id, 'tokens.token': token });

        if (!empleado) {
            throw new Error("Usuario no autenticado, por favor inicie sesión");
        }

        if (!empleado.estado) {
            throw new Error("Usuario inactivo, por favor contacte a un administrador para más información");
        }

        req.token = token;
        req.empleado = empleado;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Error en la autenticacion', error: error.message });
    }
};

export default auth;