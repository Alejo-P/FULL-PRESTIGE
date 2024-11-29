import { mongoose } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Establecer strictQuery para evitar advertencias
mongoose.set('strictQuery', true);

// Variable global para almacenar el servidor en memoria (para pruebas)
let mongoServer;

// Función para conectar a la base de datos (en memoria o real según el entorno)
export const connect = async () => {
    try {
        // Si estamos en el entorno de pruebas, usar MongoDB en memoria
        if (process.env.NODE_ENV === 'test') {
            mongoServer = await MongoMemoryServer.create({
                instance: {
                    dbName: 'test',
                },
                binary: {
                    downloadDir: './mongodb-binaries', // Opcional: especificar un directorio para binarios
                },
            });
            const uri = mongoServer.getUri();
            const { connection } = await mongoose.connect(uri, {
                connectTimeoutMS: 30000, // Aumenta el tiempo de espera para la conexión
            });
            console.log('Conexión exitosa a la base de datos en memoria', "Host:", connection.host, "Port:", connection.port);
        } else {
            // Conexión a la base de datos real (para producción, desarrollo, etc.)
            const { connection } = await mongoose.connect(process.env.MONGO_URI);
            console.log('Conexión exitosa a la base de datos real', "Host:", connection.host, "Port:", connection.port);
        }
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
    }
};

// Función para conectar a la base de datos de producción
export const connect_prod = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI_PROD);
        console.log('Conexión exitosa a la base de datos de producción', "Host:", connection.host, "Port:", connection.port);
    } catch (error) {
        console.error('Error al conectar a la base de datos de producción', error);
    }
}

// Función para desconectar de la base de datos
export const disconnect = async () => {
    try {
        await mongoose.disconnect();
        if (mongoServer) {
            await mongoServer.stop();  // Detener el servidor en memoria si se está usando
        }
        console.log('Desconexión de la base de datos exitosa');
    } catch (error) {
        console.error('Error al desconectar de la base de datos', error);
    }
};
