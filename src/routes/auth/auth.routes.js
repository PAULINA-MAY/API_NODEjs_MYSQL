import { Router } from "express"
import { methods } from "../../controllers/auth/auth.controllers";
const {validateCreate, validateLogin} = require('../../validators/validator')
const router = Router();

//ROUTES
router.post("/register",validateCreate, methods.registerUser);
router.post("/login", validateLogin,  methods.login )


export default router;
