// Descripcion: Contiene las variables de entorno para las pruebas unitarias

export const EmpleadosMock = {
    validEmpleado: {
        cedula: "1234567890",
        nombre: "Juan",
        apellido: "Pérez",
        correo: "juanperez77@gmail.com",
        telefono: "0987654321",
        direccion: "Av. Amazonas N24-89",
        contrasena: "Ju@n123p."
    },
    invalidEmpleado: {
        cedula: "",
        nombre: "Juan",
        apellido: "Pérez",
        correo: "juanperez77@gmail.com",
        telefono: "0987654321",
        direccion: "Av. Amazonas N24-89",
        contrasena: "Ju@n123p."
    },
    listEmpleados: [
        {
            cedula: "1234567890",
            nombre: "Juan",
            apellido: "Pérez",
            correo: "juanperez77@gmail.com",
            telefono: "0987654321",
            direccion: "Av. Amazonas N24-89",
            contrasena: "Ju@n123p."
        },
        {
            cedula: "0987654321",
            nombre: "Ana",
            apellido: "Gómez",
            correo: "anagomes@gmail.com",
            telefono: "0987654321",
            direccion: "Av. Amazonas N24-89",
            contrasena: "An@123g."
        }
    ]
};
