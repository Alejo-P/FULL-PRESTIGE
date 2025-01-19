import bcrypt from "bcrypt";
import fs from "fs-extra";
import path from "path";

import {
    register,
    login,
    getEmployee,
    getEmployees,
    updateEmployee,
    getProfile,
    getSessions,
    logout,
    logoutAll,
    logoutSpecific
} from "../../src/controllers/EmpleadosController.js";
import empleadosModel from "../../src/models/EmpleadosModel.js";
import { sendMailToUser } from "../../src/config/nodeMailer.js";
import generarJWT from "../../src/helpers/JWT.js";
import { initTests, UNIT_TESTS_PATH } from "../testsConfig.js";

// Mocks de datos
import { EmpleadosMock } from "../helpers/mock_unittest.js";

jest.mock("../../src/models/EmpleadosModel.js"); // Mockear el modelo de empleados
jest.mock("../../src/config/nodeMailer.js"); // Mockear el envio de correos
jest.mock("../../src/helpers/JWT.js"); // Mockear la generación de JWT
jest.mock("bcrypt"); // Mockear la encriptación de contraseñas

// Ruta a este archivo: BackEnd/tests/integration/server.test.js
const LOGS_PATH = path.join(UNIT_TESTS_PATH, "EmpleadosController", "Test_results.log");
const logs = [];
let response_ctrl = {};

// Mock de la respuesta del controlador
const getMockRes = () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    return res;
};

beforeAll(() => {
    initTests();
    fs.ensureDirSync(path.join(UNIT_TESTS_PATH, "EmpleadosController")); // Crear el directorio de las pruebas unitarias
    fs.writeFileSync(LOGS_PATH, "", "utf-8"); // Limpiar el archivo de logs
});

afterEach(() => {
    try {
        // Capturar detalles de la prueba actual
        const testInfo = expect.getState();
        const log = {
            testName: testInfo.currentTestName,
            status: response_ctrl.status?.mock?.calls?.[0]?.[0] || "N/A",
            response: response_ctrl.json?.mock?.calls?.[0]?.[0] || "N/A"
        };
        logs.push(log);

        // Registrar en el archivo de logs
        fs.appendFileSync(LOGS_PATH, `${JSON.stringify(log, null, 4)}\n`, "utf-8");
    } catch (error) {
        // Si ocurre un error al capturar logs
        fs.appendFileSync(LOGS_PATH, `Error al capturar log: ${error.message}\n`, "utf-8");
    } finally {
        // Restaurar el estado del mock
        response_ctrl = {};
    }
});

afterAll(() => {
    fs.appendFileSync(LOGS_PATH, "#" + "-".repeat(50) + "#\n", "utf-8");
});

// Pruebas a los controladores de empleados
describe('(Controlador) Registrar un empleado', () => {
    beforeEach(() => {
        empleadosModel.mockClear();
        sendMailToUser.mockClear();
        bcrypt.hash.mockClear();
    });

    it('Debería registrar un empleado', async () => {
        // Mock de los datos de la base de datos
        empleadosModel.findOne.mockResolvedValue(null); // Simula que no hay duplicados
        empleadosModel.prototype.save = jest.fn().mockResolvedValue(); // Mock del método save
        bcrypt.genSaltSync.mockReturnValue("salt"); // Mock de la generación de salt
        bcrypt.hashSync.mockReturnValue("hashed_password"); // Mock de la encriptación de contraseñas
        sendMailToUser.mockResolvedValue(); // Mock del servicio de correo

        const mockReq = {body: EmpleadosMock.validEmpleado}; // Datos del empleado
        const mockRes = getMockRes(); // Mock de la respuesta

        await register(mockReq, mockRes);
        response_ctrl = mockRes;

        // Verifica las expectativas
        expect(empleadosModel.findOne).toHaveBeenCalledTimes(2); // Se llama dos veces (cédula y correo)
        expect(empleadosModel.prototype.save).toHaveBeenCalledTimes(1); // Se guarda el empleado
        expect(bcrypt.hashSync).toHaveBeenCalledWith("Ju@n123p.", "salt"); // Se encripta la contraseña
        // expect(sendMailToUser).toHaveBeenCalledWith(
        //     "juanperez77@gmail.com",
        //     expect.any(Object)
        // );
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "Empleado registrado exitosamente" })
        );
    });

    it("Debería devolver un error si falta un campo", async () => {
        const mockReq = {body: EmpleadosMock.invalidEmpleado};
        const mockRes = getMockRes();

        await register(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "Todos los campos son requeridos" })
        );
    });
    
    it("Debería devolver un error si la cédula ya está registrada", async () => {
        empleadosModel.findOne
            .mockResolvedValueOnce({ cedula: "1234567890" }) // Para cédula
            .mockResolvedValueOnce(null); // Para correo

        //empleadosModel.findOne.mockResolvedValue({ cedula: "1234567890" }); // Simula que existe un usuario con la misma cédula
        
        const mockReq = {body: EmpleadosMock.validEmpleado};
        const mockRes = getMockRes();
        
        await register(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(empleadosModel.findOne).toHaveBeenCalledTimes(3); // Solo busca por cédula
        expect(empleadosModel.findOne).toHaveBeenCalledWith({ cedula: "1234567890" });
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "La cédula ya se encuentra registrada" })
        );
    });
    
    it("Debería devolver un error 500 si ocurre un error inesperado", async () => {
        empleadosModel.findOne.mockRejectedValue(new Error("Error inesperado"));
        
        const mockReq = { body: EmpleadosMock.validEmpleado };
        const mockRes = getMockRes();
        
        await register(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Error al registrar empleado",
                error: "Error inesperado"
            })
        );
    });    
});

describe('(Controlador) Iniciar sesión de un empleado', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it("Debería iniciar sesión de un empleado", async () => {
        empleadosModel.findOne.mockResolvedValue(EmpleadosMock.validEmpleado); // Simula que el empleado existe
        bcrypt.compareSync.mockReturnValue(true); // Simula que la contraseña es correcta
        generarJWT.mockReturnValue("token"); // Simula la generación de un token
        
        const mockReq = {
            body: {
                correo: EmpleadosMock.validEmpleado.correo,
                contrasena: EmpleadosMock.validEmpleado.contrasena
            }
        };
        const mockRes = getMockRes();
        
        await login(mockReq, mockRes);
        response_ctrl = mockRes;

        expect(empleadosModel.findOne).toHaveBeenCalledTimes(1); // Busca al empleado
        expect(bcrypt.compareSync).toHaveBeenCalledWith("Ju@n123p.", "hashed_password"); // Compara las contraseñas
        expect(mockRes.status).toHaveBeenCalledWith(200); // Respuesta exitosa
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "Inicio de sesión exitoso" })
        );
    });

    it("Debería devolver un error si falta un campo", async () => {
        const mockReq = {
            body: {
                correo: EmpleadosMock.validEmpleado.correo,
                contrasena: ""
            }
        };
        const mockRes = getMockRes();
        
        await login(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "Todos los campos son requeridos" })
        );
    });

    it("Debería devolver un error si el correo no está registrado", async () => {
        empleadosModel.findOne.mockResolvedValue(null); // Simula que el empleado no existe
        
        const mockReq = {
            body: {
                correo: EmpleadosMock.validEmpleado.correo,
                contrasena: EmpleadosMock.validEmpleado.contrasena
            }
        };
        const mockRes = getMockRes();
        
        await login(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(empleadosModel.findOne).toHaveBeenCalledTimes(1); // Busca al empleado
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "El correo ingresado es incorrecto" })
        );
    });

    it("Debería devolver un error si la contraseña es incorrecta", async () => {
        empleadosModel.findOne.mockResolvedValue(EmpleadosMock.validEmpleado); // Simula que el empleado existe
        bcrypt.compare.mockResolvedValue(false); // Simula que la contraseña es incorrecta
        
        const mockReq = {
            body: {
                correo: EmpleadosMock.validEmpleado.correo,
                contrasena: EmpleadosMock.validEmpleado.contrasena
            }
        };
        const mockRes = getMockRes();
        
        await login(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(empleadosModel.findOne).toHaveBeenCalledTimes(1); // Busca al empleado
        expect(bcrypt.compare).toHaveBeenCalledWith("Ju@n123p.", "hashed_password"); // Compara las contraseñas
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "Correo o contraseña incorrectos" })
        );
    });

    it("Debería devolver un error 500 si ocurre un error inesperado", async () => {
        empleadosModel.findOne.mockRejectedValue(new Error("Error inesperado"));
        
        const mockReq = {
            body: {
                correo: EmpleadosMock.validEmpleado.correo,
                contrasena: EmpleadosMock.validEmpleado.contrasena
            }
        };
        const mockRes = getMockRes();
        
        await login(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Error al iniciar sesión",
                error: "Error inesperado"
            })
        );
    });

    it("Debería devolver un error si el empleado está inactivo", async () => {
        empleadosModel.findOne.mockResolvedValue({ ...EmpleadosMock.validEmpleado, estado: false });
        
        const mockReq = {
            body: {
                correo: EmpleadosMock.validEmpleado.correo,
                contrasena: EmpleadosMock.validEmpleado.contrasena
            }
        };
        const mockRes = getMockRes();
        
        await login(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "El empleado se encuentra inactivo" })
        );
    });
});

describe('(Controlador) Obtener un empleado', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Debería obtener un empleado", async () => {
        empleadosModel.findById.mockResolvedValue(EmpleadosMock.validEmpleado); // Simula que el empleado existe
        
        const mockReq = { params: { id: "123" } };
        const mockRes = getMockRes();
        
        await getEmployee(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(empleadosModel.findById).toHaveBeenCalledTimes(1); // Busca al empleado
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ empleado: EmpleadosMock.validEmpleado })
        );
    });

    it("Debería devolver un error si el empleado no existe", async () => {
        empleadosModel.findById.mockResolvedValue(null); // Simula que el empleado no existe
        
        const mockReq = { params: { id: "123" } };
        const mockRes = getMockRes();
        
        await getEmployee(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(empleadosModel.findById).toHaveBeenCalledTimes(1); // Busca al empleado
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "Empleado no encontrado" })
        );
    });

    it("Debería devolver un error 500 si ocurre un error inesperado", async () => {
        empleadosModel.findById.mockRejectedValue(new Error("Error inesperado"));
        
        const mockReq = { params: { id: "123" } };
        const mockRes = getMockRes();
        
        await getEmployee(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Error al obtener empleado",
                error: "Error inesperado"
            })
        );
    });
});

describe('(Controlador) Obtener todos los empleados', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Debería obtener todos los empleados", async () => {
        empleadosModel.find.mockResolvedValue(EmpleadosMock.listEmpleados); // Simula que hay empleados
        
        const mockReq = {};
        const mockRes = getMockRes();
        
        await getEmployees(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(empleadosModel.find).toHaveBeenCalledTimes(1); // Busca a los empleados
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ empleados: EmpleadosMock.listEmpleados })
        );
    });

    it("Debería devolver un error 500 si ocurre un error inesperado", async () => {
        empleadosModel.find.mockRejectedValue(new Error("Error inesperado"));
        
        const mockReq = {};
        const mockRes = getMockRes();
        
        await getEmployees(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Error al obtener empleados",
                error: "Error inesperado"
            })
        );
    });
});

describe('(Controlador) Actualizar un empleado', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Debería actualizar un empleado", async () => {
        empleadosModel.findByIdAndUpdate.mockResolvedValue(EmpleadosMock.validEmpleado); // Simula que el empleado existe
        
        const mockReq = { params: { id: "123" }, body: EmpleadosMock.validEmpleado };
        const mockRes = getMockRes();
        
        await updateEmployee(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(empleadosModel.findByIdAndUpdate).toHaveBeenCalledTimes(1); // Actualiza al empleado
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "Empleado actualizado exitosamente" })
        );
    });

    it("Debería devolver un error si el empleado no existe", async () => {
        empleadosModel.findByIdAndUpdate.mockResolvedValue(null); // Simula que el empleado no existe
        
        const mockReq = { params: { id: "123" }, body: EmpleadosMock.validEmpleado };
        const mockRes = getMockRes();
        
        await updateEmployee(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(empleadosModel.findByIdAndUpdate).toHaveBeenCalledTimes(1); // Actualiza al empleado
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "Empleado no encontrado" })
        );
    });

    it("Debería devolver un error 500 si ocurre un error inesperado", async () => {
        empleadosModel.findByIdAndUpdate.mockRejectedValue(new Error("Error inesperado"));
        
        const mockReq = { params: { id: "123" }, body: EmpleadosMock.validEmpleado };
        const mockRes = getMockRes();
        
        await updateEmployee(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Error al actualizar empleado",
                error: "Error inesperado"
            })
        );
    });
});

describe('(Controlador) Obtener perfil de un empleado', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Debería obtener el perfil de un empleado", async () => {
        empleadosModel.findById.mockResolvedValue(EmpleadosMock.validEmpleado); // Simula que el empleado existe
        
        const mockReq = { empleado: EmpleadosMock.validEmpleado };
        const mockRes = getMockRes();
        
        await getProfile(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(empleadosModel.findById).toHaveBeenCalledTimes(1); // Busca al empleado
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ empleado: EmpleadosMock.validEmpleado })
        );
    });

    it("Debería devolver un error si el empleado no existe", async () => {
        empleadosModel.findById.mockResolvedValue(null); // Simula que el empleado no existe
        
        const mockReq = { empleado: EmpleadosMock.validEmpleado };
        const mockRes = getMockRes();
        
        await getProfile(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(empleadosModel.findById).toHaveBeenCalledTimes(1); // Busca al empleado
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "Empleado no encontrado" })
        );
    });

    it("Debería devolver un error 500 si ocurre un error inesperado", async () => {
        empleadosModel.findById.mockRejectedValue(new Error("Error inesperado"));
        
        const mockReq = { empleado: EmpleadosMock.validEmpleado };
        const mockRes = getMockRes();
        
        await getProfile(mockReq, mockRes);
        response_ctrl = mockRes;
        
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Error al obtener perfil",
                error: "Error inesperado"
            })
        );
    });
});