import express from "express";
import morgan from "morgan";
import config from './config'

//ROUTES
import auth from './routes/auth/auth.routes'
import get from  './routes/get/get.routes'
import post from './routes/post/post.routes'
import deleted from'./routes/delete/delete.routes'
import update from './routes/put/put.routes'

const app=express();
const port = config.serverport 


//Settings
app.set ("port", port );

//Middlewares
app.use(morgan("dev"));
app.use(express.json())

//Routes
app.use("/api/auth", auth );
app.use("/api/get", get);
app.use("/api/post", post);
app.use("/api/delete", deleted);
app.use("/api/put", update) ;

///Route ViewImages
app.use("/public", express.static('C:/Home/API-PROYECTO/src/images'))
app.use("/defaultprofile", express.static('C:/Home/API-PROYECTO/src/images/DefaultProfile'))




export default app;

