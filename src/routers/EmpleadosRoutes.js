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

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/recover-password', recoverPassword);
router.get('/verify-token/:token', verifyToken);
router.put('/change-password/:token', changePassword);

// Rutas para administrara los empleados
router.get('/employees', auth, getEmployees);
router.route('/employee/:cedula')
    .get(auth, getEmployee)
    .delete(auth, deactivateEmployee)
    .put(auth, updateEmployee);

// Rutas para administrar el perfil del empleado logueado
router.put('/profile/update-password', auth, updatePassword);
router.route('/profile')
    .get(auth, getProfile)
    .put(auth, updateProfile)
    .delete(auth, deactivateProfile);

export default router;