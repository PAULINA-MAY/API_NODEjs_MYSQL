import { Router } from "express";
import { deleteMethods  } from "../../controllers/delete/delete.controllers";
const router = Router();
//verificar si el usuario tiene una sesion d epor medio
const checkAuth = require('../../middleware/checkAuth')

//ROUTES USER
router.delete("/deleteUsers/:id",checkAuth , deleteMethods.deleteUserById )
//ROUTES ART
///ENDPOINT PARA BORRAR UNPRODUCTO INDICANDO EL ID DEL MISMO 
router.delete("/deleteArtById/:id", checkAuth, deleteMethods.deleteProductById )
//ROUTES FAVORITES
// ENDPOINT PARA BORRAR UNA PINTURA FAVORITA DEL USUARIO INDICANDO EL ID 
router.delete("/deleteFavoriteById/:id", checkAuth, deleteMethods.deleteFavoritesById)

//ROUTES SHOPPING CART
router.delete("/deleteShoppingCartById/:id", checkAuth, deleteMethods.deleteShoppingCartById)







export default router;