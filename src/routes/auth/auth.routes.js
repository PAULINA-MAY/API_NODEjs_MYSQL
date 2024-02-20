import { Router } from "express"
import { methods } from "../../controllers/auth/auth.controllers";
const {validateCreate} = require('../../validators/validator')
const router = Router();

//ROUTES
router.post("/register",validateCreate, methods.registerUser);
router.post("/login",methods.login )


export default router;
