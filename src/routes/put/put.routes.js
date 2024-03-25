import { Router } from "express"
import { upload } from "../../middleware/uploadImage";
import { putMethods } from "../../controllers/put/updatecontrollers";
const checkAuth = require('../../middleware/checkAuth')
const router = Router();



//ROUTES CATEGORY
//ENDPOINT PARA ACTUALIZAR DATOS DE UNA CATEGORIA EN ESPECIFICA
router.put("/putCategory/:id", checkAuth,upload.single('file'),  putMethods.updateCategoryById)

//ROUTES ROL
//ENDPOINT PARA ACTUALIZAR EL ROL DE UN USUARIO EN ESPECIFICO
router.put('/putRolUserById/:id', checkAuth, putMethods.updateRolUserById)




export default router;