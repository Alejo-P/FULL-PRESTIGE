import { Router } from "express";
import {
    registerAssistance,
    getAssistance,
    updateAssistance,
    removeAssistance
} from "../controllers/AsistenciasController.js";
import auth from "../middlewares/auth.js";
import { validacionAsistencia } from "../middlewares/validacionAsistencia.js";

const router = Router();

/**
 * @swagger
 * /employee/{cedula}/assistance:
 *   post:
 *     summary: Registra detalles de asistencia para el empleado especificado
 *     tags: [Control de asistencias]
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         description: Cédula del empleado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 description: Fecha de la asistencia
 *               hora_ingreso:
 *                 type: string
 *                 description: Hora de ingreso
 *               hora_salida:
 *                  type: string
 *                  description: Hora de salida
 *               descripcion:
 *                  type: string
 *                  description: Descripción de la asistencia
 * 
 *     responses:
 *       201:
 *         description: Asistencia registrada exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error en el servidor
 *
 *   get:
 *     summary: Obtiene los detalles de asistencia del empleado especificado
 *     tags: [Control de asistencias]
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         description: Cédula del empleado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de asistencias del empleado
 *       400:
 *         description: Error en la validación de datos
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error en el servidor
 *
 *   put:
 *     summary: Actualiza los detalles de asistencia del empleado especificado
 *     tags: [Control de asistencias]
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         description: Cédula del empleado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 description: Fecha de la asistencia
 *               hora_ingreso:
 *                 type: string
 *                 description: Hora de ingreso
 *               hora_salida:
 *                  type: string
 *                  description: Hora de salida
 *               descripcion:
 *                  type: string
 *                  description: Descripción de la asistencia
 *     responses:
 *       200:
 *         description: Asistencia actualizada exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Empleado o asistencia no encontrada
 *       500:
 *         description: Error en el servidor
 *
 *   delete:
 *     summary: Elimina los detalles de asistencia del empleado especificado
 *     tags: [Control de asistencias]
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         description: Cédula del empleado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pago eliminado exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.route("/employee/:cedula/assistance")
    .get(auth, getAssistance)
    .post(auth, validacionAsistencia, registerAssistance)
    .put(auth, validacionAsistencia, updateAssistance)
    .delete(auth, removeAssistance);

export default router;