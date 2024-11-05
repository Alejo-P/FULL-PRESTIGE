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

router.post('/login', login);
router.post('/register', validacionRegistro_empleado, register);
router.post('/recover-password', recoverPassword);
router.get('/verify-token/:token', verifyToken);
router.put('/change-password/:token', changePassword);

// Rutas para administrara los empleados
router.get('/employees', auth, getEmployees);
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