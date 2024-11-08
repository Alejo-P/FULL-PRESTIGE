import { check, validationResult } from 'express-validator';

export const validacionRegistro_empleado = [
    check(['nombre', 'correo', 'direccion', 'cargo', 'cedula', 'edad', 'contrasena'])
        .exists()
            .withMessage('Todos los campos son requeridos')
        .notEmpty()
            .withMessage('No puede enviar campos vacíos'),
    
    check('cedula')
        .customSanitizer(value => typeof value === 'string' ? value.trim() : value)
        .isLength({ min: 10, max: 10 })
            .withMessage('La cédula debe tener 10 caracteres')
        .isNumeric()
            .withMessage('La cédula debe ser un número'),
    
    check('nombre')
        .customSanitizer(value => typeof value === 'string' ? value.trim() : value)
        .isLength({ min: 7, max: 20 })
            .withMessage('El campo "nombre" y/o "apellido" debe(n) tener entre 7 y 20 caracteres')
        .isAlpha('es-ES', { ignore: ' áéíóúÁÉÍÓÚñÑ' })
            .withMessage('El campo "nombre" y/o "apellido" debe(n) contener solo letras'),
    
    check('correo')
        .customSanitizer(value => typeof value === 'string' ? value.trim() : value)
        .isEmail()
            .withMessage('Ingrese un correo válido'),

    check('edad')
        .isInt({ min: 18, max: 99 })
            .withMessage('La edad debe ser un número entre 18 y 99'),
    
    check('cargo')
        .customSanitizer(value => typeof value === 'string' ? value.trim() : value)
        .isIn(['Administrador', 'Gerente', 'Tecnico'])
            .withMessage('El campo "cargo" debe ser uno de los siguientes: Administrador, Gerente, Tecnico'),
    
    check("direccion")
        .customSanitizer(value => typeof value === 'string' ? value.trim() : value)
        .isLength({ min: 5, max: 20 })
            .withMessage('El campo "dirección" debe tener entre 5 y 20 caracteres'),
    
    check("password")
        .customSanitizer(value => typeof value === 'string' ? value.trim() : value)
        .isLength({ min: 5 })
            .withMessage('El campo "password" debe tener al menos 5 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*).*$/)
            .withMessage('El campo "password" debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors:errors.array() });
        }
        next();
    },
];

export const validacionActualizacion_empleado = [
    check(['nombre', 'correo', 'direccion', 'cargo', 'edad'])
        .exists()
            .withMessage('Todos los campos son requeridos')
        .notEmpty()
            .withMessage('No puede enviar campos vacíos'),
    
    check('nombre')
        .customSanitizer(value => typeof value === 'string' ? value.trim() : value)
        .isLength({ min: 7, max: 20 })
            .withMessage('El campo "nombre" y/o "apellido" debe(n) tener entre 7 y 20 caracteres')
        .isAlpha('es-ES', { ignore: ' áéíóúÁÉÍÓÚñÑ' })
            .withMessage('El campo "nombre" y/o "apellido" debe(n) contener solo letras'),
    
    check('correo')
        .customSanitizer(value => typeof value === 'string' ? value.trim() : value)
        .isEmail()
            .withMessage('Ingrese un correo válido'),

    check('edad')
        .isInt({ min: 18, max: 99 })
            .withMessage('La edad debe ser un número entre 18 y 99'),
    
    check('cargo')
        .customSanitizer(value => typeof value === 'string' ? value.trim() : value)
        .isIn(['Administrador', 'Gerente', 'Tecnico'])
            .withMessage('El campo "cargo" debe ser uno de los siguientes: Administrador, Gerente, Tecnico'),
    
    check("direccion")
        .customSanitizer(value => typeof value === 'string' ? value.trim() : value)
        .isLength({ min: 5, max: 20 })
            .withMessage('El campo "dirección" debe tener entre 5 y 20 caracteres'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors:errors.array() });
        }
        next();
    },
];