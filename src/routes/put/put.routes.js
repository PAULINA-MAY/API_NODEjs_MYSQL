import { Router } from "express"
import { putMethods } from "../../controllers/put/updatecontrollers";
const checkAuth = require('../../middleware/checkAuth')
const router = Router();


//ROUTES ADRESS
// ENDPOINT PARA ACTUAIZAR LA DIRECCION DEL USUARIO CON EL ID DE LA DIRECCION
router.put("/putAdressById/:id",checkAuth,putMethods.updateAdressUserById)



export default router;