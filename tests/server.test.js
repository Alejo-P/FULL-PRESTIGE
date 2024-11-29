import request from "supertest";
import app from "../src/server.js";
import { connect, disconnect } from "../src/database.js";
import { env } from "./env.js";

beforeAll(async () => {
    // Conectar a la base de datos en memoria antes de ejecutar las pruebas
    await connect();
}, 30000);

afterAll(async () => {
    // Desconectar de la base de datos en memoria después de las pruebas
    await disconnect();
}, 30000);

describe("GET /", () => {
    it("should return 200 OK", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
    });
});

/*-------------------------#Rutas para empleados#-------------------------*/
describe("POST /api/v1/register - Administrador", () => {
    it("should return 201 Created", async () => {
        const response = await request(app)
            .post("/api/v1/register")
            .send(env.adminUser);

        expect(response.status).toBe(201);
    });
}, 5000);

describe("POST /api/v1/register - Empleado", () => {
    it("should return 201 Created", async () => {
        const response = await request(app)
            .post("/api/v1/register")
            .send(env.empleadoUser);

        expect(response.status).toBe(201);
    });
}, 5000);

describe("POST /api/v1/login", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .post("/api/v1/login")
            .send(env.adminUser);
        
        env.setToken(response.body.empleado.token);
        expect(response.status).toBe(200);
    });
}, 5000);

describe("GET /api/v1/employees", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get("/api/v1/employees")
            .set("Authorization", `Bearer ${env.getToken()}`);
        
        console.log(response.body);
        expect(response.status).toBe(200);
    });
});

describe("GET /api/v1/employee/:cedula", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .get(`/api/v1/employee/${env.empleadoUser.cedula}`)
            .set("Authorization", `Bearer ${env.getToken()}`);
        
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
        
        expect(response.status).toBe(200);
    });
});

describe("PUT /api/v1/profile/update-password", () => {
    it("should return 200 OK", async () => {
        const response = await request(app)
            .put("/api/v1/profile/update-password")
            .set("Authorization", `Bearer ${env.getToken()}`)
            .send(env.cambiarContrasenaAdmin());
        
        expect(response.status).toBe(200);
    });
});

