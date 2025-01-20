import { Schema, model } from "mongoose";

const PagosSchema = new Schema({
    adelanto: {
        type: Number,
        //required: true,
        default: null,
    },
    permisos: {
        type: Number,
        //required: true,
        default: null,
    },
    multas: {
        type: Number,
        //required: true,
        default: null,
    },
    atrasos: {
        type: Number,
        //required: true,
        default: null,
    },
    justificacion: {
        type: String,
        default: "",
    },
    fecha: {
        type: Date,
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