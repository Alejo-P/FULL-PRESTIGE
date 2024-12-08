import vehiculosModel from '../models/VehiculosModel.js';
import clientesModel from '../models/ClientesModel.js';
import empleadosModel from '../models/EmpleadosModel.js';
import mantenimientosModel from '../models/MantenimientoModel.js';

import { sendMailToTechnician } from '../config/nodeMailer.js';

// Metodo para registrar un vehiculo
export const registerVehicle = async (req, res) => {
    try {
        const {
            n_orden,
            placa,
            marca,
            modelo,
            fecha_ingreso,
            fecha_salida,
            cedula_cliente
        } = req.body;
        
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Todos los campos son necesarios" });
        }

        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }
        
        const vehicle = await vehiculosModel.findOne({ placa });
        if (vehicle) {
            return res.status(400).json({ message: "La placa ya esta registrada" });
        }
        
        const cliente = await clientesModel.findOne({ cedula: cedula_cliente });
        if (!cliente) {
            return res.status(404).json({ message: "El cliente no existe" });
        }

        const data = {
            n_orden,
            placa,
            marca,
            modelo,
            fecha_ingreso,
            fecha_salida,
            propietario: cliente._id
        };

        const newVehicle = new vehiculosModel(data);
        await newVehicle.save();

        return res.status(201).json({ message: "Vehículo registrado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error al registrar el vehículo", error: error.message });
    }
};

// Metodo para asignar un vehiculo a un técnico
export const assignVehicle = async (req, res) => {
    const { placa, cedula_tecnico } = req.body;
    try {
        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }

        if (!placa) {
            return res.status(400).json({ message: "La placa es necesaria" });
        }

        if (!cedula_tecnico) {
            return res.status(400).json({ message: "La cedula del técnico es necesaria" });
        }

        const vehicle = await vehiculosModel.findOne({ placa }).populate('propietario encargado', 'nombre cedula telefono correo direccion');
        if (!vehicle) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }

        const tecnico = await empleadosModel.findOne({ cedula: cedula_tecnico });
        if (!tecnico || tecnico.cargo !== 'Técnico') {
            return res.status(404).json({ message: "El técnico no existe o no es un técnico" });
        }

        await vehiculosModel.findByIdAndUpdate(vehicle._id, { encargado: tecnico._id });

        const payload = {
            cliente: vehicle.propietario.nombre,
            fecha_ingreso: new Date(vehicle.fecha_ingreso).toLocaleDateString(),
            placa: vehicle.placa,
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            tecnico: tecnico.nombre
        }

        const newMaintenance = new mantenimientosModel({ vehiculo: vehicle._id, encargado: tecnico._id });
        await newMaintenance.save();

        await sendMailToTechnician(tecnico.correo, payload);
        return res.status(200).json({ message: "Vehículo asignado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error al asignar el vehículo", error: error.message });
    }
};

// Metodo para obtener todos los vehiculos
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await vehiculosModel.find().populate('propietario encargado', 'nombre cedula telefono correo direccion');
        return res.status(200).json(vehicles);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener los vehículos", error: error.message });
    }
};

// Metodo para obtener un vehiculo por placa
export const getVehicle = async (req, res) => {
    const { placa } = req.params;
    try {
        if (!placa) {
            return res.status(400).json({ message: "La placa es necesaria" });
        }

        const vehicle = await vehiculosModel.findOne({ placa }).populate('propietario encargado', 'nombre cedula telefono correo direccion');
        if (!vehicle) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }

        return res.status(200).json(vehicle);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener el vehículo", error: error.message });
    }
};

// Metodo para obtener los vehiculos de un cliente
export const getVehiclesByClient = async (req, res) => {
    const { cedula } = req.params;
    try {
        if (!cedula) {
            return res.status(400).json({ message: "La cedula es necesaria" });
        }

        const cliente = await clientesModel.findOne({ cedula });
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        const vehicles = await vehiculosModel.find({ propietario: cliente._id }).populate('propietario encargado', 'nombre cedula telefono correo direccion');
        return res.status(200).json(vehicles);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener los vehículos", error: error.message });
    }
};

// Metodo para obtener los vehiculos asignados a un técnico
export const getVehiclesByEmployee = async (req, res) => {
    const { cedula } = req.params;
    try {
        if (!cedula) {
            return res.status(400).json({ message: "La cedula es necesaria" });
        }

        const tecnico = await empleadosModel.findOne({ cedula });
        if (!tecnico) {
            return res.status(404).json({ message: "Técnico no encontrado" });
        }

        const vehicles = await vehiculosModel.find({ encargado: tecnico._id }).populate('propietario', 'nombre cedula telefono correo direccion');
        return res.status(200).json(vehicles);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener los vehículos", error: error.message });
    }
};

// Metodo para actualizar un vehiculo
export const updateVehicle = async (req, res) => {
    const { placa } = req.params;
    const { cedula_cliente } = req.body;
    try {
        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Todos los campos son necesarios" });
        }

        if (!placa) {
            return res.status(400).json({ message: "La placa es necesaria" });
        }

        if (!cedula_cliente) {
            return res.status(400).json({ message: "La cedula del cliente es necesaria" });
        }

        const vehicle = await vehiculosModel.findOne({ placa });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }

        const cliente = await clientesModel.findOne({ cedula: cedula_cliente });
        if (!cliente) {
            return res.status(404).json({ message: "El cliente no existe" });
        }

        req.body.propietario = cliente._id;
        delete req.body.cedula_cliente;

        await vehiculosModel.findByIdAndUpdate(vehicle._id, req.body);

        return res.status(200).json({ message: "Vehículo actualizado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar el vehículo", error: error.message });
    }
};