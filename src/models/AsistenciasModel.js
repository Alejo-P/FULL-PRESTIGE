import { Schema, model } from "mongoose";

const AsistenciasSchema = new Schema({
    fecha: {
        type: Date,
        require: true
    },
    hora_ingreso: {
        type: String,
        required: true
    },
    hora_salida: {
        type: String,
        required: true
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