import { Schema, model } from "mongoose";

const PagosSchema = new Schema({
    adelanto: {
        type: Number,
        required: true,
    },
    permisos: {
        type: String,
        required: true,
    },
    multas: {
        type: String,
        required: true,
    },
    atrasos: {
        type: String,
        required: true,
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