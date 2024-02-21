import { getConnection } from "../../database/database"
import { tokenSing } from "../../helpers/generateToken";
import { encrypt, compare} from "../../helpers/handleBcrypt";
import config from '../../config'
import app from "../../app";



const  registerUser = async (req,res) =>{
    try {
        const {name,password,email,rol} = req.body
        const connection = await getConnection();
        const passwordHash = await encrypt(password)
        if(!rol){
            const dir = config.serverport+':'+app.get("port")+'/defaultprofile/'
      
            const newUser = {
                FullName_user: name,
                Email_user: email, 
                Password_user: passwordHash,
                Rol_user: 'user',
                ImgProfile_user : dir+'69f8eeb16f979b2eb07918b3ab2dfe4a.jpg'
    
            };
            console.log(newUser)
            const inserted = await connection.query('INSERT INTO user SET ?', newUser);
          
            res.send({
                data : inserted,
                message : 'The user has been inserted',
                success : true,
                status : 200,
            })
           
        }else{
            const dir = config.host+':'+app.get("port")+'/defaultprofile/'
            const newUser = {
                FullName_user: name,
                Email_user: email, 
                Password_user: passwordHash,
                Rol_user: rol,
                ImgProfile_user :dir+'69f8eeb16f979b2eb07918b3ab2dfe4a.jpg'
            };
            console.log( newUser)
            const inserted = await connection.query('INSERT INTO user SET ?', newUser);
            res.send({
                data : inserted,
                message : 'The user has been inserted',
                success : true,
                status : 200,
            })

        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error interno del servidor' });
        
    }
};

 const login = async (req, res)=>{
    try {
         const {email, password} = req.body
         const connection = await getConnection();
         const results = await connection.query('SELECT * FROM user WHERE  Email_user = ?', [email]);



        if(results.length=== 0 ){
           return res.status(409).json('There are not users or user not found');

        }
        else{
            const checkpassword = await compare(password, results[0].Password_user)
            const  tokenSession = await tokenSing(results)
            if(!checkpassword ){
                return res.status(409).json(' Invalid password');
             }else{
                 res.send({
                    data : results,
                    message : 'Log in',
                    token : tokenSession
                  })
             }
           
        }
         
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error interno del servidor' });
        
    }

} 



export const methods= {
    registerUser,
    login 
}