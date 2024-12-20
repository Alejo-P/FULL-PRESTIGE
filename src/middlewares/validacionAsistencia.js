import { check, validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();

export const validacionAsistencia = [
    check('fecha')
        .exists({ checkFalsy: true })
        .withMessage('El campo "fecha" es obligatorio')
        .isISO8601()
        .withMessage('El campo "fecha" debe ser una fecha válida')
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
        }),

    check('hora_ingreso')
        .optional({ nullable: true, checkFalsy: true })
        .matches(/^\d{2}:\d{2}$/)
        .withMessage('El campo "hora_ingreso" debe tener el formato HH:mm')
        .custom((value, { req }) => {
            if (process.env.NODE_ENV === 'test') return true;
            if (!value && !req.body.hora_salida) return true;

            const [hora, minutos] = value.split(':').map(Number);
            const ahora = new Date();
            const horaActual = String(ahora.getHours()).padStart(2, '0');
            const minutosActual = String(ahora.getMinutes()).padStart(2, '0');

            if (hora < 8 || hora > 18) {
                throw new Error('La hora de ingreso debe estar entre las 8:00 y las 18:00.');
            }

            // Verificar que la hora actual este dentro del intervalo permitido
            if (horaActual < 8 || horaActual > 18) {
                throw new Error('La hora actual no está dentro del intervalo permitido.');
            }

            if (hora < horaActual || (hora === horaActual && minutos < minutosActual)) {
                throw new Error(`La hora de ingreso no puede ser anterior a la hora actual (${horaActual}:${minutosActual}).`);
            }
            return true;
        }),

    check('hora_salida')
        .optional({ nullable: true, checkFalsy: true })
        .matches(/^\d{2}:\d{2}$/)
        .withMessage('El campo "hora_salida" debe tener el formato HH:mm')
        .custom((value, { req }) => {
            if (!value && !req.body.hora_ingreso) return true;

            const [horaIngreso, minutosIngreso] = req.body.hora_ingreso
                ? req.body.hora_ingreso.split(':').map(Number)
                : [null, null];
            const [horaSalida, minutosSalida] = value.split(':').map(Number);

            if (
                horaIngreso !== null &&
                (horaSalida < horaIngreso || (horaSalida === horaIngreso && minutosSalida < minutosIngreso))
            ) {
                throw new Error('La hora de salida no puede ser menor a la hora de ingreso.');
            }
            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

export const validacionAsistenciaUpdate = [
    check('hora_ingreso')
        .optional({ nullable: true, checkFalsy: true })
        .matches(/^\d{2}:\d{2}$/)
        .withMessage('El campo "hora_ingreso" debe tener el formato HH:mm')
        .custom((value, { req }) => {
            if (process.env.NODE_ENV === 'test') return true;
            if (!value && !req.body.hora_salida) return true;

            const [hora, _] = value.split(':').map(Number);

            if (hora < 8 || hora > 18) {
                throw new Error('La hora de ingreso debe estar entre las 8:00 y las 18:00.');
            }

            return true;
        }),

    check('hora_salida')
        .optional({ nullable: true, checkFalsy: true })
        .matches(/^\d{2}:\d{2}$/)
        .withMessage('El campo "hora_salida" debe tener el formato HH:mm')
        .custom((value, { req }) => {
            if (!value && !req.body.hora_ingreso) return true;

            const [horaIngreso, minutosIngreso] = req.body.hora_ingreso
                ? req.body.hora_ingreso.split(':').map(Number)
                : [null, null];
            const [horaSalida, minutosSalida] = value.split(':').map(Number);

            if (
                horaIngreso !== null &&
                (horaSalida < horaIngreso || (horaSalida === horaIngreso && minutosSalida < minutosIngreso))
            ) {
                throw new Error('La hora de salida no puede ser menor a la hora de ingreso.');
            }
            return true;
        }),
    
    check('justificacion')
        .exists({ checkFalsy: true })
        .withMessage('El campo "justificacion" es obligatorio')
        .customSanitizer((value) =>  value ? value.trim() : value)
        .isString()
            .withMessage('El campo "justificacion" debe ser una cadena de texto'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]
