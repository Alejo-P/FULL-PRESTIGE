import clientesModel from '../models/ClientesModel.js';
import empleadosModel from '../models/EmpleadosModel.js';
import vehiculosModel from '../models/VehiculosModel.js';

// Metodo para registrar un cliente
export const registerClient = async (req, res) => {
    try {
        const {
            cedula,
            nombre,
            correo,
            telefono,
            direccion,
        } = req.body;

        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Todos los campos son necesarios" });
        }

        const cliente = await clientesModel.findOne({ cedula });
        if (cliente) {
            return res.status(400).json({ message: "El cliente ya esta registrado" });
        }

        const newCliente = new clientesModel({ cedula, nombre, correo, telefono, direccion });
        await newCliente.save();

        res.status(201).json({ message: "Cliente registrado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar al cliente", error:error.message });
    }
};

// Metodo para obtener todos los clientes
export const getClients = async (req, res) => {
    try {
        const clientes = await clientesModel.find();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los clientes", error:error.message });
    }
};

// Metodo para obtener un cliente por cédula
export const getClient = async (req, res) => {
    const { cedula } = req.params;
    try {
        if (!cedula) {
            return res.status(400).json({ message: "La cédula es necesaria" });
        }

        const cliente = await clientesModel.findOne({ cedula });
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        res.status(200).json([cliente]);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el cliente", error:error.message });
    }
};

// Metodo para actualizar un cliente
export const updateClient = async (req, res) => {
    const { cedula } = req.params;
    try {
        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Todos los campos son necesarios" });
        }

        if (!cedula) {
            return res.status(400).json({ message: "La cédula es necesaria" });
        }

        const cliente = await clientesModel.findOne({ cedula });
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        await clientesModel.findByIdAndUpdate(cliente._id, req.body);

        res.status(200).json({ message: "Cliente actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el cliente", error:error.message });
    }
};

// Metodo para eliminar un cliente
export const removeClient = async (req, res) => {
    const { cedula } = req.params;
    try {
        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }

        if (!cedula) {
            return res.status(400).json({ message: "La cédula es necesaria" });
        }

        const cliente = await clientesModel.findOne({ cedula });
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        await clientesModel.findByIdAndDelete(cliente._id);

        res.status(200).json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el cliente", error:error.message });
    }
};