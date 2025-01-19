import path from 'path';
import fs from 'fs-extra';

const OUTPUTS_DIR = path.join(__dirname, 'outputs');

export const INTEGRATION_TESTS_PATH = path.join(OUTPUTS_DIR, "integrationTests");

export const UNIT_TESTS_PATH = path.join(OUTPUTS_DIR, "unitTests");

export function initTests() {
    // Crear el directorio de salida si no existe
    fs.ensureDirSync(OUTPUTS_DIR);

    // Crear las rutas de los archivos de salida para las pruebas unitarias
    fs.ensureDirSync(UNIT_TESTS_PATH);

    // Crear las rutas de los archivos de salida para las pruebas de integración
    fs.ensureDirSync(INTEGRATION_TESTS_PATH);
}

