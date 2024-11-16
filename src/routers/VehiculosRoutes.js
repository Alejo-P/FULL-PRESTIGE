import { Router } from 'express';
import {
    registerVehicle,
    getVehicles,
    getVehicle,
    getVehiclesByClient,
    getVehiclesByEmployee,
    updateVehicle,
    deleteVehicle
} from '../controllers/VehiculosController.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.post('/vehicle', auth, registerVehicle);
router.get('/vehicles', auth, getVehicles);
router.get('/vehicles/client/:cedula', auth, getVehiclesByClient);
router.get('/vehicles/employee/:cedula', auth, getVehiclesByEmployee);
router.route('/vehicle/:placa')
    .get(auth, getVehicle)
    .put(auth, updateVehicle)
    .delete(auth, deleteVehicle)

export default router;