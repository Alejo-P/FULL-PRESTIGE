import { check, validationResult } from "express-validator";

export const validacionPagos = [
    check(['adelanto', 'permisos', 'multas', 'atrasos', 'subtotal'])
        .exists()
            .withMessage('Todos los campos son requeridos'),
    
    check('adelanto')
        .isNumeric()
            .withMessage('El adelanto debe ser un número'),
    
    check('permisos')
        .isNumeric()
            .withMessage('Los permisos deben ser un número'),
    
    check('multas')
        .isNumeric()
            .withMessage('Las multas deben ser un número'),
    
    check('atrasos')
        .isNumeric()
            .withMessage('Los atrasos deben ser un número'),
    
    check('justificacion')
        .optional({ nullable: true, checkFalsy: true })
        .isString()
            .withMessage('La justificación debe ser un texto'),
    
    check('subtotal')
        .isNumeric()
            .withMessage('El subtotal debe ser un número'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors:errors.array() });
        }
        next();
    }
];