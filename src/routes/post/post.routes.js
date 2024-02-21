import { Router } from "express"
import { upload } from "../../middleware/uploadImage";
import {postMethods} from '../../controllers/post/post.controllers' 

const checkAuth = require('../../middleware/checkAuth')

const router = Router();

//ROUTES USER
router.post("/uploadImage/:id",checkAuth/* ,upload.single('file') */, postMethods.uploadImageFile);
//ROUTES ADRESS
router.post("/postadress/:id",checkAuth, postMethods.postAdressById)
//ROUTES ART
router.post("/postArt/:id", checkAuth,upload.single('file'), postMethods.postArtById )
//ROUTES FAVORITES
router.post("/postFavorite/:idUser/:idArt", checkAuth, postMethods.postFavorite )

//ROUTES SHOPPING CART
router.post("/postAddShoppingCart/:idUser/:idArt/:cantidad", checkAuth, postMethods.postAddShoppingCart) 

//ROUTES BUY
router.post("/postAddBuy/:idUser", checkAuth, postMethods.postbuy)




export default router;