import vehiculosModel from '../models/VehiculosModel.js';
import clientesModel from '../models/ClientesModel.js';
import empleadosModel from '../models/EmpleadosModel.js';

// Metodo para registrar un vehiculo
export const registerVehicle = async (req, res) => {
    try {
        const {
            placa,
            marca,
            modelo,
            fecha_ingreso,
            fecha_salida,
            cedula_cliente,
            cedula_encargado,
            detalles
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

        const data = {
            placa,
            marca,
            modelo,
            fecha_ingreso,
            fecha_salida,
            propietario: cliente._id,
            encargado: encargado._id,
            detalles
        };

        const newVehicle = new vehiculosModel(data);
        await newVehicle.save();

        res.status(201).json({ message: "Vehículo registrado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el vehículo", error: error.message });
    }
};

// Metodo para obtener todos los vehiculos
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await vehiculosModel.find().populate('propietario encargado', 'nombre cedula telefono correo');
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los vehículos", error: error.message });
    }
};

// Metodo para obtener un vehiculo por placa
export const getVehicle = async (req, res) => {
    const { placa } = req.params;
    try {
        if (!placa) {
            return res.status(400).json({ message: "La placa es necesaria" });
        }

        const vehicle = await vehiculosModel.findOne({ placa }).populate('propietario encargado', 'nombre cedula telefono correo');
        if (!vehicle) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }

        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el vehículo", error: error.message });
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

        const vehicles = await vehiculosModel.find({ propietario: cliente._id }).populate('propietario encargado', 'nombre cedula telefono correo');
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los vehículos", error: error.message });
    }
};

// Metodo para obtener los vehiculos de un encargado
export const getVehiclesByEmployee = async (req, res) => {
    const { cedula } = req.params;
    try {
        if (!cedula) {
            return res.status(400).json({ message: "La cedula es necesaria" });
        }

        const encargado = await empleadosModel.findOne({ cedula });
        if (!encargado) {
            return res.status(404).json({ message: "Tecnico no encontrado" });
        }

        const vehicles = await vehiculosModel.find({ encargado: encargado._id }).populate('propietario encargado', 'nombre cedula telefono correo');
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los vehículos", error: error.message });
    }
};

// Metodo para actualizar un vehiculo
export const updateVehicle = async (req, res) => {
    const { placa } = req.params;
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

        const vehicle = await vehiculosModel.findOne({ placa });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }

        await vehiculosModel.findByIdAndUpdate(vehicle._id, req.body);

        res.status(200).json({ message: "Vehículo actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el vehículo", error: error.message });
    }
};

// Metodo para eliminar un vehiculo
export const deleteVehicle = async (req, res) => {
    const { placa } = req.params;
    try {
        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }

        if (!placa) {
            return res.status(400).json({ message: "La placa es necesaria" });
        }

        const vehicle = await vehiculosModel.findOne({ placa });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }

        await vehiculosModel.findByIdAndDelete(vehicle._id);

        res.status(200).json({ message: "Vehículo eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el vehículo", error: error.message });
    }
};