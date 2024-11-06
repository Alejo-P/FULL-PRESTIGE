// Importaciones iniciales
import app from "./server.js";
import { connect } from "./database.js";

// Puerto de la aplicación
const PORT = process.env.PORT || 3000;

// Inicialización de la aplicación
app.listen(PORT, () => {
    console.log(`Aplicación corriendo en ${process.env.URL_BACKEND}`);
    connect();
});