import { Router } from 'express';
import {
    login,
    register,
    recoverPassword,
    changePassword,
    verifyToken,
    getProfile,
    getEmployee,
    updateProfile,
    updateEmployee,
    updatePassword,
    deactivateProfile,
    deactivateEmployee,
    getEmployees
} from '../controllers/EmpleadosController.js';
import auth from '../middlewares/auth.js';
import { validacionActualizacion_empleado, validacionRegistro_empleado } from '../middlewares/validacionEmpleado.js';

const router = Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión en el sistema
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                  type: string
 *                  description: Correo del empleado
 *               contrasena:
 *                  type: string
 *                  description: Contraseña del empleado
 * 
 *     responses:
 *       200:
 *         description: Sesión iniciada correctamente
 *       400:
 *         description: Error en la validación de datos
 *       404:
 *         description: Crendenciales incorrectas
 *       500:
 *         description: Error en el servidor
 */
router.post('/login', login);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra un nuevo usuario en el sistema (Personal de la empresa)
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *                 description: Cedula del empleado
 *               edad:
 *                 type: number
 *                 description: Edad del empleado
 *               nombre:
 *                  type: string
 *                  description: Nombre y apellido del empleado
 *               contrasena:
 *                  type: string
 *                  description: Contraseña del empleado
 *               cargo:
 *                  type: string
 *                  description: Cargo del empleado, puede ser Gerente o Tecnico
 *               correo:
 *                  type: string
 *                  description: Correo del empleado
 *               direccion:
 *                  type: string
 *                  description: Dirección de residencia del empleado 
 * 
 *     responses:
 *       201:
 *         description: Empleado registrado exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       404:
 *         description: Crendenciales ya existentes
 *       500:
 *         description: Error en el servidor
 */
router.post('/register', validacionRegistro_empleado, register);
router.post('/recover-password', recoverPassword);
router.get('/verify-token/:token', verifyToken);
router.put('/change-password/:token', changePassword);

// Rutas para administrara los empleados
router.get('/employees', auth, getEmployees);

/**
 * @swagger
 * /employee/{cedula}:
 *   get:
 *     summary: Obtiene los detalles del perfil de un empleado especificado
 *     tags: [Control de empleados]
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         description: Cédula del empleado
 *         schema:
 *           type: string
 * 
 *     responses:
 *       200:
 *         description: Detalles del empleado
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error en el servidor
 *
 *   put:
 *     summary: Actualiza los detalles del empleado especificado
 *     tags: [Control de empleados]
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
 *               edad:
 *                 type: number
 *                 description: Edad del empleado
 *               nombre:
 *                  type: string
 *                  description: Nombre y apellido del empleado
 *               cargo:
 *                  type: string
 *                  description: Cargo del empleado, puede ser Gerente o Tecnico
 *               correo:
 *                  type: string
 *                  description: Correo del empleado
 *               direccion:
 *                  type: string
 *                  description: Dirección de residencia del empleado 
 * 
 *     responses:
 *       200:
 *         description: Empleado actualizada exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       404:
 *         description: No se puede actualizar el perfil del usuario logueado
 *       500:
 *         description: Error en el servidor
 *
 *   delete:
 *     summary: Elimina el perfil del empleado especificado
 *     tags: [Control de asistencias]
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         description: Cédula del empleado
 *         schema:
 *           type: string
 * 
 *     responses:
 *       200:
 *         description: Perfil eliminado exitosamente
 *       404:
 *         description: No se puede eliminar el perfil del usuario logueado, empleado no encontrado, empleado desactivado previamente
 *       500:
 *         description: Error en el servidor
 */
router.route('/employee/:cedula')
    .get(auth, getEmployee)
    .delete(auth, deactivateEmployee)
    .put(auth, validacionActualizacion_empleado, updateEmployee);

// Rutas para administrar el perfil del empleado logueado
router.put('/profile/update-password', auth, updatePassword);


router.route('/profile')
    .get(auth, getProfile)
    .put(auth, validacionActualizacion_empleado, updateProfile)
    .delete(auth, deactivateProfile);

export default router;