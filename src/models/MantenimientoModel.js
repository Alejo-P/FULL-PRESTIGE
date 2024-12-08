import { Schema, model } from "mongoose";

const MantenimientosSchema = new Schema({
    vehiculo: {
        type: Schema.Types.ObjectId,
        ref: "Vehiculos",
        required: true,
    },
    encargado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleados',
        required: true,
    },
    descripcion: {
        type: String,
        default: '',
    },
    costo: {
        type: Number,
        default: 0,
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'En Proceso', 'Finalizado'],
        default: 'Pendiente',
    },
},{
    timestamps: true,
});

export default model("Mantenimientos", MantenimientosSchema);