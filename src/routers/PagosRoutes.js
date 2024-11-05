import { Router } from "express";
import { 
    registerPayments,
    getPayments,
    updatePayment,
    removePayment
} from "../controllers/PagosController.js";
import auth from "../middlewares/auth.js";
import { validacionPagos } from "../middlewares/validacionPagos.js";

const router = Router();

router.route('/employee/:cedula/payments')
    .post(auth, validacionPagos, registerPayments)
    .get(auth, getPayments)
    .put(auth, validacionPagos, updatePayment)
    .delete(auth, removePayment);

export default router;