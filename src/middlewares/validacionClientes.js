import { check, validationResult } from 'express-validator';

export const validacionClientes = [
    check(['nombre', 'cedula', 'correo', 'telefono', 'direccion', 'orden', 'placa', 'marca', 'modelo', 'fecha_ingreso', 'tecnico', 'descripcion'])
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
            .withMessage('El campo "cedula" debe ser una cadena de texto'),

    check('correo')
        .isEmail()
            .withMessage('El campo "correo" debe ser un correo electrónico'),

    check('telefono')
        .isLength({ min: 10, max: 10 })
            .withMessage('El campo "telefono" debe tener 10 caracteres')
        .isString()
            .withMessage('El campo "telefono" debe ser una cadena de texto'),

    check('direccion')
        .isString()
            .withMessage('El campo "direccion" debe ser una cadena de texto'),

    check('orden')
        .isString()
            .withMessage('El campo "orden" debe ser una cadena de texto'),

    check('placa')
        .isString()
            .withMessage('El campo "placa" debe ser una cadena de texto'),

    check('marca')
        .isString()
            .withMessage('El campo "marca" debe ser una cadena de texto'),

    check('modelo')
        .isString()
            .withMessage('El campo "modelo" debe ser una cadena de texto'),

    check('fecha_ingreso')
        .isISO8601()
            .withMessage('El campo "fecha_ingreso" debe ser una fecha válida')
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

    check('tecnico')
        .isString()
            .withMessage('El campo "tecnico" debe ser una cadena de texto'),

    check('descripcion')
        .isString()
            .withMessage('El campo "descripcion" debe ser una cadena de texto'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];