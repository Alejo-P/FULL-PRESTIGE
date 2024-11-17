import { Router } from "express";
import {
    registerAssistance,
    getAssistance,
    updateAssistance
} from "../controllers/AsistenciasController.js";
import auth from "../middlewares/auth.js";
import { validacionAsistencia } from "../middlewares/validacionAsistencia.js";

const router = Router();

router.route("/employee/:cedula/assistance")
    .get(auth, getAssistance)
    .post(auth, validacionAsistencia, registerAssistance)
    .put(auth, validacionAsistencia, updateAssistance)

export default router;