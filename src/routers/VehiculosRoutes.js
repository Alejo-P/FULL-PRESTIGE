import { Router } from 'express';
import {
    registerVehicle,
    assignVehicle,
    getVehicles,
    getVehicle,
    getVehiclesByEmployee,
    getVehiclesByClient,
    updateVehicle
} from '../controllers/VehiculosController.js';
import auth from '../middlewares/auth.js';
import { validacionVehiculos } from '../middlewares/validacionVehiculos.js';

const router = Router();

router.post('/vehicle', auth, validacionVehiculos, registerVehicle)
router.post('/vehicle/assign', auth, assignVehicle)
router.get('/vehicles', auth, getVehicles)
router.get('/vehicles/client/:cedula', auth, getVehiclesByClient)
router.get('/vehicles/employee/:cedula', auth, getVehiclesByEmployee)
router.route('/vehicle/:placa')
    .get(auth, getVehicle)
    .put(auth, updateVehicle)

export default router;