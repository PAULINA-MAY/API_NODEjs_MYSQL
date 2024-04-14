import { Router } from "express"
import { getMethods } from '../../controllers/get/get.controllers'
const router = Router();
//verificar si el usuario tiene una sesion d epor medio
const checkAuth = require('../../middleware/checkAuth')

//ROUTES USER
// ENDPOINT PARA TRAER LOS DATOS DE TODOS LOS USUARIOS
router.get("/getUsers", checkAuth, getMethods.getUsers)
// ENDPOINT PARA TRAER DATOS DE UN USUARIO EN ESPECIFICO 
router.get("/getUserById/:id", checkAuth, getMethods.getUserById)

//ROUTES PRODUCT
//ENDPOINT PARA  OBTENER TODOS LOS PRODUCTOS PROVENIENTES DE  UN ESPECIFICO  USUARIO A LA PLATORMA
router.get("/getArtByIdUser/:id", checkAuth, getMethods.getProdByIdUser)
//ENDPOINT PARA  OBTENER DATOS DE UN  PRODUCTO POR MEDIO DE SU ID
router.get("/getArtById/:id",  checkAuth, getMethods.getArtById)

//ENDPOINT PARA  OBTENER DATOS DE TODOS LOS RPODUCTOS
router.get("/getAllProducts", getMethods.getAllProducts)

//FAVORITES
//ENDPOINT PARA OBTENER LOS PRODUCTOS FAVORITOS DE UN ESPECIFICO USUARIO
router.get("/getFavoritesByIdUser/:id", checkAuth, getMethods.getFavoritesByUserId)
//CART

//ENDPOINT PARA OBTENER DEL CARRITO DE COMPRAS DE UN ESPECIFICO USUARIO
router.get("/getShoppingCartById/:id", checkAuth, getMethods.getCartByIdUser)

//CATEGORIES
 //ENDPOINT PARA OBTENER TODAS LAS CATEGORIAS 
 router.get("/getAllCategories", getMethods.getAllCategories)
 






export default router;
