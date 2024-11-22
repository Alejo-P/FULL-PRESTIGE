import { Schema, model } from 'mongoose';

const VehiculosSchema = new Schema({
    placa: {
        type: String,
        required: true,
        unique: true,
    },
    n_orden: {
        type: String,
        required: true,
    },
    marca: {
        type: String,
        required: true,
    },
    modelo: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        enum: ['Finalizado', 'En proceso', 'Entregado', 'Pendiente'],
        default: 'Pendiente'
    },
    propietario: {
        type: Schema.Types.ObjectId,
        ref: 'Clientes',
        required: true,
    },
    fecha_ingreso: {
        type: Date,
        required: true,
    },
    fecha_salida: {
        type: Date,
        default: null,
    },
    encargado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleados',
        required: true,
    },
    detalles: {
        type: String,
        required: true,
    },
},{
    timestamps: true,
});

export default model('Vehiculos', VehiculosSchema);