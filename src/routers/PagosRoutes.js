import { Router } from "express";
import { 
    registerPayments,
    getPayments,
    updatePayment
} from "../controllers/PagosController.js";
import auth from "../middlewares/auth.js";
import { validacionPagos } from "../middlewares/validacionPagos.js";

const router = Router();

/**
 * @swagger
 * /employee/{cedula}/payments:
 *   post:
 *     summary: Registra un nuevo pago para el empleado especificado
 *     tags: [Control de pagos]
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
 *               adelanto:
 *                 type: number
 *                 description: Adelanto del empleado
 *               permisos:
 *                 type: string
 *                 description: Historial de permisos
 *               multas:
 *                  type: string
 *                  description: Historial de multas
 *               atrasos:
 *                  type: string
 *                  description: Historial de atrasos
 *               subtotal:
 *                  type: number
 *                  description: Total a pagar
 * 
 *     responses:
 *       201:
 *         description: Pago registrado exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       401:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error en el servidor
 *
 *   get:
 *     summary: Obtiene los pagos del empleado especificado
 *     tags: [Control de pagos]
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         description: Cédula del empleado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pagos
 *       400:
 *         description: Error en la validación de datos
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error en el servidor
 *
 *   put:
 *     summary: Actualiza un pago del empleado especificado
 *     tags: [Control de pagos]
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
 *               adelanto:
 *                 type: number
 *                 description: Adelanto del empleado
 *               permisos:
 *                 type: string
 *                 description: Historial de permisos
 *               multas:
 *                  type: string
 *                  description: Historial de multas
 *               atrasos:
 *                  type: string
 *                  description: Historial de atrasos
 *               subtotal:
 *                  type: number
 *                  description: Total a pagar
 *     responses:
 *       200:
 *         description: Pago actualizado exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       401:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.route('/employee/:cedula/payments')
    .post(auth, validacionPagos, registerPayments)
    .get(auth, getPayments)
    .put(auth, validacionPagos, updatePayment)

export default router;