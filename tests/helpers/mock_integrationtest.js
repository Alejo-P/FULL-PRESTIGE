// Description: Contiene las variables de entorno para las pruebas de integración

export const env = {
    // Atributos
    token: "",

    adminUser: {
        cedula: "1750863381",
        nombre: "Marcelo Pinzon",
        correo: "pinzonmarcelo759@gmail.com",
        contrasena: "@lEjo0-p.",
        cargo: "Administrador",
        telefono: "0998472631",
        direccion: "Sur Quito",
        estado: true
    },

    empleadoUser: {
        cedula: "1763542361",
        nombre: "Jorge Pérez",
        correo: "mapc894@gmail.com",
        contrasena: "Jor@n1p.",
        cargo: "Técnico",
        telefono: "0965443212",
        direccion: "Av. Amazonas N24-89",
        estado: true
    },

    clientInfo: {
        cedula: "1762543142",
        nombre: "Manuel Pérez",
        correo: "manip1337@gmai.com",
        telefono: "0928377623",
        direccion: "Calle 123"
    },

    vehicleInfo: {
        orden: "1",
        placa: "ABC123",
        marca: "Chevrolet",
        modelo: "Aveo",
        fecha_ingreso: "2021-10-10",
        fecha_salida: "2021-10-15",
        cedula_cliente: "1762543142",
        descripcion: "Cambio de aceite",
        setDates: function () {
            let fecha = new Date().toLocaleDateString();
            // Formatear la fecha en formato yyyy-mm-dd
            fecha = fecha.split("/");
            fecha = fecha[2] + "-" + fecha[1].padStart(2, '0') + "-" + fecha[0].padStart(2, '0');
            this.fecha_ingreso = fecha;

            let fechaSalida = new Date();
            fechaSalida.setDate(fechaSalida.getDate() + 5);
            fecha = fechaSalida.toLocaleDateString();
            // Formatear la fecha en formato yyyy-mm-dd
            fecha = fecha.split("/");
            fecha = fecha[2] + "-" + fecha[1].padStart(2, '0') + "-" + fecha[0].padStart(2, '0');
            this.fecha_salida = fecha;
        }
    },
    
    // Metodos
    actualizarInfoEmpleado: function () {
        this.empleadoUser.nombre = "Luis Pérez";
        this.empleadoUser.correo = "luisp145@outlook.com";
        this.empleadoUser.telefono = "0987654321";
        this.empleadoUser.direccion = "Av. Amazonas N24-89";
    },

    actualizarInfoAdmin: function () {
        this.adminUser.nombre = "Julio Parado";
        this.adminUser.correo = "jparcostado@gmail.com";
        this.adminUser.telefono = "0987654321";
        this.adminUser.direccion = "Av. Amazonas N24-89";
    },

    cambiarContrasenaAdmin: function () {
        return {
            contrasena: this.adminUser.contrasena,
            nuevaContrasena: "Ju@n123p.",
            confirmarContrasena: "Ju@n123p."
        }
    },

    cambiarContrasenaEmpleado: function () {
        return {
            contrasena: this.empleadoUser.contrasena,
            nuevaContrasena: "Jor@n123p.",
            confirmarContrasena: "Jor@n123p."
        }
    },

    setToken: function (token) {
        this.token = token;
    },

    getToken: function () {
        return this.token;
    },

    datosAsistenciaEmpleado: function () {
        let fecha = new Date().toLocaleDateString();
        let hora = new Date().toLocaleTimeString();

        // Formatear la fecha en formato yyyy-mm-dd
        fecha = fecha.split("/");
        fecha = fecha[2] + "-" + fecha[1].padStart(2, '0') + "-" + fecha[0].padStart(2, '0');

        // Formatear la hora en formato hh:mm
        hora = hora.split(":");

        // Normalizar espacios en la última parte de la hora
        let indicador = hora.at(-1).replace(/\s/g, " ");
        if (indicador.includes("p. m.")) {
            hora[0] = parseInt(hora[0]) + 12;
        } else if (indicador.includes("a. m.") && hora[0] === "12") {
            hora[0] = "00";
        }

        hora = String(hora[0]).padStart(2, '0') + ":" + hora[1].padStart(2, '0');
        return {
            fecha: fecha,
            hora_ingreso: hora,
            hora_salida: "18:00",
            estado: "Presente",
            justificacion: "Justificado por calamidad doméstica"
        }
    },

    datosPagoEmpleado: function () {
        let fecha = new Date().toLocaleDateString();

        // Formatear la fecha en formato yyyy-mm-dd
        fecha = fecha.split("/");
        fecha = fecha[2] + "-" + fecha[1].padStart(2, '0') + "-" + fecha[0].padStart(2, '0');
        return {
            adelanto: 100,
            permisos: 1,
            multas: 0,
            atrasos: 0,
            fecha: fecha,
            subtotal: 100,
            justificacion: "Justificado por calamidad doméstica",
        }
    },

    actualizarInfoCliente: function () {
        this.clientInfo.nombre = "Julian Lopez";
        this.clientInfo.correo = "Jjulipop765@gmail.com";
    },

    actualizarInfoVehiculo: function () {
        this.vehicleInfo.marca = "Toyota";
        this.vehicleInfo.modelo = "Corolla";
        this.vehicleInfo.descripcion = "Cambio de frenos";
    },

    datosRegistroMantenimiento: function () {
        return {
            placa: this.vehicleInfo.placa,
            descripcion: "Cambio de aceite",
            costo: 100,
            cedula_encargado: this.empleadoUser.cedula,
            estado: "Pendiente"
        }
    },
}
