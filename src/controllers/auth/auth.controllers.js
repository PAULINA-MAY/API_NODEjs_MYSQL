import { getConnection } from "../../database/database"
import { tokenSing } from "../../helpers/generateToken";
import { encrypt, compare} from "../../helpers/handleBcrypt";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
export const blacklist = [];






const registerUser = async (req, res) => {
    try {
        const { firstNames, lastNames, password, email } = req.body;
        const passwordHash = await encrypt(password);
        const defaultImage = 'https://res.cloudinary.com/ddfdcx85l/image/upload/v1708497453/ugbw6xdzxrxhqvzpdtfe.jpg';

        // Insertar el nuevo usuario y el rol asociado
        const newUser = await prisma.user.create({
            data: {
                FirstNames_user: firstNames,
                LastNames_user: lastNames,
                Email_user: email,
                Password_user: passwordHash,
                ImgProfile_user: defaultImage,
                rol: {
                    create: {
                        Name_rol: 'user'
                    }
                }
            },
            include: {
                rol: true
            }
        });

        // Si no se pudo insertar el usuario o el rol, enviar un mensaje de error
        if (!newUser) {
            return res.status(401).send({
                message: 'The user or role has not been inserted',
                status: 401
            });
        }

        // Usuario y rol insertados correctamente
        res.send({
            message: 'User and role have been inserted successfully',
            status: 200
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};





const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const connection = await getConnection();
        const results = await connection.query('SELECT  u.Id_user, u.FirstNames_user AS Nombres , u.LastNames_user AS Apellidos, u.Email_user AS Email,  u.Password_user, u.ImgProfile_user AS Img, r.Name_rol AS Rol  FROM  User u JOIN Rol r ON u.Id_user = r.Id_user_FK   WHERE u.Email_user = ?', [email]);

        if (results.length === 0) {
            return res.status(409).json({
                status: 409,
                message: 'No se encontraron datos para este usuario.',
            });
        } else {
            const user = results[0];
            const checkPassword = await compare(password, user.Password_user);
            if (!checkPassword) {
                return res.status(409).json({
                    status: 409,
                    message: 'La contraseña proporcionada es incorrecta.',
                });
            } else {
              
                const tokenSession = await tokenSing(user);
                res.cookie('token', tokenSession, { httpOnly: true });

                const fetchdata = results.map(user => {
                    const { Password_user, ...userData } = user; // Excluir el campo Password_user
                    return userData;
                });

                return res.status(200).json({
                    status: 200,
                    message: 'Inicio de sesión exitoso.',
                    token: tokenSession,
                });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};



const logout = async (req, res) =>{
   try {
    const token = req.headers['authorization'].split(' ');
   
    if (blacklist.includes(token[1])) {
          const tokendfind = blacklist.includes(token[1]);
          console.log("Este es el token encontrado en blaclist", tokendfind); 
          res.status(401).json({ error: 'You do not have session' });
          return;
      }else{
        res.cookie('token', { expires: new Date(0) });
        console.log(token[1])
        blacklist.push(token[1]);
        
        res.status(200).json({ message: 'Logout exitoso' });

      }



    
   } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
    
   }
}






export const methods= {
    registerUser,
    login,
    logout
}