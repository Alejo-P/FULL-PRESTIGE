import { check, validationResult } from 'express-validator';

export const validacionAsistencia = [
    check('fecha')
        .exists({ checkFalsy: true })
            .withMessage('El campo "fecha" es obligatorio')
        .isISO8601()
            .withMessage('El campo "fecha" debe ser una fecha válida')
        .custom((value) => {
            const hoy = new Date();
            hoy.setUTCHours(0, 0, 0, 0);

            const manana = new Date(hoy);
            manana.setUTCDate(hoy.getUTCDate() + 1);

            const fecha = new Date(value);

            if (fecha < hoy || fecha >= manana) {
                throw new Error('La fecha de ingreso debe ser la fecha actual.');
            }
            return true;
        }),

    check('hora_ingreso')
        .matches(/^\d{2}:\d{2}$/)
            .withMessage('El campo "hora_ingreso" debe tener el formato HH:mm')
        .custom((value) => {
            const [hora, minutos] = value.split(':').map(Number);
            const ahora = new Date();
            const horaActual = ahora.getUTCHours() -5;
            const minutosActual = ahora.getUTCMinutes();

            if (hora < horaActual || (hora === horaActual && minutos < minutosActual)) {
                throw new Error(`La hora de ingreso no puede ser distinta a la hora actual.${horaActual}:${minutosActual}`);
            }
            return true;
        }),

    check('hora_salida')
        .matches(/^\d{2}:\d{2}$/)
            .withMessage('El campo "hora_salida" debe tener el formato HH:mm')
        .custom((value, { req }) => {
            const [horaIngreso, minutosIngreso] = req.body.hora_ingreso.split(':').map(Number);
            const [horaSalida, minutosSalida] = value.split(':').map(Number);

            if (
                horaSalida < horaIngreso ||
                (horaSalida === horaIngreso && minutosSalida < minutosIngreso)
            ) {
                throw new Error('La hora de salida no puede ser menor a la hora de ingreso.');
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
