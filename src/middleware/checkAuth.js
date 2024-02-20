import { verifyToken } from "../helpers/generateToken";


const checkAuth = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ');
  
        const tokenData = await verifyToken(token[1])
        console.log('Este es mi token que inserte en Bearer : '+ token[1])
        console.log('Mi token ya esta verificado : '+  tokenData)

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