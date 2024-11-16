import { Schema, model } from "mongoose";

const EmpledosSchema = new Schema({
    cedula: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    contrasena: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true,
        enum: ['Administrador', 'Gerente', 'Técnico']
    },
    correo: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    token: {
        type: String,
        default: null
    },
    direccion: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default model("Empleados", EmpledosSchema);