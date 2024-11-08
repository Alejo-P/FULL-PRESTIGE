import pagosModel from "../models/PagosModel.js";
import empleadosModel from "../models/EmpleadosModel.js";

// Metodo para registrar un pago
export const registerPayments = async (req, res) => {
    const { cedula } = req.params;
    try {
        const { 
            adelanto,
            permisos,
            multas,
            atrasos,
            subtotal
        } = req.body;

        if (req.empleado.cargo !== "Administrador") {
            return res.status(401).json({ error: "No tiene permisos para realizar esta acción" });
        }

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ error: "Faltan campos por completar" });
        }

        const empleado = await empleadosModel.findOne({ cedula });
        if (!empleado) {
            return res.status(404).json({ error: "No se encontró al empleado" });
        }

        const pago = new pagosModel({
            adelanto,
            permisos,
            multas,
            atrasos,
            subtotal,
            empleado: empleado._id,
        });

        await pago.save();
        res.status(201).json({ message: "Pago registrado correctamente" });
    } catch (error) {
        res.status(400).json({ message: 'Error al registrar el pago', error: error.message });
    }
};

// Metodo para obtener los pagos de un empleado
export const getPayments = async (req, res) => {
    const { cedula } = req.params;
    try {
        if (!cedula) {
            return res.status(400).json({ error: "La cedula es necesaria" });
        }

        const empleado = await empleadosModel.findOne({ cedula });
        if (!empleado) {
            return res.status(404).json({ error: "No se encontró al empleado" });
        }

        const pagos = await pagosModel.find({ empleado: empleado._id }).populate('empleado', 'nombre correo cedula direccion');
        res.status(200).json(pagos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Metodo para actualizar un pago
export const updatePayment = async (req, res) => {
    const { cedula } = req.params;
    try {
        if (req.empleado.cargo !== "Administrador") {
            return res.status(401).json({ error: "No tiene permisos para realizar esta acción" });
        }

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ error: "Faltan campos por completar" });
        }

        const empleado = await empleadosModel.findOne({ cedula });
        if (!empleado) {
            return res.status(404).json({ error: "No se encontró al empleado" });
        }

        const pago = await pagosModel.findOne({ empleado: empleado._id });
        if (!pago) {
            return res.status(404).json({ error: "No se encontró el pago" });
        }

        await pagosModel.findByIdAndUpdate(pago._id, req.body);
        res.status(200).json({ message: "Pago actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Metodo para eliminar un pago
export const removePayment = async (req, res) => {
    const { cedula } = req.params;
    try {
        if (req.empleado.cargo !== "Administrador") {
            return res.status(401).json({ error: "No tiene permisos para realizar esta acción" });
        }

        const empleado = await empleadosModel.findOne({ cedula });
        if (!empleado) {
            return res.status(404).json({ error: "No se encontró al empleado" });
        }

        const pago = await pagosModel.findOne({ empleado: empleado._id });
        if (!pago) {
            return res.status(404).json({ error: "No se encontró el pago" });
        }

        await pagosModel.findByIdAndDelete(pago._id);
        res.status(200).json({ message: "Pago eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};