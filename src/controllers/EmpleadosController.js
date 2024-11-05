import EmpleadosModel from '../models/EmpleadosModel.js';
import generarJWT from '../helpers/JWT.js';
import bcrypt from 'bcrypt';

import { sendMailToRecoveryPassword } from '../config/nodeMailer.js';

// Controlador para el inicio de sesion de los empleados
export const login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        if(Object.values(req.body).includes('')) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const empleado = await EmpleadosModel.findOne({ correo });
        if (!empleado) {
            return res.status(404).json({ message: 'El correo ingresado es incorrecto' });
        }

        const validPassword = bcrypt.compareSync(contrasena, empleado.contrasena);
        if (!validPassword) {
            return res.status(404).json({ message: 'La contraseña ingresada es incorrecta' });
        }

        if (!empleado.estado) {
            return res.status(404).json({ message: 'El empleado se encuentra inactivo' });
        }

        const {
            _id,
            cedula,
            edad,
            nombre,
            cargo,
            direccion,
            correo: email,
        } = empleado

        const token = generarJWT(_id, cargo);

        return res.status(200).json({ message: 'Inicio de sesión exitoso', empleado: { _id, cedula, edad, nombre, cargo, email, direccion, token }});
    } catch (error) {
        return res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};

// Controlador para el registro de los empleados
export const register = async (req, res) => {
    const { cedula, edad, nombre, contrasena, cargo, correo, direccion } = req.body;

    try {
        if(Object.values(req.body).includes('')) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const cedulaFound = await EmpleadosModel.findOne({ cedula });
        if (cedulaFound) {
            return res.status(404).json({ message: 'La cédula ya se encuentra registrada' });
        }

        const emailFound = await EmpleadosModel.findOne({ correo });
        if (emailFound) {
            return res.status(404).json({ message: 'El correo ya se encuentra registrado' });
        }

        const empleado = new EmpleadosModel(req.body);
        const salt = bcrypt.genSaltSync(10);
        empleado.contrasena = bcrypt.hashSync(contrasena, salt);

        await empleado.save();

        return res.status(201).json({ message: 'Empleado registrado exitosamente', empleado });
    } catch (error) {
        return res.status(500).json({ message: 'Error al registrar empleado', error: error.message });
    }
};

// Metodo para recuperar la contraseña de un empleado
export const recoverPassword = async (req, res) => {
    const { correo } = req.body;

    try {
        if(Object.values(req.body).includes('')) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const empleado = await EmpleadosModel.findOne({ correo });
        if (!empleado) {
            return res.status(404).json({ message: 'Correo no encontrado' });
        }

        if (!empleado.estado) {
            return res.status(404).json({ message: 'El empleado se encuentra inactivo' });
        }

        if (empleado.token) {
            return res.status(404).json({ message: 'Ya se ha enviado un correo para recuperar la contraseña' });
        }

        const token = Math.random().toString(36).slice(2);
        empleado.token = token;
        await sendMailToRecoveryPassword(correo, token);
        await empleado.save();

        res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al recuperar contraseña', error: error.message });
    }
};

// Metodo para verificar el token de recuperacion de contraseña
export const verifyToken = async (req, res) => {
    const { token } = req.params;

    try {
        if (!token) return res.status(400).json({ message: 'Token no encontrado' });
        const empleado = await EmpleadosModel.findOne({ token });
        if (!empleado) {
            return res.status(404).json({ message: 'Token no encontrado' });
        }

        return res.status(200).json({ message: 'Token confirmado' });
    } catch (error){
        return res.status(500).json({ message: 'Error al verificar token', error: error.message });
    }
};

// Metodo para cambiar la contraseña de un empleado
export const changePassword = async (req, res) => {
    const { token } = req.params;
    const { contrasena, confirmarContrasena } = req.body;

    try {
        if (Object.values(req.body).includes('')) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const empleado = await EmpleadosModel.findOne({ token });
        if (!empleado) {
            return res.status(404).json({ message: 'Token no encontrado' });
        }

        if (!contrasena || !confirmarContrasena) return res.status(400).json({ message: 'La contraseña es requerida' });

        if (contrasena !== confirmarContrasena) return res.status(400).json({ message: 'Las contraseñas no coinciden' });

        // Verificar si la contraeña no es igual a la que tiene actualmente (hasheada)
        const validPassword = bcrypt.compareSync(contrasena, empleado.contrasena);
        if (validPassword) return res.status(400).json({ message: 'La contraseña no puede ser igual a la actual' });

        const salt = bcrypt.genSaltSync(10);
        empleado.contrasena = bcrypt.hashSync(contrasena, salt);
        empleado.token = null;
        await empleado.save();

        return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error){
        return res.status(500).json({ message: 'Error al cambiar contraseña', error: error.message });
    }
};

// Metodo para obtener la info del perfil de un empleado
export const getProfile = async (req, res) => {
    const { 
        _id,
        cedula,
        edad,
        nombre,
        cargo,
        direccion,
        correo
     } = req.empleado;

    try {
        return res.status(200).json({ message: 'Información del empleado', empleado: { _id, cedula, edad, nombre, cargo, direccion, correo } });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener información del empleado', error: error.message });
    }
};