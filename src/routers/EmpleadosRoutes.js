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
    deactivateProfile,
    deactivateEmployee
} from '../controllers/EmpleadosController.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/recover-password', recoverPassword);
router.get('/verify-token/:token', verifyToken);
router.put('/change-password/:token', changePassword);

// Rutas paraadministrara los empleados
router.get('/get-employee/:cedula', auth, getEmployee);
router.delete('/deactivate-employee/:cedula', auth, deactivateEmployee);

router.route('/profile')
    .get(auth, getProfile)
    .put(auth, updateProfile)
    .delete(auth, deactivateProfile);


export default router;