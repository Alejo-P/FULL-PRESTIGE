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
import EmpleadosModel from "../../src/models/EmpleadosModel.js";
import { sendMailToUser } from "../../src/config/nodeMailer";
import bcrypt from "bcrypt";

// Mocks de datos
import { EmpleadosMock } from "../helpers/mock_unittest.js";

jest.mock("../../src/models/EmpleadosModel.js"); // Mockear el modelo de empleados
jest.mock("../../src/config/nodeMailer.js"); // Mockear el envio de correos
jest.mock("bcrypt"); // Mockear la encriptación de contraseñas

// Pruebas a los controladores de empleados
describe('(Controlador) Registrar un empleado', () => {
    beforeEach(() => {
        EmpleadosModel.mockClear();
        sendMailToUser.mockClear();
        bcrypt.hash.mockClear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Debería registrar un empleado', async () => {
        // Mock de los datos de la base de datos
        EmpleadosModel.findOne.mockResolvedValue(null); // Simula que no hay duplicados
        EmpleadosModel.prototype.save = jest.fn().mockResolvedValue(); // Mock del método save
        bcrypt.genSaltSync.mockReturnValue("salt"); // Mock de la generación de salt
        bcrypt.hashSync.mockReturnValue("hashed_password"); // Mock de la encriptación de contraseñas
        sendMailToUser.mockResolvedValue(); // Mock del servicio de correo

        const mockReq = {body: EmpleadosMock.validEmpleado}; // Datos del empleado

        const mockRes = {
            status: jest.fn().mockReturnThis(), // Mockear el status
            json: jest.fn() // Mockear el json
        }

        await register(mockReq, mockRes);

        // Verifica las expectativas
        expect(EmpleadosModel.findOne).toHaveBeenCalledTimes(2); // Se llama dos veces (cédula y correo)
        expect(EmpleadosModel.prototype.save).toHaveBeenCalledTimes(1); // Se guarda el empleado
        expect(bcrypt.hashSync).toHaveBeenCalledWith("Ju@n123p.", "salt"); // Se encripta la contraseña
        expect(sendMailToUser).toHaveBeenCalledWith(
            "juanperez77@gmail.com",
            expect.any(Object)
        );
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "Empleado registrado exitosamente" })
        );
    });

    it("Debería devolver un error si falta un campo", async () => {
        const mockReq = {body: EmpleadosMock.invalidEmpleado};

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await register(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "Todos los campos son requeridos" })
        );
    });

    it("Debería devolver un error si la cédula ya está registrada", async () => {
        EmpleadosModel.findOne.mockResolvedValue({ cedula: "1234567890" }); // Simula que existe un usuario con la misma cédula

        const mockReq = {body: EmpleadosMock.validEmpleado};

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await register(mockReq, mockRes);

        expect(EmpleadosModel.findOne).toHaveBeenCalledTimes(1); // Solo busca por cédula
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "La cédula ya se encuentra registrada" })
        );
    });

    it("Debería devolver un error 500 si ocurre un error inesperado", async () => {
        EmpleadosModel.findOne.mockRejectedValue(new Error("Error inesperado"));
    
        const mockReq = { body: EmpleadosMock.validEmpleado };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        await register(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Error al registrar empleado",
                error: "Error inesperado"
            })
        );
    });    
});