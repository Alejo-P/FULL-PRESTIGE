// Importaciones iniciales
import app from "./server.js";
import { connect } from "./database.js";

// Puerto de la aplicación
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";

// Inicialización de la aplicación
app.listen(PORT, () => {
    console.log(`Aplicación corriendo en ${process.env.URL_BACKEND}`);
    console.log(`Documentacion en: ${process.env.URL_BACKEND}/api-docs`);
    console.log("Ambiente:", ENV);
    connect();
});