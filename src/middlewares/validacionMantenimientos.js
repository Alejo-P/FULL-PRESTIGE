import { check, validationResult } from 'express-validator';

export const validacionMantenimientos = [
    check(['placa', 'descripcion', 'costo'])
        .exists()
            .withMessage('Todos los campos son requeridos')
        .notEmpty()
            .withMessage('No puede enviar campos vacíos'),

    check('placa')
        .isString()
            .withMessage('El campo "placa" debe ser una cadena de texto'),

    check('descripcion')
        .isString()
            .withMessage('El campo "descripcion" debe ser una cadena de texto'),

    check('costo')
        .isNumeric()
            .withMessage('El campo "costo" debe ser un número'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];