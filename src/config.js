import { config } from "dotenv";

config();

export default {
    host : process.env.DB_HOST || "",
    database : process.env.DATABASE || "",
    user : process.env.USER ||  "",
    port : process.env.DB_PORT || "",
    serverport : process.env.SERVER_PORT || "",
    password : process.env.PASSWORD ,
    jwt_secret :  process.env.JWT_SECRET || ""
}