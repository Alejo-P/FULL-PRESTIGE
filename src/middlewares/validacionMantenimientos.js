import { check, validationResult } from 'express-validator';

export const validacionMantenimientos = [
    check(['placa', 'descripcion', 'costo', 'cedula_encargado', 'descripcion', 'estado'])
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
    
    check("cedula_encargado")
        .isString()
            .withMessage("El campo 'cedula_encargado' debe ser una cadena de texto")
        .isLength({ min: 10, max: 10 })
            .withMessage("La cédula del encargado debe tener 10 caracteres")
        .matches(/^[0-9]+$/)
            .withMessage("La cédula del encargado solo puede contener números"),

    check("descripcion")
        .isString()
            .withMessage("El campo 'detalles' debe ser una cadena de texto"),
    
    check("estado")
        .isString()
            .withMessage("El campo 'estado' debe ser una cadena de texto")
        .isIn(['Pendiente', 'En Proceso', 'Finalizado'])
            .withMessage("El campo 'estado' solo puede tener los valores 'Pendiente', 'En Proceso' o 'Finalizado'"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];