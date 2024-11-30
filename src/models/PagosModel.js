import { Schema, model } from "mongoose";

const PagosSchema = new Schema({
    adelanto: {
        type: Number,
        required: true,
    },
    permisos: {
        type: Number,
        required: true,
    },
    multas: {
        type: Number,
        required: true,
    },
    atrasos: {
        type: Number,
        required: true,
    },
    justificacion: {
        type: String,
        default: "",
    },
    subtotal: {
        type: Number,
        required: true,
    },
    empleado: {
        type: Schema.Types.ObjectId,
        ref: "Empleados",
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false,
});

export default model("Pagos", PagosSchema);