import { getConnection } from "../../database/database"
import { tokenSing } from "../../helpers/generateToken";
import { encrypt, compare} from "../../helpers/handleBcrypt";

export const blacklist = [];






const registerUser = async (req, res) => {
    try {
        const { firstNames, lastNames, password, email } = req.body;
        const connection = await getConnection();
        const passwordHash = await encrypt(password);
        const defaultImage = 'https://res.cloudinary.com/ddfdcx85l/image/upload/v1708497453/ugbw6xdzxrxhqvzpdtfe.jpg';

        // Insertar el nuevo usuario
        const newUser = {
            FirstNames_user: firstNames,
            LastNames_user: lastNames,
            Email_user: email,
            Password_user: passwordHash,
            ImgProfile_user: defaultImage
        };

        const insertedUser = await connection.query('INSERT INTO User SET ?', newUser);

        if (insertedUser.affectedRows === 0) {
            return res.status(401).send({
                message: 'The user has not been inserted',
                status: 401
            });
        }

        // Obtener el Id_user del usuario recién insertado
        const userId = insertedUser.insertId; // Usar 'insertId' en lugar de 'Id_user'

        // Insertar el rol 'user' asociado al usuario en la tabla Rol
        const insertedRol = await connection.query('INSERT INTO Rol (Name_rol, Id_user_FK) VALUES (?, ?)', ['user', userId]);

        if (insertedRol.affectedRows === 0) {
            // Si no se pudo insertar el rol, eliminar el usuario previamente insertado y enviar un mensaje de error
            await connection.query('DELETE FROM User WHERE Id_user = ?', [userId]);
            return res.status(401).send({
                message: 'The role has not been inserted',
                status: 401
            });
        }

        // Ambos usuario y rol se han insertado correctamente
        res.send({
            message: 'User and role have been inserted successfully',
            status: 200
        });
    } catch (error) {
        console.log(error);
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