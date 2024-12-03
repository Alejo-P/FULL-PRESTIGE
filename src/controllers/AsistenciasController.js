import asistencasModel from '../models/AsistenciasModel.js';
import empleadosModel from '../models/EmpleadosModel.js';

// Metodo para registrar una asistencia
export const registerAssistance = async (req, res) => {
    const { cedula } = req.params;
    try {
        const {
            fecha,
        } = req.body;

        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }

        if (!fecha) {
            return res.status(400).json({ message: "La fecha es necesaria" });
        }

        if (!cedula) {
            return res.status(400).json({ message: "La cedula es necesaria" });
        }

        const empleado = await empleadosModel.findOne({ cedula });
        if (!empleado) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        const date = await asistencasModel.findOne({ fecha, empleado: empleado._id });
        if (date) {
            return res.status(400).json({ message: "Ya existe una asistencia registrada para esta fecha" });
        }

        const newAsistencia = new asistencasModel({ empleado:empleado._id, ...req.body });

        if (!req.body?.hora_ingreso && !req.body?.hora_salida) {
            newAsistencia.estado = 'Ausente';
        }

        await newAsistencia.save();

        res.status(201).json({ message: "Asistencia registrada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar la asistencia", error: error.message });
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

        const asistencias = await asistencasModel.find({ empleado: empleado._id }).populate('empleado', 'nombre correo cedula direccion cargo telefono');
        res.status(200).json(asistencias);
    } catch (error) {
        res.status(500).json({  message: "Error al obtener las asistencias", error: error.message });
    }
};

// Metodo para actualizar una asistencia
export const updateAssistance = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: "El id de la asistencia es necesario" });
        }

        if (req.empleado.cargo !== 'Administrador') {
            return res.status(403).json({ message: "No tiene permisos para realizar esta acción" });
        }

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ message: "Todos los campos son necesarios" });
        }

        const asistencia = await asistencasModel.findById(id);
        if (!asistencia) {
            return res.status(404).json({ message: "Asistencia no encontrada" });
        }

        // Verificar que la fecha no se haya modificado
        const fecha_registrada = new Date(asistencia.fecha).toISOString().split('T')[0];
        const fecha_ingresada = new Date(req.body.fecha).toISOString().split('T')[0];
        if (fecha_registrada !== fecha_ingresada) {
            return res.status(400).json({ message: "No se puede modificar la fecha de la asistencia" });
        }

        await asistencasModel.findByIdAndUpdate(id, req.body);

        res.status(200).json({ message: "Asistencia actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la asistencia", error: error.message });
    }
};