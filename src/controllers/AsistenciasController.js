import asistencasModel from '../models/AsistenciasModel.js';
import empleadosModel from '../models/EmpleadosModel.js';

// Metodo para registrar una asistencia
export const registerAssistance = async (req, res) => {
    const { cedula } = req.params;
    try {
        const {
            tiempo_ingreso,
            tiempo_salida,
            observaciones
        } = req.body;

        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Todos los campos son necesarios" });
        }

        if (!cedula) {
            return res.status(400).json({ message: "La cedula es necesaria" });
        }

        const empleado = await empleadosModel.findOne({ cedula });
        if (!empleado) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        const newAsistencia = new asistencasModel({ empleado:empleado._id, tiempo_ingreso, tiempo_salida, observaciones });
        await newAsistencia.save();

        res.status(201).json({ message: "Asistencia registrada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

// Metodo para obtener todas las asistencias de un empleado
export const getAssistance = async (req, res) => {
    const { cedula } = req.params;
    try {
        if (!cedula) {
            return res.status(400).json({ message: "La cedula es necesaria" });
        }

        const empleado = await empleadosModel.findOne({ cedula });
        if (!empleado) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        const asistencias = await asistencasModel.find({ empleado: empleado._id }).populate('empleado', 'nombre correo cedula direccion');
        res.status(200).json(asistencias);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

// Metodo para actualizar una asistencia
export const updateAssistance = async (req, res) => {
    const { cedula } = req.params;
    try {
        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Todos los campos son necesarios" });
        }

        if (!cedula) {
            return res.status(400).json({ message: "La cedula es necesaria" });
        }

        const empleado = await empleadosModel.findOne({ cedula });
        if (!empleado) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        const asistencia = await asistencasModel.findOne({ empleado: empleado._id });
        if (!asistencia) {
            return res.status(404).json({ message: "Asistencia no encontrada" });
        }

        await asistencasModel.findByIdAndUpdate(asistencia._id, req.body);

        res.status(200).json({ message: "Asistencia actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

// Metodo para eliminar una asistencia
export const removeAssistance = async (req, res) => {
    const { cedula } = req.params;
    try {
        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }

        if (!cedula) {
            return res.status(400).json({ message: "La cedula es necesaria" });
        }

        const empleado = await empleadosModel.findOne({ cedula });
        if (!empleado) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        const asistencia = await asistencasModel.findOne({ empleado: empleado._id });
        if (!asistencia) {
            return res.status(404).json({ message: "Asistencia no encontrada" });
        }

        await asistencasModel.findByIdAndDelete(asistencia._id);

        res.status(200).json({ message: "Asistencia eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};