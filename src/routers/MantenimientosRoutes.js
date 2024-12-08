import { Router } from 'express';
import {
    registerMaintenance,
    getMaintenances,
    getMaintenance,
    getMaintenancesByEmployee,
    getMaintenancesByVehicle,
    updateMaintenance,
} from '../controllers/MantenimientoController.js'
import auth from '../middlewares/auth.js';
import { validacionMantenimientos } from '../middlewares/validacionMantenimientos.js';

const router = Router();

router.post('/maintenance/register/:id', auth, validacionMantenimientos, registerMaintenance)
router.get('/maintenances', auth, getMaintenances)
router.get('/maintenance/vehicle/:placa',auth, getMaintenancesByVehicle)
router.get('/maintenance/employee/:cedula',auth, getMaintenancesByEmployee)

router.route('/maintenance/:id')
    .get(auth, getMaintenance)
    .put(auth, updateMaintenance)

export default router;