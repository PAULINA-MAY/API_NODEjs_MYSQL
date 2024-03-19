import { Router } from "express"
import { getMethods } from '../../controllers/get/get.controllers'
const router = Router();
//verificar si el usuario tiene una sesion d epor medio
const checkAuth = require('../../middleware/checkAuth')

//ROUTES USER
router.get("/getUsers", checkAuth, getMethods.getUsers)

/* //ROUTES ADRESS
router.get("/getAdressUserById/:id", checkAuth, getMethods.getAdressUseById) */

//ROUTES ART
//ENDPOINT PARA  OBTENER LAS PINTURAS QUE YA AGREGO EL USUARIO A LA PLATORMA
router.get("/getArtByIdUser/:id", checkAuth, getMethods.getArtByIdUser)
//ENDPOINT PARA  OBTENER EL ARTE POR MEDIO DE SU ID
router.get("/getArtById/:id",  checkAuth, getMethods.getArtById)

//ENDPOINT PARA  OBTENER TODAS LAS PINTURAS
router.get("/getAllArts/", checkAuth, getMethods.getAllArts)
//FAVORITES

//ENDPOINT PARA OBTENER LOS FAVORITOS DEL USUARIO
router.get("/getFavoritesByIdUser/:id", checkAuth, getMethods.getFavoritesByUserId)
//SHOPPING CART
router.get("/getShoppingCartById/:id", checkAuth, getMethods.getAllShoppingCartPurchase)






export default router;
