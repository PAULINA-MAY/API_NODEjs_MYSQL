const jwt = require('jsonwebtoken')
import config from '../config'

const tokenSing = async (results) =>{
    return jwt.sign(
         {
            _id: results.Id_user,
            _rol : results.Rol,
            _img : results.Img,
            _email : results.Email,
            _nombres : results.Nombres,
            _apellidos : results.Apellidos,
         },
         config.jwt_secret,
         {
            expiresIn: "2h"
         }
    );
};
const verifyToken = async ( token)  =>{
   try {

      return jwt.verify(token, config.jwt_secret ) 
   } catch (error) {
     
      return null;
      
   }
   
}
module.exports = {tokenSing, verifyToken }