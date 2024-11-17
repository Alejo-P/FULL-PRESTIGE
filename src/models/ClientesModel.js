import { Schema, model } from 'mongoose';

const ClientesSchema = new Schema({
    cedula: {
        type: String,
        required: true,
        unique: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    correo: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export default model('Clientes', ClientesSchema);