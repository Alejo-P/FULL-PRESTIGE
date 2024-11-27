import { check, validationResult } from 'express-validator';

export const validacionAsistencia = [
    check('fecha')
        .exists({ checkFalsy: true })
            .withMessage('El campo "fecha" es obligatorio')
        .isISO8601()
            .withMessage('El campo "fecha" debe ser una fecha válida')
        .custom((value) => {
            const hoy = new Date();
            const year = hoy.getFullYear();
            const month = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes en formato 2 dígitos
            const day = String(hoy.getDate()).padStart(2, '0'); // Día en formato 2 dígitos

            const fechaActual = `${year}-${month}-${day}`; // Fecha en formato YYYY-MM-DD


            hoy.setUTCHours(0, 0, 0, 0);

            const manana = new Date(hoy);
            manana.setUTCDate(hoy.getUTCDate() + 1);

            const fecha = new Date(value);

            if (fecha < fechaActual || fecha >= manana) {
                throw new Error('La fecha de ingreso debe ser la fecha actual.');
            }
            return true;
        }),

    check('hora_ingreso')
        .optional({ nullable: true, checkFalsy: true })
        .matches(/^\d{2}:\d{2}$/)
            .withMessage('El campo "hora_ingreso" debe tener el formato HH:mm')
        .custom((value, { req }) => {
            if (!value && !req.body.hora_salida) return true;
            
            const [hora, minutos] = value.split(':').map(Number);
            const ahora = new Date();
            const horaActual = ahora.getUTCHours() - 5;
            const minutosActual = ahora.getUTCMinutes();

            if (hora < 7 || hora > 20) {
                throw new Error('La hora de ingreso debe estar entre las 8:00 y las 18:00.');
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
