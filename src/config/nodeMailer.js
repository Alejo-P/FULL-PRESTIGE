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
                        <li><strong>Contraseña temporal:</strong> ${userInfo.contrasena}</li>
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

    info.html = `
        <body style="margin: 0; font-family: Arial, sans-serif;">
            <header style="background-color: #333333; color: white; text-align: center; padding: 10px;">
                <h1>Full Prestige</h1>
            </header>

            <hr>

            <main style="text-align: center; padding: 10px; background-color: #f2f2f2;">
                <p>Has solicitado restablecer tu contraseña</p>
                <p style="color: red;">Si no has sido tú, ignora este mensaje</p>
                <p>Usa el siguiente botón para restablecer tu contraseña</p>

                <div style="text-align: center; padding: 10px;">
                    <a 
                        href="${process.env.URL_BACKEND}/verify-token/${encodeURIComponent(token)}"
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
                El equipo de soporte
            </footer>

        </body>`;

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error al enviar el correo: ", error);
        } else {
            console.log("Correo de recuperacion enviado satisfactoriamente: ", info.messageId);
        }
    });
}
