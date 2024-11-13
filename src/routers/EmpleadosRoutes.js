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
 *               telefono:
 *                  type: string
 *                  description: Número de teléfono del empleado
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

/**
 * @swagger
 * /recover-password:
 *   post:
 *     summary: Envia un correo con un enlace para restablecer la contraseña
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
 * 
 *     responses:
 *       200:
 *         description: Correo enviado exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       404:
 *         description: Correo no registrado o empleado desactivado
 *       500:
 *         description: Error en el servidor
 */
router.post('/recover-password', recoverPassword);

/**
 * @swagger
 * /verify-token/{token}:
 *   get:
 *     summary: Envia un correo con un enlace para restablecer la contraseña
 *     tags: [Autenticación]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de verificación asignado al empleado
 *         schema:
 *           type: string
 * 
 *     responses:
 *       200:
 *         description: Token verificado exitosamente
 *       400:
 *         description: Token inválido o no registrado
 *       500:
 *         description: Error en el servidor
 */
router.get('/verify-token/:token', verifyToken);

/**
 * @swagger
 * /change-password/{token}:
 *   put:
 *     summary: Cambia la contraseña de un empleado
 *     tags: [Autenticación]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de verificación asignado al empleado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contrasena:
 *                 type: string
 *                 description: Nueva contraseña del empleado
 *               confirmarContrasena:
 *                 type: string
 *                 description: Confirmación de la nueva contraseña
 * 
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       404:
 *         description: Token inválido o no registrado
 *       500:
 *         description: Error en el servidor
 */
router.put('/change-password/:token', changePassword);

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Obtiene la lista de empleados registrados en el sistema
 *     tags: [Control de empleados]
 * 
 *     responses:
 *       200:
 *         description: Lista de empleados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de éxito
 *                   example: Empleados encontrados
 *                 empleados:
 *                   type: array
 *                   description: Lista de empleados registrados
 *                   items:
 *                     type: object
 *                     properties:
 *                       cedula:
 *                         type: string
 *                         description: Cédula del empleado
 *                         example: 1725412365
 *                       nombre:
 *                         type: string
 *                         description: Nombre y apellido del empleado
 *                         example: Juan Perez
 *                       cargo:
 *                         type: string
 *                         description: Cargo del empleado
 *                         example: Gerente
 *                       correo:
 *                         type: string
 *                         description: Correo del empleado
 *                         example: juanp@gmail.com
 *                       direccion:
 *                         type: string
 *                         description: Dirección de residencia del empleado
 *                         example: Av. Amazonas y Naciones Unidas
 *                       telefono:
 *                         type: string
 *                         description: Número de teléfono del empleado
 *                        example: 0987456321
 *                       estado:
 *                         type: boolean
 *                         description: Estado del empleado (activo o inactivo)
 *                         example: true
 * 
 *       404:
 *         description: No hay empleados registrados
 *       500:
 *         description: Error en el servidor
 */
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

/**
 * @swagger
 * /profile/update-password:
 *   put:
 *     summary: Cambia la contraseña del empleado logueado
 *     tags: [Perfil]
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contrasena:
 *                 type: string
 *                 description: Contraseña actual del empleado
 *               nuevaContrasena:
 *                 type: string
 *                 description: Nueva contraseña
 *               confirmarContrasena:
 *                 type: string
 *                 description: Confirmación de la nueva contraseña
 * 
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.put('/profile/update-password', auth, updatePassword);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Obtiene los detalles del perfil logueado
 *     tags: [Perfil]
 * 
 *     responses:
 *       200:
 *         description: Detalles del empleado
 *       500:
 *         description: Error en el servidor
 *
 *   put:
 *     summary: Actualiza los detalles del empleado logueado
 *     tags: [Perfil]
 * 
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
 *         description: Empleado no encontrado
 *       500:
 *         description: Error en el servidor
 *
 *   delete:
 *     summary: Elimina el perfil del empleado logueado
 *     tags: [Perfil]
 * 
 *     responses:
 *       200:
 *         description: Perfil eliminado exitosamente
 *       404:
 *         description: No se puede eliminar el perfil del usuario logueado, empleado no encontrado, empleado desactivado previamente
 *       500:
 *         description: Error en el servidor
 */
router.route('/profile')
    .get(auth, getProfile)
    .put(auth, validacionActualizacion_empleado, updateProfile)
    .delete(auth, deactivateProfile);

export default router;