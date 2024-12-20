import { Router } from "express";
import {
    registerClient,
    getClients,
    getClient,
    updateClient,
    removeClient
} from "../controllers/ClientesController.js";
import auth from "../middlewares/auth.js";
import { validacionClientes } from "../middlewares/validacionClientes.js";

const router = Router();

router.post('/client', auth, validacionClientes, registerClient)
router.get('/clients', auth, getClients)

router.route('/client/:cedula')
    .get(auth, getClient)
    .put(auth, updateClient)
    .delete(auth, removeClient)

export default router;