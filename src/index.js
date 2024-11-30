// Importaciones iniciales
import app from "./server.js";
import { connect_prod } from "./database.js";

// Puerto de la aplicación
const PORT = process.env.PORT || 3000;

// Inicialización de la aplicación
app.listen(PORT, () => {
    console.log(`Aplicación corriendo en ${process.env.URL_BACKEND}`);
    console.log(`Documentacion en: ${process.env.URL_BACKEND}/api-docs`);
    connect_prod();
});