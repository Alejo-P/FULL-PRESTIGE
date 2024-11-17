import mantenimientoModel from "../models/MantenimientoModel.js";
import vehiculosModel from "../models/VehiculosModel.js";

// Metodo para registrar un mantenimiento
export const registerMaintenance = async (req, res) => {
    try {
        const {
            placa,
            descripcion,
            costo
        } = req.body;

        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Todos los campos son necesarios" });
        }

        const vehicle = await vehiculosModel.findOne({ placa });
        if (!vehicle) {
            return res.status(404).json({ message: "El vehículo no existe" });
        }

        const newMaintenance = new mantenimientoModel({ vehiculo: vehicle._id, descripcion, costo });
        await newMaintenance.save();

        res.status(201).json({ message: "Mantenimiento registrado correctamente" });
    } catch (error) {
        res.status(500).json({ message:"Error al registrar detalles del mantenimiento", error: error.message });
    }
};

// Metodo para obtener todos los mantenimientos
export const getMaintenances = async (req, res) => {
    try {
        const mantenimientos = await mantenimientoModel.find().populate({
            path: 'vehiculo',
            populate: [
                { path: 'propietario', select: 'cedula nombre telefono correo' },
                { path: 'encargado', select: 'cedula nombre telefono correo' }
            ],
            select: 'placa marca modelo propietario fecha_ingreso fecha_salida encargado detalles'
        });
        res.status(200).json(mantenimientos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los mantenimientos", error: error.message });
    }
};

// Metodo para obtener todos los mantenimientos de un vehiculo
export const getMaintenancesByVehicle = async (req, res) => {
    const { placa } = req.params;
    try {
        const vehicle = await vehiculosModel.findOne({ placa });
        if (!vehicle) {
            return res.status(404).json({ message: "El vehículo no existe" });
        }

        const mantenimientos = await mantenimientoModel.find({ vehiculo: vehicle._id }).populate('vehiculo', 'placa marca modelo propietario fecha_ingreso fecha_salida encargado detalles');
        res.status(200).json(mantenimientos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los mantenimientos", error: error.message });
    }
};

// Metodo para obtener un mantenimiento
export const getMaintenance = async (req, res) => {
    const { id } = req.params;
    try {
        const mantenimiento = await mantenimientoModel.findById(id).populate('vehiculo', 'placa marca modelo propietario fecha_ingreso fecha_salida encargado detalles');
        if (!mantenimiento) {
            return res.status(404).json({ message: "Mantenimiento no encontrado" });
        }
        res.status(200).json(mantenimiento);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el mantenimiento", error: error.message });
    }
};

// Metodo para actualizar un mantenimiento
export const updateMaintenance = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Todos los campos son necesarios" });
        }

        const mantenimiento = await mantenimientoModel.findById(id);
        if (!mantenimiento) {
            return res.status(404).json({ message: "Mantenimiento no encontrado" });
        }

        await mantenimientoModel.findByIdAndUpdate(id, req.body);
        res.status(200).json({ message: "Mantenimiento actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el mantenimiento", error: error.message });
    }
};

// Metodo para eliminar un mantenimiento
export const deleteMaintenance = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }

        const mantenimiento = await mantenimientoModel.findById(id);
        if (!mantenimiento) {
            return res.status(404).json({ message: "Mantenimiento no encontrado" });
        }

        await mantenimientoModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Mantenimiento eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el mantenimiento", error: error.message });
    }
};