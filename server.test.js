import request from "supertest";
import app from "./src/server.js";
import { connect, disconnect } from "./src/database.js";
import {ej_empleado} from "./env.js";

beforeAll(async () => {
    // Conectar a la base de datos en memoria antes de ejecutar las pruebas
    await connect();
});

describe("GET /", () => {
    it("should return 200 OK", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
    });
});

/*-------------------------#Rutas para empleados#-------------------------*/

describe("POST /api/v1/register", () => {
    it("should return 201 Created", async () => {
        const response = await request(app)
            .post("/api/v1/register")
            .send(ej_empleado);
        expect(response.status).toBe(201);
    });
});

afterAll(async () => {
    // Desconectar de la base de datos en memoria después de las pruebas
    await disconnect();
});
