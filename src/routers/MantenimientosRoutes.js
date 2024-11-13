import { Router } from 'express';
import {
    registerMaintenance,
    getMaintenances,
    getMaintenanceById,
    getMaintenancesByVehicle,
    updateMaintenance,
    deleteMaintenance
} from '../controllers/MantenimientoController.js'
import auth from '../middlewares/auth.js';

const router = Router();

router.post('/maintenance/register', auth, registerMaintenance);
router.get('/maintenances', auth, getMaintenances);
router.get('/maintenance/:id', auth, getMaintenanceById);

router.route('/maintenance/:placa')
    .get(auth, getMaintenancesByVehicle)
    .put(auth, updateMaintenance)
    .delete(auth, deleteMaintenance);

export default router;