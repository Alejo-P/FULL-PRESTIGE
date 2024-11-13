import { Schema, model } from "mongoose";

const MantenimientosSchema = new Schema({
    vehiculo: {
        type: Schema.Types.ObjectId,
        ref: "Vehiculos",
        required: true,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    costo: {
        type: Number,
        required: true,
    },
},{
    timestamps: true,
});

export default model("Mantenimientos", MantenimientosSchema);