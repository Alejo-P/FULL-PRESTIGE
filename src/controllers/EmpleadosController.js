import empleadosModel from '../models/EmpleadosModel.js';
import generarJWT from '../helpers/JWT.js';
import bcrypt from 'bcrypt';
import { UAParser } from 'ua-parser-js';

import { sendMailToRecoveryPassword, sendMailToUser } from '../config/nodeMailer.js';

// Controlador para el inicio de sesion de los empleados
export const login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        if(Object.values(req.body).includes('')) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const empleado = await empleadosModel.findOne({ correo });
        if (!empleado) {
            return res.status(404).json({ message: 'El correo ingresado es incorrecto' });
        }

        const validPassword = bcrypt.compareSync(contrasena, empleado.contrasena);
        if (!validPassword) {
            return res.status(404).json({ message: 'La contraseña ingresada es incorrecta' });
        }

        if (!empleado.estado) {
            return res.status(401).json({ message: 'El empleado se encuentra inactivo' });
        }

        const {
            _id,
            cedula,
            nombre,
            cargo,
            direccion,
            correo: email,
            telefono
        } = empleado

        const token = generarJWT(_id, cargo);
        const parser = new UAParser(req.header('User-Agent'));
		const dispositivo = `${parser.getOS().name} ${parser.getOS().version} - ${parser.getBrowser().name} ${parser.getBrowser().version}`;
        empleado.tokens.push({ token, dispositivo });
        await empleado.save();

        return res.status(200).json({ message: 'Inicio de sesión exitoso', empleado: { _id, cedula, nombre, cargo, correo: email, direccion, telefono, token }});
    } catch (error) {
        return res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};

// Controlador para cerrar la sesion de un empleado
export const logout = async (req, res) => {
    try {
        req.empleado.tokens = req.empleado.tokens.filter(t => t.token !== req.token);
        await req.empleado.save();
        res.status(200).json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cerrar sesión', error: error.message });
    }
};

// Controlador para la vista de las sesiones activas de un empleado
export const getSessions = async (req, res) => {
    try {
        const { tokens } = req.empleado;
        const listaSesiones = tokens.map((sesion) => {
            return {
                _id: sesion._id,
                token: sesion.token,
                dispositivo: sesion.dispositivo,
                fecha: sesion.createdAt
            }
        });

        return res.status(200).json({ message: 'Sesiones activas', sesiones: listaSesiones });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener sesiones', error: error.message });
    }
};

// Controlador para el cierre de una sesion especifica de un empleado
export const logoutSpecific = async (req, res) => {
    const { id } = req.params;

    try {
        const tokenFound = req.empleado.tokens.find(t => t._id.toString() === id);
        if (!tokenFound) {
            return res.status(404).json({ message: 'Sesión no encontrada' });
        }

        req.empleado.tokens = req.empleado.tokens.filter(t => t._id.toString() !== id);
        await req.empleado.save();
        res.status(200).json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cerrar sesión', error: error.message });
    }
};

// Controlador para el cierre de sesion de un empleado en todos los dispositivos
export const logoutAll = async (req, res) => {
    try {
        req.empleado.tokens = [];
        await req.empleado.save();
        res.status(200).json({ message: 'Sesiones cerradas en todos los dispositivos' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cerrar todas las sesiones', error: error.message });
    }
};

// Controlador para el registro de los empleados
export const register = async (req, res) => {
    const { cedula, contrasena, correo } = req.body;

    try {

        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: 'No tiene permisos para realizar esta acción' });
        }

        if(Object.values(req.body).includes('')) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const cedulaFound = await empleadosModel.findOne({ cedula });
        if (cedulaFound) {
            return res.status(404).json({ message: `La cédula ${cedula} ya se encuentra registrada` });
        }

        const emailFound = await empleadosModel.findOne({ correo });
        if (emailFound) {
            return res.status(404).json({ message: `El correo ${correo} ya se encuentra registrado` });
        }

        const empleado = new empleadosModel(req.body);
        const salt = bcrypt.genSaltSync(10);
        empleado.contrasena = bcrypt.hashSync(contrasena, salt);

        await empleado.save();
        if (process.env.NODE_ENV !== 'test') await sendMailToUser(correo, {correo, cargo: req.body.cargo, contrasena});

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

        const empleado = await empleadosModel.findOne({ correo });
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

        return res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al recuperar contraseña', error: error.message });
    }
};

// Metodo para verificar el token de recuperacion de contraseña
export const verifyToken = async (req, res) => {
    const { token } = req.params;

    try {
        if (!token) return res.status(400).json({ message: 'Token no encontrado' });
        const empleado = await empleadosModel.findOne({ token });
        if (!empleado) {
            return res.status(400).json({ message: 'Token no encontrado' });
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

        const empleado = await empleadosModel.findOne({ token });
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
        nombre,
        cargo,
        direccion,
        correo,
        telefono
     } = req.empleado;

    try {
        return res.status(200).json({ message: 'Información del empleado', empleado: { _id, cedula, nombre, cargo, direccion, correo, telefono } });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener información del empleado', error: error.message });
    }
};

// Metodo para obtener la info de un empleado por el administrador
export const getEmployee = async (req, res) => {
    const { cedula } = req.params;

    try {
        const empleado = await empleadosModel.findOne({ cedula });
        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        const {
            _id,
            cedula: ced,
            nombre,
            cargo,
            direccion,
            correo,
            telefono,
            estado
        } = empleado;

        return res.status(200).json([{ _id, cedula: ced, nombre, cargo, direccion, correo, telefono, estado: estado ? "Activo" : "Inactivo" }]);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener información del empleado', error: error.message });
    }
};

// Metodo para actualizar la info del perfil de un empleado
export const updateProfile = async (req, res) => {
    const { _id } = req.empleado;
    try {
        const {
            nombre,
            direccion,
            correo,
            telefono
        } = req.body;

        if(Object.values(req.body).includes('')) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const empleado = await empleadosModel.findById(_id);
        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        if (correo !== empleado.correo) {
            const mailFound = await empleadosModel.findOne({ correo });
            if (mailFound) {
                return res.status(400).json({ message: 'El correo ya se encuentra registrado' });
            }
        }

        if (req.body?.cargo && req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: 'No tiene permisos para realizar esta acción' });
        }

        if (req.body?.cargo && (req.body?.cargo !== req.empleado.cargo)) {
            return res.status(403).json({ message: 'No puedes cambiar tu cargo' });
        }

        // Verificar si se cambio el estado del empleado logueado
        if (req.body?.estado && (req.body?.estado !== req.empleado.estado)) {
            return res.status(403).json({ message: 'No puedes cambiar tu estado' });
        }

        empleado.nombre = nombre;
        empleado.direccion = direccion;
        empleado.correo = correo;
        empleado.telefono = telefono;
        await empleado.save();

        const {
            cedula: ced,
            nombre: nom,
            correo: cor,
            cargo: car,
            telefono: tel,
            direccion: dir,
            estado: est
        } = empleado;

        return res.status(200).json({ message: 'Perfil actualizado exitosamente', empleado: { 
            cedula: ced, nombre: nom, correo: cor, cargo: car, telefono: tel, direccion: dir, estado: est ? "Activo" : "Inactivo"
        }});
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
    }
};

// Metodo para actualizar la info de un empleado por el administrador
export const updateEmployee = async (req, res) => {
    const { cedula } = req.params;
    const {
        nombre,
        direccion,
        cargo,
        correo,
        telefono,
        estado
    } = req.body;

    try {
        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: 'No tiene permisos para realizar esta acción' });
        }

        if(Object.values(req.body).includes('')) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const empleado = await empleadosModel.findOne({ cedula });
        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }
        
        if (correo !== empleado.correo) {
            const mailFound = await empleadosModel.findOne({ correo });
            if (mailFound) {
                return res.status(400).json({ message: 'El correo ya se encuentra registrado' });
            }
        }

        if (empleado.cedula === req.empleado.cedula) {
            return res.status(404).json({ message: 'No puedes actualizar tu propio perfil' });
        }

        empleado.nombre = nombre;
        empleado.direccion = direccion;
        empleado.cargo = cargo;
        empleado.correo = correo;
        empleado.telefono = telefono;
        empleado.estado = estado;
        await empleado.save();

        const {
            cedula: ced,
            nombre: nom,
            correo: cor,
            cargo: car,
            telefono: tel,
            direccion: dir,
            estado: est
        } = empleado;

        return res.status(200).json({ message: 'Empleado actualizado exitosamente', empleado: { cedula: ced, nombre: nom, correo: cor, cargo: car, telefono: tel, direccion: dir, estado: est ? "Activo" : "Inactivo" }});
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar empleado', error: error.message });
    }
};

// Metodo para desactivar al empleado con sesion activa
export const deactivateProfile = async (req, res) => {
    const { _id } = req.empleado;

    try {
        const empleado = await empleadosModel.findById(_id);
        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        if (!empleado.estado) {
            return res.status(404).json({ message: 'El empleado ya se encuentra inactivo' });
        }

        empleado.estado = false;
        await empleado.save();

        return res.status(200).json({ message: 'Empleado desactivado exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al desactivar empleado', error: error.message });
    }
};

// Metodo para desactivar a un empleado por el administrador
export const deactivateEmployee = async (req, res) => {
    const { cedula } = req.params;
    try {
        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: 'No tiene permisos para realizar esta acción' });
        }

        const empleado = await empleadosModel.findOne({ cedula });
        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        if (empleado.cedula === req.empleado.cedula) {
            return res.status(404).json({ message: 'No puedes desactivar tu propio perfil' });
        }

        if (!empleado.estado) {
            return res.status(404).json({ message: 'El empleado ya se encuentra inactivo' });
        }

        if (!empleado.estado) {
            return res.status(404).json({ message: 'El empleado ya se encuentra inactivo' });
        }

        empleado.estado = false;
        await empleado.save();

        return res.status(200).json({ message: 'Empleado desactivado exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al desactivar empleado', error: error.message });
    }
}

// Metodo para actualizar la contraseña de un empleado
export const updatePassword = async (req, res) => {
    const { _id } = req.empleado;
    const { contrasena, nuevaContrasena, confirmarContrasena } = req.body;

    try {
        if (Object.values(req.body).includes('')) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const empleado = await empleadosModel.findById(_id);
        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        const validPassword = bcrypt.compareSync(contrasena, empleado.contrasena);
        if (!validPassword) {
            //return res.status(404).json({ message: 'Contraseña actual incorrecta' });
            return res.status(404).json({ message: `Contraseña actual incorrecta ${contrasena}` });
        }

        if (nuevaContrasena !== confirmarContrasena) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }

        if (nuevaContrasena === contrasena) {
            return res.status(400).json({ message: 'La nueva contraseña no puede ser igual a la actual' });
        }

        const salt = bcrypt.genSaltSync(10);
        empleado.contrasena = bcrypt.hashSync(nuevaContrasena, salt);
        await empleado.save();

        return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error){
        return res.status(500).json({ message: 'Error al cambiar contraseña', error: error.message });
    }
};

// Metodo para obtener todos los empleados
export const getEmployees = async (req, res) => {
    try {
        const empleados = await empleadosModel.find();
        if (!empleados) {
            return res.status(404).json({ message: 'No hay empleados registrados' });
        }

        const lista = empleados.filter(empleado => empleado.cedula !== req.empleado.cedula);

        const listaEmpleados = lista.map((empleado)=>{
            return {
                _id: empleado._id,
                cedula: empleado.cedula,
                nombre: empleado.nombre,
                cargo: empleado.cargo,
                direccion: empleado.direccion,
                correo: empleado.correo,
                telefono: empleado.telefono,
                estado: empleado.estado ? "Activo" : "Inactivo"
            }
        })

        return res.status(200).json({ message: 'Empleados encontrados', empleados: listaEmpleados });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener empleados', error: error.message });
    }
};
