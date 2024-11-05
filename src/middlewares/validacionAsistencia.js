import { check, validationResult } from 'express-validator';

export const validacionAsistencia = [
    check(['tiempo_ingreso', 'tiempo_salida', 'observaciones'])
        .exists()
            .withMessage('Todos los campos son requeridos')
        .notEmpty()
            .withMessage('No puede enviar campos vacíos'),

    check('tiempo_ingreso')
        .isISO8601()
            .withMessage('El campo "tiempo_ingreso" debe ser una fecha válida')
        .custom((value) => {
            const hoy = new Date();
            hoy.setUTCHours(0, 0, 0, 0);
            
            const manana = new Date(hoy);
            manana.setUTCDate(hoy.getUTCDate() + 1);

            const ingreso = new Date(value);

            if (ingreso < hoy || ingreso >= manana) {
                throw new Error('La fecha de ingreso debe ser la fecha actual y no puede ser diferente.');
            }
            return true;
        }),

    check('tiempo_salida')
        .isISO8601()
            .withMessage('El campo "tiempo_salida" debe ser una fecha válida')
        .custom((value, { req }) => {
            const salida = new Date(value);
            const ingreso = new Date(req.body.tiempo_ingreso);
            if (salida <= ingreso) {
                throw new Error('La fecha y hora de salida debe ser posterior a la fecha y hora de ingreso');
            }
            return true;
        }),

    check('observaciones')
        .optional()
        .isString()
            .withMessage('El campo "observaciones" debe ser una cadena de texto'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];