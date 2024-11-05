import { Router } from 'express';
import {
    login,
    register,
    recoverPassword,
    changePassword,
    verifyToken,
    getProfile
} from '../controllers/EmpleadosController.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/recover-password', recoverPassword);
router.get('/verify-token/:token', verifyToken);
router.put('/change-password/:token', changePassword);
router.get('/profile', auth, getProfile);

export default router;