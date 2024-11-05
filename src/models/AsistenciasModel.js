import { Schema, model } from "mongoose";

const AsistenciasSchema = new Schema({
    
    tiempo_ingreso: {
        type: Date,
        required: true
    },
    tiempo_salida: {
        type: Date,
        required: true
    },
    observaciones: {
        type: String,
        default: null
    },
    empleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleados',
        required: true
    }
}, {
    timestamps: true
});

export default model("Asistencias", AsistenciasSchema);