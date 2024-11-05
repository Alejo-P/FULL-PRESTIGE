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

export const sendMailToUser = (userMail, token) => {
    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Verifica tu cuenta",
        html: `<p>Hola, haz clic <a href="${process.env.URL_BACKEND}/verify-token/${encodeURIComponent(token)}">aquí</a> para confirmar tu cuenta.</p>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
};

// Enviar correo para reestablecer contraseña
export const sendMailToRecoveryPassword = async(userMail, token)=>{
    let info = await transporter.sendMail({
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Restablece tu contraseña",
        html: `
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

            </body>
        `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}
