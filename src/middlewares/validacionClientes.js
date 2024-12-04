import { check, validationResult } from 'express-validator';

export const validacionClientes = [
    check(['nombre', 'cedula', 'correo', 'telefono', 'direccion'])
        .exists()
            .withMessage('Todos los campos son requeridos')
        .notEmpty()
            .withMessage('No puede enviar campos vacíos'),

    check('nombre')
        .isString()
            .withMessage('El campo "nombre" debe ser una cadena de texto'),

    check('cedula')
        .isLength({ min: 10, max: 10 })
            .withMessage('El campo "cedula" debe tener 10 caracteres')
        .isString()
            .withMessage('El campo "cedula" debe ser una cadena de texto')
        .custom((value) => {
            if (!/^\d+$/.test(value)) {
                throw new Error('El campo "cedula" solo puede contener números');
            }
            return true;
        }),

    check('correo')
        .isEmail()
            .withMessage('El campo "correo" debe ser un correo electrónico'),

    check('telefono')
        .isLength({ min: 10, max: 10 })
            .withMessage('El campo "telefono" debe tener 10 caracteres')
        .isString()
            .withMessage('El campo "telefono" debe ser una cadena de texto')
        .custom((value) => {
            if (!/^\d+$/.test(value)) {
                throw new Error('El campo "telefono" solo puede contener números');
            }
            return true;
        }),

    check('direccion')
        .isString()
            .withMessage('El campo "direccion" debe ser una cadena de texto'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];