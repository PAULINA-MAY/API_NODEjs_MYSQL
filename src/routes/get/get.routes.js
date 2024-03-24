import { Router } from "express"
import { getMethods } from '../../controllers/get/get.controllers'
const router = Router();
//verificar si el usuario tiene una sesion d epor medio
const checkAuth = require('../../middleware/checkAuth')

//ROUTES USER
router.get("/getUsers", checkAuth, getMethods.getUsers)


//ROUTES PRODUCT
//ENDPOINT PARA  OBTENER TODOS LOS PRODUCTOS PROVENIENTES DE  UN ESPECIFICO  USUARIO A LA PLATORMA
router.get("/getArtByIdUser/:id", checkAuth, getMethods.getProdByIdUser)
//ENDPOINT PARA  OBTENER DATOS DE UN  PRODUCTO POR MEDIO DE SU ID
router.get("/getArtById/:id",  checkAuth, getMethods.getArtById)

//ENDPOINT PARA  OBTENER DATOS DE TODOS LOS RPODUCTOS
router.get("/getAllProducts", checkAuth, getMethods.getAllProducts)

//FAVORITES
//ENDPOINT PARA OBTENER LOS PRODUCTOS FAVORITOS DE UN ESPECIFICO USUARIO
router.get("/getFavoritesByIdUser/:id", checkAuth, getMethods.getFavoritesByUserId)
//CART

//ENDPOINT PARA OBTENER DEL CARRITO DE COMPRAS DE UN ESPECIFICO USUARIO
router.get("/getShoppingCartById/:id", checkAuth, getMethods.getCartByIdUser)

//CATEGORIES
 //ENDPOINT PARA OBTENER TODAS LAS CATEGORIAS 
 router.get("/getAllCategories", checkAuth, getMethods.getAllCategories)







export default router;
