import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});

// Enviar correo de confirmación al usuario
export const sendMailToUser = async (userMail, userInfo) => {
    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Correo de confirmación",
        html: `
            <body style="margin: 0; font-family: Arial, sans-serif;">
                <!-- Header con imagen de fondo -->
                <header 
                    style="
                        background-image: url('cid:logoImage'); 
                        background-size: cover; 
                        background-position: center; 
                        background-repeat: no-repeat; 
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        padding: 50px 10px;"
                >
                    <h1
                        style="
                            color: white; 
                            text-shadow: 2px 2px 4px #000000; 
                            text-align: center; 
                            background-color: rgba(23, 23, 23, 0.7); 
                            height: 80px; 
                            line-height: 80px; 
                            width: 90%; 
                            margin: 0; 
                            box-shadow: 0px 0px 10px 5px #171717; 
                            font-family: cursive; 
                            font-size: 2.5em;"
                    >Full Prestige</h1>
                </header>

                <hr>

                <main style="text-align: center; padding: 10px; background-color: #f2f2f2;">
                    <p>Gracias por registrarte en Full Prestige</p>
                    <p>Tu correo electrónico ha sido registrado satisfactoriamente</p>
                    <p>A continuación te proporcionamos los detalles de tu cuenta:</p>

                    <ul style="list-style-type: none; padding: 0;">
                        <li><strong>Correo registrado:</strong> ${userInfo.correo}</li>
                        <li><strong>Tipo de cuenta:</strong> Perfil de ${userInfo.cargo}</li>
                        <li><strong>Contraseña de acceso:</strong> ${userInfo.contrasena}</li>
                    </ul>

                    <div style="text-align: center; padding: 10px;">
                        <a 
                            href="${process.env.URL_FRONTEND}/login"
                            style="background-color: #4CAF50; 
                                border: none; 
                                color: white; 
                                padding: 15px 32px; 
                                text-align: center; 
                                text-decoration: none; 
                                display: inline-block; 
                                font-size: 16px; 
                                border-radius: 15px;"
                        >
                            Iniciar sesión
                        </a>
                    </div>
                    <hr>

                    <p>Si tienes alguna duda o problema, no dudes en contactarnos</p>

                    <p
                        style="background-color: #b47012; 
                            border: none; 
                            color: white; 
                            padding: 8px 16px; 
                            text-align: center; 
                            text-decoration: none; 
                            display: inline-block; 
                            font-size: 12px; 
                            border-radius: 8px;"
                    ><strong>Nota:</strong> Una vez iniciada sesión deberás cambiar tu contraseña</p>
                </main>

                <hr>

                <footer style="background-color: #333333; color: white; text-align: center; padding: 10px;">
                    Atentamente: <br>
                    El equipo de soporte
                </footer>
            </body>
        `,
        attachments: [
            {
                filename: 'logo.jpg', // Imagen que usas como fondo
                path: './assets/logo.jpg', // Ruta a la imagen
                cid: 'logoImage', // CID único para referenciar la imagen en el correo
            },
        ],
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Error al enviar el correo: ", error);
        } else {
            console.log("Correo de confirmación enviado satisfactoriamente: ", info.messageId);
        }
    });
};

// Enviar correo para reestablecer contraseña
export const sendMailToRecoveryPassword = async(userMail, token)=>{
    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Restablece tu contraseña"
    };

    mailOptions.html = `
        <body style="margin: 0; font-family: Arial, sans-serif;">
            <!-- Header con imagen de fondo -->
            <header 
                style="
                    background-image: url('cid:logoImage'); 
                    background-size: cover; 
                    background-position: center; 
                    background-repeat: no-repeat; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    padding: 50px 10px;"
            >
                <h1
                    style="
                        color: white; 
                        text-shadow: 2px 2px 4px #000000; 
                        text-align: center; 
                        background-color: rgba(23, 23, 23, 0.7); 
                        height: 80px; 
                        line-height: 80px; 
                        width: 90%; 
                        margin: 0; 
                        box-shadow: 0px 0px 10px 5px #171717; 
                        font-family: cursive; 
                        font-size: 2.5em;"
                >Full Prestige</h1>
            </header>

            <hr>

            <main style="text-align: center; padding: 10px; background-color: #f2f2f2;">
                <p>Has solicitado restablecer tu contraseña</p>
                <p style="color: red;">Si no has sido tú, ignora este mensaje</p>
                <p>Usa el siguiente botón para restablecer tu contraseña</p>

                <div style="text-align: center; padding: 10px;">
                    <a 
                        href="${process.env.URL_FRONTEND}/restablecer-contrasena/${encodeURIComponent(token)}"
                        style="background-color: #4CAF50; /* Green */
                            border: none;
                            color: white;
                            padding: 15px 32px;
                            text-align: center;
                            text-decoration: none;
                            display: inline-block;
                            font-size: 16px;
                            border-radius: 15px;">
                        Restablecer tu contraseña
                    </a>
                </div>
            </main>

            <hr>

            <footer style="background-color: #333333; color: white; text-align: center; padding: 10px;">
                Atentamente: <br>
                El equipo de soporte
            </footer>

        </body>`;

    mailOptions.attachments = [
        {
            filename: 'logo.jpg', // Imagen que usas como fondo
            path: './assets/logo.jpg', // Ruta a la imagen
            cid: 'logoImage', // CID único para referenciar la imagen en el correo
        },
    ],

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error al enviar el correo: ", error);
        } else {
            console.log("Correo de recuperacion enviado satisfactoriamente: ", info.messageId);
        }
    });
};

// Enviar correo de asignacion de un mantenimiento a un tecnico
export const sendMailToTechnician = async (userMail, userInfo) => {
    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Asignación de nuevo vehiculo",
        html: `
            <body style="margin: 0; font-family: Arial, sans-serif;">
                <!-- Header con imagen de fondo -->
                <header 
                    style="
                        background-image: url('cid:logoImage'); 
                        background-size: cover; 
                        background-position: center; 
                        background-repeat: no-repeat; 
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        padding: 50px 10px;"
                >
                    <h1
                        style="
                            color: white; 
                            text-shadow: 2px 2px 4px #000000; 
                            text-align: center; 
                            background-color: rgba(23, 23, 23, 0.7); 
                            height: 80px; 
                            line-height: 80px; 
                            width: 90%; 
                            margin: 0; 
                            box-shadow: 0px 0px 10px 5px #171717; 
                            font-family: cursive; 
                            font-size: 2.5em;"
                    >Full Prestige</h1>
                </header>

                <hr>

                <main style="text-align: center; padding: 10px; background-color: #f2f2f2;">
                    <p>Se te ha asignado un nuevo vehiculo para mantenimiento</p>
                    <p>A continuación te proporcionamos detalles del vehiculo:</p>

                    <ul style="list-style-type: none; padding: 0;">
                        <li><strong>Nombre cliente:</strong> ${userInfo.cliente}</li>
                        <li><strong>Fecha de ingreso:</strong> ${userInfo.fecha_ingreso}</li>
                        <li><strong>Placa vehiculo:</strong> ${userInfo.placa}</li>
                        <li><strong>Marca vehiculo:</strong> ${userInfo.marca}</li>
                        <li><strong>Modelo vehiculo:</strong> ${userInfo.modelo}</li>
                        <li><strong>Técnico asignado:</strong> ${userInfo.tecnico}</li>
                    </ul>

                    <div style="text-align: center; padding: 10px;">
                        <a 
                            href="${process.env.URL_FRONTEND}/login"
                            style="background-color: #4CAF50; 
                                border: none; 
                                color: white; 
                                padding: 15px 32px;
                                text-align: center;
                                text-decoration: none;
                                display: inline-block;
                                font-size: 16px;
                                border-radius: 15px;"
                        >
                            Inicia sesión y revisalo en tu lista de mantenimientos
                        </a>
                    </div>
                    <hr>

                    <p>Si tienes alguna duda o problema, no dudes en contactarnos</p>
                </main>

                <hr>

                <footer style="background-color: #333333; color: white; text-align: center; padding: 10px;">
                    Atentamente: <br>
                    El equipo de soporte
                </footer>
            </body>
        `,
        attachments: [
            {
                filename: 'logo.jpg', // Imagen que usas como fondo
                path: './assets/logo.jpg', // Ruta a la imagen
                cid: 'logoImage', // CID único para referenciar la imagen en el correo
            },
        ],
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Error al enviar el correo: ", error);
        } else {
            console.log("Correo de asignacion enviado satisfactoriamente: ", info.messageId);
        }
    });

};

// Enviar correo de actualizacion de un mantenimiento a un administrador
export const sendMailToAdmin = async (userMail, info) => {
    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Actualización de mantenimiento",
        html: `
            <body style="margin: 0; font-family: Arial, sans-serif;">
                <!-- Header con imagen de fondo -->
                <header 
                    style="
                        background-image: url('cid:logoImage');
                        background-size: cover; 
                        background-position: center; 
                        background-repeat: no-repeat; 
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        padding: 50px 10px;"
                >
                    <h1
                        style="
                            color: white; 
                            text-shadow: 2px 2px 4px #000000; 
                            text-align: center; 
                            background-color: rgba(23, 23, 23, 0.7); 
                            height: 80px; 
                            line-height: 80px; 
                            width: 90%; 
                            margin: 0; 
                            box-shadow: 0px 0px 10px 5px #171717; 
                            font-family: cursive; 
                            font-size: 2.5em;"
                    >Full Prestige</h1>
                </header>

                <hr>

                <main style="text-align: center; padding: 10px; background-color: #f2f2f2;">
                    <p>Se ha solicitado la actualización de un mantenimiento</p>

                    <p>${info.solicitante} requiere que actualices la información de un mantenimiento</p>

                    <p>A continuación te proporcionamos los detalles del mantenimiento:</p>
                    <li><strong>ID del mantenimiento:</strong> ${info.id}</li>
                    <li><strong>Placa del vehiculo:</strong> ${info.vehiculo}</li>
                    <div style="display: flex; justify-content: space-around;">
                        <div style="text-align: center; padding: 10px; border-right: 2px solid #7fc91e; border-radius: 15px 0 0 15px;">
                            <h3>Datos actuales del mantenimiento</h3>
                            <ul style="list-style-type: none; padding: 0;">
                                <li><strong>Descripcion:</strong> ${info.current.descripcion}</li>
                                <li><strong>Costo:</strong> ${info.current.costo}$</li>
                                <li><strong>Estado:</strong> ${info.current.estado}</li>
                            </ul>
                        </div>

                        <div style="text-align: center; padding: 10px; border-left: 2px solid #f7b40b; border-radius: 0 15px 15px 0;">
                            <h3>Nuevos datos del mantenimiento</h3>
                            <ul style="list-style-type: none; padding: 10px">
                                <li><strong>Descripcion:</strong> ${info.new.descripcion}</li>
                                <li><strong>Costo:</strong> ${info.new.costo}$</li>
                                <li><strong>Estado:</strong> ${info.new.estado}</li>
                            </ul>
                        </div>
                    </div>

                    <div style="text-align: center; padding: 10px;">
                        <a 
                            href="${process.env.URL_FRONTEND}/login"
                            style="background-color: #4CAF50; 
                                border: none; 
                                color: white; 
                                padding: 15px 32px; 
                                text-align: center; 
                                text-decoration: none; 
                                display: inline-block; 
                                font-size: 16px; 
                                border-radius: 15px;"
                        >
                            Iniciar sesión
                        </a>
                    </div>
                    <hr>

                    <p>Si tienes alguna duda o problema, no dudes en contactarnos</p>
                </main>

                <hr>

                <footer style="background-color: #333333; color: white; text-align: center; padding: 10px;">
                    Atentamente: <br>
                    El equipo de soporte
                </footer>
            </body>
        `,
        attachments: [
            {
                filename: 'logo.jpg', // Imagen que usas como fondo
                path: './assets/logo.jpg', // Ruta a la imagen
                cid: 'logoImage', // CID único para referenciar la imagen en el correo
            },
        ],
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Error al enviar el correo: ", error);
        } else {
            console.log("Correo de actualizacion enviado satisfactoriamente: ", info.messageId);
        }
    });
};