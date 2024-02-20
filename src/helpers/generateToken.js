const jwt = require('jsonwebtoken')
import config from '../config'

const tokenSing = async (results) =>{
    return jwt.sign(
         {
            _id: results[0].Id_user,
            _name : results[0].Name_user,
            _email : results[0].Email_user,
            _imageUrl : results[0].ImgUrl_user,
            _rol : results[0].Rol_user

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