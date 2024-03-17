import mysql from 'promise-mysql';
import config from '../config';

let connection;

const createConnection = async (req, res) => {
    try {
        connection = await mysql.createConnection({
            host: config.host,
            database: config.database,
            user: config.user,
            port: config.port,
            password: config.password
        });
        console.log('Conexión establecida con la base de datos')
    } catch (error) {
        console.log(error);
        console.log('Error interno del servidor')
    }
};

const getConnection = async () => {
    if (!connection) {
        await createConnection();
    }
    return connection;
};

module.exports = {
    getConnection
};
