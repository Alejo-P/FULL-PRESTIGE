import request from "supertest";
import fs from "fs";
import path from "path";

import app from "../src/server.js";
import { connect, disconnect } from "../src/database.js";
import { env } from "./env.js";
import { generateHTML } from "./createHTML.js";

const LOGS_PATH = path.join(__dirname, "logs.txt");
const HTML_PATH = path.join(__dirname, "results.html");
const logs = [];
let response_api = {};

beforeAll(async () => {
    // Conectar a la base de datos en memoria antes de ejecutar las pruebas
    await connect();

    // Crear un archivo de logs para las pruebas
    fs.writeFileSync(LOGS_PATH, "Resultados de la prueba\n", "utf-8");
}, 30000);

afterEach(async () => {
    // Escribir los resultados de las pruebas en el archivo de logs
    const testInfo = expect.getState();

    // Calcular el estado de la prueba basado en las afirmaciones realizadas
    const status = testInfo.numPassingAsserts > 0 ? "passed" : response_api.status >= 400 ? "failed" : "unknown";

    const log = {
        nombre: testInfo.currentTestName,
        ruta: testInfo.testPath,
        estado: status,
        endpoint: `${response_api.request?.method || "N/A"} ${response_api.request?.url || "N/A"}`,
        http_status: response_api.status || "N/A",
        resultado: response_api.body || "N/A"
    };
    logs.push(log);

    // Reiniciar la variable para la próxima prueba
    response_api = {};
});

afterAll(async () => {
    // Desconectar de la base de datos en memoria después de las pruebas
    await disconnect();
    let logs_escritos = 0;

    // Escribir los resultados de las pruebas en el archivo de logs
    logs.forEach(log => {
        // Solo escribir en el archivo los logs de las pruebas que fallaron
        if (log.estado === "failed" || log.estado === "unknown") {
            logs_escritos++;
            fs.appendFileSync(LOGS_PATH, JSON.stringify(log, null, 4) + "\n", "utf-8");
        }
    });
    // Escribir la tabla html en un archivo
    generateHTML(logs, HTML_PATH);

    // Escribir un salto de línea en el archivo de logs
    fs.appendFileSync(LOGS_PATH, "\n", "utf-8");

    // Escribir el numero total de pruebas exitosas sobre el total de pruebas en el archivo
    fs.appendFileSync(LOGS_PATH, `Pruebas exitosas: ${logs.filter(log => log.estado === "passed").length}/${logs.length}\n`, "utf-8");
    
    // Escribir el número total de pruebas fallidas sobre el total de pruebas en el archivo
    fs.appendFileSync(LOGS_PATH, `Pruebas fallidas: ${logs.filter(log => log.estado === "failed").length}/${logs.length}\n`, "utf-8");
    
    // Escribir el número total de pruebas desconocidas sobre el total de pruebas en el archivo
    fs.appendFileSync(LOGS_PATH, `Pruebas desconocidas: ${logs.filter(log => log.estado === "unknown").length}/${logs.length}\n`, "utf-8");

    // Escribir el número total de pruebas en el archivo
    fs.appendFileSync(LOGS_PATH, `Total de pruebas: ${logs.length}\n`, "utf-8");
    
    // Si no hay logs de pruebas fallidas, escribir un mensaje en el archivo
    if (logs_escritos === 0) {
        fs.appendFileSync(LOGS_PATH, "Todas las pruebas pasaron exitosamente\n", "utf-8");
    }

    // Limpiar la variable de logs
    logs.length = 0;
}, 30000);

describe("GET /", () => {
    it("should return 200 OK", async () => {
        const response = await request(app).get("/");

        response_api = response;
        expect(response.status).toBe(200);
    });
});

/*-------------------------#Rutas para empleados#-------------------------*/
describe("POST /api/v1/register - Administrador", () => {
    it("should return 201 Created", async () => {
        const response = await request(app)
            .post("/api/v1/register")
            .send(env.adminUser);
        
        response_api = response;
        expect(response.status).toBe(201);
    });

    it("should return 400 Bad Request", async () => {
        const cedula_temp = env.adminUser.cedula;
        env.adminUser.cedula = "";
        const response = await request(app)
            .post("/api/v1/register")
            .send(env.adminUser);
        
        env.adminUser.cedula = cedula_temp;
        response_api = response;
        expect(response.status).toBe(400);
    });
}, 5000);

describe("POST /api/v1/register - Empleado", () => {
    it("should return 201 Created", async () => {
        const response = await request(app)
            .post("/api/v1/register")
            .send(env.empleadoUser);

        response_api = response;
        expect(response.status).toBe(201);
    });

    it("should return 400 Bad Request", async () => {
        const cedula_temp = env.empleadoUser.cedula;
        env.empleadoUser.cedula = "";
        const response = await request(app)
            .post("/api/v1/register")
            .send(env.empleadoUser);
        
        env.empleadoUser.cedula = cedula_temp;
        response_api = response;
        expect(response.status).toBe(400);
    });
}, 5000);

describe("POST /api/v1/login", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .post("/api/v1/login")
            .send(env.adminUser);
        
        env.setToken(response.body.empleado.token);
        response_api = response;
        expect(response.status).toBe(200);
    });

    it("should return 400 Bad Request", async () => {
        const correo_temp = env.adminUser.correo;
        env.adminUser.correo = "";
        const response = await request(app)
            .post("/api/v1/login")
            .send(env.adminUser);
        
        env.adminUser.correo = correo_temp;
        response_api = response;
        expect(response.status).toBe(400);
    });
}, 5000);

describe("GET /api/v1/employees", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get("/api/v1/employees")
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        expect(response.status).toBe(200);
    });
});

describe("GET /api/v1/employee/:cedula", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get(`/api/v1/employee/${env.empleadoUser.cedula}`)
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        expect(response.status).toBe(200);
    });
});

describe("PUT /api/v1/employee/:cedula", () => {
    it("should return 200 OK", async () => {
        env.actualizarInfoEmpleado();
        const response = await request(app)
            .put(`/api/v1/employee/${env.empleadoUser.cedula}`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.empleadoUser);
        
        response_api = response;
        expect(response.status).toBe(200);
    });

    it("should return 404 Bad Request", async () => {
        const cedula_temp = env.empleadoUser.cedula;
        env.empleadoUser.cedula = "";
        const response = await request(app)
            .put(`/api/v1/employee/${env.empleadoUser.cedula}`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.empleadoUser);
        
        env.empleadoUser.cedula = cedula_temp;
        response_api = response;
        expect(response.status).toBe(404);
    });
});

describe("GET /api/v1/profile", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get("/api/v1/profile")
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        expect(response.status).toBe(200);
    });
});

describe("PUT /api/v1/profile", () => {
    it("should return 200 OK", async () => {
        env.actualizarInfoAdmin();
        const response = await request(app)
            .put("/api/v1/profile")
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.adminUser);
        
        response_api = response;
        expect(response.status).toBe(200);
    });

    it("should return 404 Bad Request", async () => {
        const correo_temp = env.adminUser.correo;
        env.adminUser.correo = "";
        const response = await request(app)
            .put("/api/v1/profile")
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.adminUser);
        
        env.adminUser.correo = correo_temp;
        response_api = response;
        expect(response.status).toBe(404);
    });
});

describe("PUT /api/v1/profile/update-password", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .put("/api/v1/profile/update-password")
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.cambiarContrasenaAdmin());
        
        response_api = response;
        expect(response.status).toBe(200);
    });

    it("should return 404 Bad Request", async () => {
        const datos = env.cambiarContrasenaAdmin();
        datos.contrasena = "";
        const response = await request(app)
            .put("/api/v1/profile/update-password")
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(datos);
        
        response_api = response;
        expect(response.status).toBe(404);
    });
});

describe("POST /api/v1/employee/:cedula/assistance", () => {
    it("should return 201 Created", async () => {
        const response = await request(app)
            .post(`/api/v1/employee/${env.empleadoUser.cedula}/assistance`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.datosAsistenciaEmpleado());
        
        response_api = response;
        expect(response.status).toBe(201);
    });

    it("should return 400 Bad Request", async () => {
        const datos = env.datosAsistenciaEmpleado();
        datos.fecha = "";
        const response = await request(app)
            .post(`/api/v1/employee/${env.empleadoUser.cedula}/assistance`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(datos);
        
        response_api = response;
        expect(response.status).toBe(400);
    });
});

describe("GET /api/v1/employee/:cedula/assistance", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get(`/api/v1/employee/${env.empleadoUser.cedula}/assistance`)
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        env.idAsistencia = response.body[0]._id;
        expect(response.status).toBe(200);
    });
});

describe("PUT /api/v1/employee/assistance/:id", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .put(`/api/v1/employee/assistance/${env.idAsistencia}`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.datosAsistenciaEmpleado());
        
        response_api = response;
        expect(response.status).toBe(200);
    });

    it("should return 400 Bad Request", async () => {
        const datos = env.datosAsistenciaEmpleado();
        datos.fecha = "";
        const response = await request(app)
            .put(`/api/v1/employee/assistance/${env.idAsistencia}`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(datos);
        
        response_api = response;
        expect(response.status).toBe(400);
    });
});

describe("POST /api/v1/employee/:cedula/payments", () => {
    it("should return 201 Created", async () => {
        const response = await request(app)
            .post(`/api/v1/employee/${env.empleadoUser.cedula}/payments`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.datosPagoEmpleado());
        
        response_api = response;
        expect(response.status).toBe(201);
    });

    it("should return 400 Bad Request", async () => {
        const datos = env.datosPagoEmpleado();
        datos.fecha = "";
        const response = await request(app)
            .post(`/api/v1/employee/${env.empleadoUser.cedula}/payments`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(datos);
        
        response_api = response;
        expect(response.status).toBe(400);
    });
});

describe("GET /api/v1/employee/:cedula/payments", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get(`/api/v1/employee/${env.empleadoUser.cedula}/payments`)
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        env.idPago = response.body[0]._id;
        expect(response.status).toBe(200);
    });
});

describe("PUT /api/v1/employee/payment/:id", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .put(`/api/v1/employee/payment/${env.idPago}`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.datosPagoEmpleado());
        
        response_api = response;
        expect(response.status).toBe(200);
    });

    it("should return 400 Bad Request", async () => {
        const datos = env.datosPagoEmpleado();
        datos.fecha = "";
        const response = await request(app)
            .put(`/api/v1/employee/payment/${env.idPago}`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(datos);
        
        response_api = response;
        expect(response.status).toBe(400);
    });
});

describe("POST /api/v1/client", () => {
    it("should return 201 Created", async () => {
        const response = await request(app)
            .post("/api/v1/client")
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.clientInfo);
        
        response_api = response;
        expect(response.status).toBe(201);
    });

    it("should return 400 Bad Request", async () => {
        const datos = env.clientInfo;
        datos.cedula = "";
        const response = await request(app)
            .post("/api/v1/client")
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(datos);
        
        response_api = response;
        expect(response.status).toBe(400);
    });
});

describe("GET /api/v1/clients", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get("/api/v1/clients")
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        expect(response.status).toBe(200);
    });
});

describe("GET /api/v1/client/:cedula", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get(`/api/v1/client/${env.clientInfo.cedula}`)
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        expect(response.status).toBe(200);
    });
});

describe("PUT /api/v1/client/:cedula", () => {
    it("should return 200 OK", async () => {
        env.actualizarInfoCliente();
        const response = await request(app)
            .put(`/api/v1/client/${env.clientInfo.cedula}`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.clientInfo);
        
        response_api = response;
        expect(response.status).toBe(200);
    });

    it("should return 400 Bad Request", async () => {
        const datos = env.clientInfo;
        datos.nombre = "";
        const response = await request(app)
            .put(`/api/v1/client/${env.clientInfo.cedula}`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.clientInfo);
        
        response_api = response;
        expect(response.status).toBe(400);
    });
});

describe("POST /api/v1/vehicle", () => {
    it("should return 201 Created", async () => {
        env.vehicleInfo.setDates();
        const response = await request(app)
            .post("/api/v1/vehicle")
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send({
                n_orden: env.vehicleInfo.orden,
                ...env.vehicleInfo
            });
        
        response_api = response;
        expect(response.status).toBe(201);
    });

    it("should return 400 Bad Request", async () => {
        const placa_temp = env.vehicleInfo.placa;
        env.vehicleInfo.placa = "";
        const response = await request(app)
            .post("/api/v1/vehicle")
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send({
                n_orden: env.vehicleInfo.orden,
                ...env.vehicleInfo
            });
        
        env.vehicleInfo.placa = placa_temp;
        response_api = response;
        expect(response.status).toBe(400);
    });
});

describe("POST /api/v1/vehicle/assign", () => {
    it("should return 201 Created", async () => {
        const response = await request(app)
            .post("/api/v1/vehicle/assign")
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send({
                placa: env.vehicleInfo.placa,
                cedula_tecnico: env.empleadoUser.cedula
            });
        
        response_api = response;
        expect(response.status).toBe(201);
    });

    it("should return 400 Bad Request", async () => {
        const response = await request(app)
            .post("/api/v1/vehicle/assign")
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send({
                placa: env.vehicleInfo.placa,
                cedula_tecnico: ""
            });
        
        response_api = response;
        expect(response.status).toBe(400);
    });
});

describe("GET /api/v1/vehicles", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get("/api/v1/vehicles")
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        expect(response.status).toBe(200);
    });
});

describe("GET /api/v1/vehicles/client/:cedula", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get(`/api/v1/vehicles/client/${env.clientInfo.cedula}`)
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        expect(response.status).toBe(200);
    });
});

describe("GET /api/v1/vehicles/employee/:cedula", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get(`/api/v1/vehicles/employee/${env.empleadoUser.cedula}`)
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        expect(response.status).toBe(200);
    });
});

describe("GET /api/v1/vehicle/:placa", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get(`/api/v1/vehicle/${env.vehicleInfo.placa}`)
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        expect(response.status).toBe(200);
    });
});

describe("PUT /api/v1/vehicle/:placa", () => {
    it("should return 200 OK", async () => {
        env.actualizarInfoVehiculo();
        const response = await request(app)
            .put(`/api/v1/vehicle/${env.vehicleInfo.placa}`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.vehicleInfo);
        
        response_api = response;
        expect(response.status).toBe(200);
    });

    it("should return 400 Bad Request", async () => {
        const marca_temp = env.vehicleInfo.marca;
        env.vehicleInfo.marca = "";
        const response = await request(app)
            .put(`/api/v1/vehicle/${env.vehicleInfo.placa}`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.vehicleInfo);
        
        env.vehicleInfo.marca = marca_temp;
        response_api = response;
        expect(response.status).toBe(400);
    });
});

describe("GET /api/v1/maintenances", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get("/api/v1/maintenances")
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        env.idMantenimiento = response.body[0]._id;
        expect(response.status).toBe(200);
    });
});

describe("POST /api/v1/maintenance/register/:id", () => {
    it("should return 201 Created", async () => {
        const response = await request(app)
            .post(`/api/v1/maintenance/register/${env.idMantenimiento}`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.datosRegistroMantenimiento());
        
        response_api = response;
        expect(response.status).toBe(201);
    });

    it("should return 400 Bad Request", async () => {
        const datos = env.datosRegistroMantenimiento();
        datos.placa = "";
        const response = await request(app)
            .post(`/api/v1/maintenance/register/${env.idMantenimiento}`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(datos);
        
        response_api = response;
        expect(response.status).toBe(400);
    });
});

describe("GET /api/v1/maintenance/:id", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get(`/api/v1/maintenance/${env.idMantenimiento}`)
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        expect(response.status).toBe(200);
    });
});

describe("GET /api/v1/maintenance/vehicle/:placa", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get(`/api/v1/maintenance/vehicle/${env.vehicleInfo.placa}`)
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        expect(response.status).toBe(200);
    });
});

describe("PUT /api/v1/maintenance/:id", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .put(`/api/v1/maintenance/${env.idMantenimiento}`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.datosRegistroMantenimiento());
        
        response_api = response;
        expect(response.status).toBe(200);
    });

    it("should return 400 Bad Request", async () => {
        const datos = env.datosRegistroMantenimiento();
        datos.placa = "";
        const response = await request(app)
            .put(`/api/v1/maintenance/${env.idMantenimiento}`)
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(datos);
        
        response_api = response;
        expect(response.status).toBe(400);
    });
});

describe("DELETE /api/v1/client/:cedula", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .delete(`/api/v1/client/${env.clientInfo.cedula}`)
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        response_api = response;
        expect(response.status).toBe(200);
    });
});