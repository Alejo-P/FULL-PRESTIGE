import { Router } from "express";
import {
    registerAssistance,
    getAssistance,
    updateAssistance,
    removeAssistance
} from "../controllers/AsistenciasController.js";
import auth from "../middlewares/auth.js";
import { validacionAsistencia } from "../middlewares/validacionAsistencia.js";

const router = Router();

router.route("/employee/assistance/:cedula")
    .get(auth, getAssistance)
    .post(auth, validacionAsistencia, registerAssistance)
    .put(auth, validacionAsistencia, updateAssistance)
    .delete(auth, removeAssistance);

export default router;