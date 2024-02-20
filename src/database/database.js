import mysql from 'promise-mysql'
import config from '../config'

const  connection= mysql.createConnection({
    host : config.host,
    database : config.database,
    user : config.user,
    port : config.port,
    password : config.password
});

const getConnection =()=>{
    return connection;
}

module.exports ={
    getConnection
}