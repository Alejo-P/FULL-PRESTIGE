import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import EmpleadosModel from '../models/EmpleadosModel.js';

dotenv.config();

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const empleado = await EmpleadosModel.findOne({ _id: decoded.id, 'tokens.token': token });

        if (!empleado) {
            throw new Error();
        }

        req.token = token;
        req.empleado = empleado;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Por favor autentíquese' });
    }
};

export default auth;