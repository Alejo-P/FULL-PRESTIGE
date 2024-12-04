import { check, validationResult } from "express-validator";

export const validacionVehiculos = [
    check(["placa", "marca", "modelo", "cedula_cliente", "fecha_ingreso"])
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

    check("fecha_salida")
        .optional({ checkFalsy: true, nullable: true })
        .isISO8601()
            .withMessage("El campo 'fecha_salida' debe ser una fecha válida")
        .custom((value) => {
            const fecha_ingreso = req.body.fecha_ingreso;
            const fecha_salida = new Date(value);
            const fecha_i = new Date(fecha_ingreso);
            fecha_i.setHours(0, 0, 0, 0);

            if (fecha_salida < fecha_i) {
                throw new Error('La fecha de salida no puede ser menor a la fecha de ingreso.');
            }
            return true;
        }
    ),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];