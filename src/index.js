import app from "./app";

const {PrismaClient} = require('@prisma/client')
const prisma  = new PrismaClient()

const main = async () => {
    try {
        // Verifica la conexión de Prisma
        await prisma.$connect();
        console.log('Prisma is connected to the database.');

        // Inicia el servidor
        app.listen(app.get("port"));
        console.log(`Server on Port ${app.get("port")}`);
    } catch (error) {
        console.error('Error to connect with Prisma:', error);
        // Si hay un error al conectar con Prisma, cierra la aplicación
        process.exit(1);
    }
};

main();