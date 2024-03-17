import { getConnection } from "../../database/database"
import { tokenSing } from "../../helpers/generateToken";
import { encrypt, compare} from "../../helpers/handleBcrypt";



const  registerUser = async (req,res) =>{
    try {
        const {name,password,email,rol} = req.body
        const connection = await getConnection();
        const passwordHash = await encrypt(password)
        const defaultImage = 'https://res.cloudinary.com/ddfdcx85l/image/upload/v1708497453/ugbw6xdzxrxhqvzpdtfe.jpg'
        if(!rol){
           
      
            const newUser = {
                FullName_user: name,
                Email_user: email, 
                Password_user: passwordHash,
                Rol_user: 'user',
                ImgProfile_user : defaultImage 
    
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
      
            const newUser = {
                FullName_user: name,
                Email_user: email, 
                Password_user: passwordHash,
                Rol_user: rol,
                ImgProfile_user :defaultImage 
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

 const login =  async (req,res)=>{
    try {
         const {email, password} = req.body
         const connection = await getConnection();
         const results = await connection.query('SELECT * FROM user WHERE  Email_user = ?', [email]);
        if(results.length=== 0 ){
            return res.send({
                status: 200,
               message : 'The are not data found for this specific User',
     
             })
     

        }else{
            const checkpassword = await compare(password, results[0].Password_user)
            const  tokenSession = await tokenSing(results)
            if(!checkpassword ){
                return res.status(409).json( {   message : 'Invalid Password' });
             }else{
                return res.send({
                     results,
                    message : 'Log in',
                    token : tokenSession
                  })
             }

        }
           
           
    
         
    } catch (error) {
        console.log(error);
       return  res.status(500).json({ message: 'Error interno del servidor' });

 
        
    }

} 



export const methods= {
    registerUser,
    login 
}