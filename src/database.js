import { mongoose } from 'mongoose';

mongoose.set('strictQuery', true);

export const connect = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI);
        console.log('Conexión a la base de datos exitosa', "Host: ", connection.host, "Port: ", connection.port);
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
    }
};

export const disconnect = async () => {
    try {
        await mongoose.disconnect();
        console.log('Desconexión de la base de datos exitosa');
    } catch (error) {
        console.error('Error al desconectar de la base de datos', error);
    }
};
