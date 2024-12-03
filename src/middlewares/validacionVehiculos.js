import { check, validationResult } from "express-validator";

export const validacionVehiculos = [
    check(["placa", "marca", "modelo", "cedula_cliente", "fecha_ingreso", "cedula_encargado", "detalles"])
        .exists()
            .withMessage("Todos los campos son requeridos")
        .notEmpty()
            .withMessage("No puede enviar campos vacíos"),

    check("placa")
        .isString()
            .withMessage("El campo 'placa' debe ser una cadena de texto"),
    
    check("marca")
        .isString()
            .withMessage("El campo 'marca' debe ser una cadena de texto"),

    check("modelo")
        .isString()
            .withMessage("El campo 'modelo' debe ser una cadena de texto"),

    check("cedula_cliente")
        .isString()
            .withMessage("El campo 'cedula_cliente' debe ser una cadena de texto"),

    check("fecha_ingreso")
        .isISO8601()
            .withMessage("El campo 'fecha_ingreso' debe ser una fecha válida")
        .custom((value) => {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const fechahoy = hoy.toISOString().split('T')[0];

            const fecha = new Date(value);
            const fechaf = fecha.toISOString().split('T')[0];

            if (fechaf !== fechahoy) {
                throw new Error('La fecha de ingreso debe ser la fecha actual.');
            }
            return true;
        }
    ),

    check("cedula_encargado")
        .isString()
            .withMessage("El campo 'cedula_encargado' debe ser una cadena de texto"),

    check("detalles")
        .isString()
            .withMessage("El campo 'detalles' debe ser una cadena de texto"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];