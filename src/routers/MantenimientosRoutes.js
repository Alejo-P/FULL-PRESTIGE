import { Router } from 'express';
import {
    registerMaintenance,
    getMaintenances,
    getMaintenance,
    getMaintenancesByVehicle,
    updateMaintenance,
} from '../controllers/MantenimientoController.js'
import auth from '../middlewares/auth.js';
import { validacionMantenimientos } from '../middlewares/validacionMantenimientos.js';

const router = Router();

router.post('/maintenance/register', auth, validacionMantenimientos, registerMaintenance)
router.get('/maintenances', auth, getMaintenances)
router.get('/maintenance/vehicle/:placa',auth, getMaintenancesByVehicle)

router.route('/maintenance/:id')
    .get(auth, getMaintenance)
    .put(auth, updateMaintenance)

export default router;