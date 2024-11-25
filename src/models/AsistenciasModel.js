import { Schema, model } from "mongoose";

const AsistenciasSchema = new Schema({
    fecha: {
        type: Date,
        require: true
    },
    hora_ingreso: {
        type: String,
        default: null
    },
    hora_salida: {
        type: String,
        default: null
    },
    empleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleados',
        required: true
    },
    estado: {
        type: String,
        enum: ['Presente', 'Ausente'],
        default: 'Presente'
    }
}, {
    timestamps: true
});

export default model("Asistencias", AsistenciasSchema);