import { verifyToken } from "../helpers/generateToken";
import { blacklist } from '../controllers/auth/auth.controllers';

const checkAuth = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ');
  
        const tokenData = await verifyToken(token[1])
        console.log('Este es mi token que inserte en Bearer : '+ token[1])
        /* console.log('Mi token ya esta verificado : '+  tokenData._id) */
        if (blacklist.includes(token[1])) {
          /*   const tokendfind = blacklist.includes(token[1]);
            console.log("Este es el token encontrado en blaclist", tokendfind); */
            res.status(401)
            res.send({error:'you do not have a session'})
            return;
        }

        if (tokenData._id) {
            next()
        } else {
            res.status(409)
            res.send({error:'you do not have a session'})
        }

    } catch (e) {
        console.log(e)
        res.status(409)
        res.send({error : 'you do not have a session'})


    }

}
module.exports = checkAuth