import { Router } from "express";
import {
    registerAssistance,
    getAssistance,
    updateAssistance
} from "../controllers/AsistenciasController.js";
import auth from "../middlewares/auth.js";
import { validacionAsistencia, validacionAsistenciaUpdate } from "../middlewares/validacionAsistencia.js";

const router = Router();

router.route("/employee/:cedula/assistance")
    .get(auth, getAssistance)
    .post(auth, validacionAsistencia, registerAssistance)

router.put("/employee/assistance/:id", auth, validacionAsistenciaUpdate, updateAssistance);

export default router;