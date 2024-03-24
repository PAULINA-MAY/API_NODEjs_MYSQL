import { Router } from "express"
import { upload } from "../../middleware/uploadImage";
import {postMethods} from '../../controllers/post/post.controllers' 

const checkAuth = require('../../middleware/checkAuth')

const router = Router();

//ROUTES USER
router.post("/uploadImage/:id",checkAuth,upload.single('file') , postMethods.uploadImageFile);
//ROUTES PRODUCT
router.post("/postArt/:id/:idCategory", checkAuth,upload.single('file'), postMethods.postArtById )
// ROUTES CATEGORY
router.post("/postCategory", checkAuth,upload.single('file'), postMethods.postCategory)
//ROUTES FAVORITES
router.post("/postFavorite/:idUser/:idArt", checkAuth, postMethods.postFavorite )

//ROUTES SHOPPING CART
router.post("/postAddShoppingCart/:idUser/:idArt/:cantidad", checkAuth, postMethods.postAddShoppingCart) 

//ROUTES PURCHASE
router.post("/postAddBuy/:idUser", checkAuth, postMethods.postbuy)




export default router;