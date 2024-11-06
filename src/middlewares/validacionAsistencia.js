import { check, validationResult } from 'express-validator';

export const validacionAsistencia = [
    check(['fecha', 'hora_ingreso', 'hora_salida', 'observaciones'])
        .exists()
            .withMessage('Todos los campos son requeridos')
        .notEmpty()
            .withMessage('No puede enviar campos vacíos'),

    check('fecha')
        .isISO8601()
            .withMessage('El campo "fecha" debe ser una fecha válida')
        .custom((value) => {
            const hoy = new Date();
            hoy.setUTCHours(0, 0, 0, 0);
            
            const manana = new Date(hoy);
            manana.setUTCDate(hoy.getUTCDate() + 1);

            const fecha = new Date(value);

            if (fecha < hoy || fecha >= manana) {
                throw new Error('La fecha de ingreso debe ser la fecha actual y no puede ser diferente.');
            }
            return true;
        }),
    
    check('hora_ingreso')
        .isString()
            .withMessage('El campo "hora_ingreso" debe ser una cadena de texto'),

    check('hora_salida')
        .isString()
            .withMessage('El campo "hora_salida" debe ser una cadena de texto'),

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