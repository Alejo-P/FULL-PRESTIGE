import mantenimientoModel from "../models/MantenimientoModel.js";
import vehiculosModel from "../models/VehiculosModel.js";
import empleadosModel from "../models/EmpleadosModel.js";

// Metodo para registrar un mantenimiento
export const registerMaintenance = async (req, res) => {
    try {
        const {
            placa,
            descripcion,
            costo,
            cedula_encargado
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

        const maintenance = await mantenimientoModel.find({ vehiculo: vehicle._id }).populate([{
            path: 'encargado',
            select: 'cedula nombre telefono correo'
        },{
            path: 'vehiculo',
            populate: [
                { path: 'propietario', select: 'cedula nombre telefono correo' }
            ],
            select: 'placa marca modelo propietario fecha_ingreso fecha_salida detalles'
        }]);
        let maintenanceFound = false;
        if (maintenance.length > 0) {
            maintenance.forEach(maintenance => {
                if (maintenance.descripcion === descripcion) {
                    maintenanceFound = true;
                }
            });
        }

        if (maintenanceFound) {
            return res.status(400).json({ message: "El mantenimiento ya ha sido registrado" });
        }

        const encargado = await empleadosModel.findOne({ cedula: cedula_encargado });
        if (!encargado) {
            return res.status(404).json({ message: "El encargado no existe" });
        }

        if (encargado.cargo !== 'Técnico') {
            return res.status(400).json({ message: "El encargado debe ser un técnico" });
        }

        if (!encargado.estado) {
            return res.status(400).json({ message: "El encargado seleccionado esta inactivo" });
        }

        if (encargado === maintenance?.encargado?.cedula) {
            return res.status(400).json({ message: "El encargado no puede ser el mismo que el encargado del vehículo" });
        }

        const newMaintenance = new mantenimientoModel({ vehiculo: vehicle._id, descripcion, costo, encargado: encargado._id });
        await newMaintenance.save();

        res.status(201).json({ message: "Mantenimiento registrado correctamente" });
    } catch (error) {
        res.status(500).json({ message:"Error al registrar detalles del mantenimiento", error: error.message });
    }
};

// Metodo para obtener todos los mantenimientos
export const getMaintenances = async (req, res) => {
    try {
        const mantenimientos = await mantenimientoModel.find().populate([
            {
                path: 'vehiculo',
                populate: [
                    { path: 'propietario', select: 'cedula nombre telefono correo' },
                ],
                select: 'placa marca modelo propietario fecha_ingreso fecha_salida detalles'
            },{
                path: 'encargado',
                select: 'cedula nombre telefono correo'
            }
        ]);
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

        const mantenimientos = await mantenimientoModel.find({ vehiculo: vehicle._id }).populate([{
            path: 'vehiculo',
            populate: [
                { path: 'propietario', select: 'cedula nombre telefono correo' }
            ],
            select: 'placa marca modelo propietario fecha_ingreso fecha_salida detalles'
        },{
            path: 'encargado',
            select: 'cedula nombre telefono correo'
        }]);
        res.status(200).json(mantenimientos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los mantenimientos", error: error.message });
    }
};

// Metodo para obtener un mantenimiento
export const getMaintenance = async (req, res) => {
    const { id } = req.params;
    try {
        const mantenimiento = await mantenimientoModel.findById(id).populate([{
            path: 'vehiculo',
            populate: [
                { path: 'propietario', select: 'cedula nombre telefono correo' }
            ],
            select: 'placa marca modelo propietario fecha_ingreso fecha_salida detalles'
        }, {
            path: 'encargado',
            select: 'cedula nombre telefono correo'
        }]);
        if (!mantenimiento) {
            return res.status(404).json({ message: "Mantenimiento no encontrado" });
        }
        res.status(200).json(mantenimiento);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el mantenimiento", error: error.message });
    }
};

// Metodo para obtener los mantenimientos de un encargado
export const getMaintenancesByEmployee = async (req, res) => {
    const { cedula } = req.params;
    try {
        const empleado = await empleadosModel.findOne({ cedula });
        if (!empleado.estado) {
            return res.status(400).json({ message: "El empleado seleccionado esta inactivo" });
        }

        if (!empleado || empleado.cargo !== 'Técnico') {
            return res.status(404).json({ message: "El empleado no existe o no es un técnico" });
        }

        const mantenimientos = await mantenimientoModel.find({ encargado: empleado._id }).populate([{
            path: 'vehiculo',
            populate: [
                { path: 'propietario', select: 'cedula nombre telefono correo' }
            ],
            select: 'placa marca modelo propietario fecha_ingreso fecha_salida detalles'
        }, {
            path: 'encargado',
            select: 'cedula nombre telefono correo'
        }]);

        res.status(200).json(mantenimientos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los mantenimientos", error: error.message });
    }
};

// Metodo para actualizar un mantenimiento
export const updateMaintenance = async (req, res) => {
    const { id } = req.params;
    const { descripcion, costo, cedula_encargado, estado } = req.body;
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

        const encargado = await empleadosModel.findOne({ cedula: cedula_encargado });
        if (!encargado || !encargado.estado) {
            return res.status(404).json({ message: "El encargado no existe o se encuentra desactivado" });
        }

        if (encargado.cargo !== 'Técnico') {
            return res.status(400).json({ message: "El encargado debe ser un técnico" });
        }

        await mantenimientoModel.findByIdAndUpdate(id, { descripcion, costo, encargado: encargado._id, estado });
        res.status(200).json({ message: "Mantenimiento actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el mantenimiento", error: error.message });
    }
};