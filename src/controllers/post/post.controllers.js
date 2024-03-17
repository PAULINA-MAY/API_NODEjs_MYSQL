
import { getConnection } from "../../database/database"
import config from '../../config'
import app from "../../app";
import {sendEmail} from "../../helpers/sendEmail"
const cloudinary = require("../../cloudinary");

const postArtById = async (req, res) => {
    try {
        const id = req.params.id;
        const image = req.file;
        const { titulo, descripcion, precio, Categoria, cantidad } = req.body;
        const connection = await getConnection();
        
        // Verificar si ya existe un artículo con el mismo título
        const existingArt = await connection.query('SELECT * FROM art WHERE Title_Art = ?', [titulo]);
        if (existingArt.length > 0) {
            return res.status(409).json({ message: "El artículo ya existe" });
        }

        // Verificar si el usuario existe
        const user = await connection.query('SELECT * FROM user WHERE Id_user = ?', [id]);
        if (user.length === 0) {
            return res.status(409).json({ message: "El usuario no existe" });
        }

        // Cargar la imagen del artículo en Cloudinary
        const urlImage = await cloudinary.uploader.upload(image.path);
        
        const newArt = {
            Id_userFK: id,
            Title_Art: titulo,
            Descr_Art: descripcion,
            Price_Art: precio,
            Category_Art: Categoria,
            Stock: cantidad,
            Img_Art: urlImage.url,
        };

        // Insertar el nuevo artículo en la base de datos
        const data = await connection.query('INSERT INTO art SET ?', newArt);

        res.status(200).send({
            data: data,
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const uploadImageFile = async (req, res) => {
    try {
        const image = req.file
        const id = req.params.id
        const connection = await getConnection();
        const exist = await connection.query('SELECT * FROM user WHERE Id_user = ?', [id])
        if (exist.length === 0) {

            return res.status(409).json({ message: 'the user does not exist' })
        } else {
        
             const urlImage = await cloudinary.uploader.upload(image.path)
             console.log(image.path)
             console.log(urlImage)
                const updated = await connection.query('UPDATE user SET ImgProfile_user = ?  WHERE  Id_user = ?', [urlImage.url, id]);
                if (updated.length === 0) {
                    return res.status(409).json({ message: 'The  imageProfile has not been updated' })
    
                } else {
                    console.log(updated)
                    res.send({
                        data: updated,
                        message: 'The ImageProfile has been updated',
                        succes: true,
                        status: 200
    
                    })
    
                }

             }
             
        


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

const postAdressById = async (req, res) => {
    try {
        const id = req.params.id
        const { codigoPostal, calle,ciudad, numExt, numInter } = req.body
        const connection = await getConnection();
        const exist = await connection.query('SELECT * FROM user WHERE Id_user = ?', [id])
        if (exist.length === 0) {
            res.status(409).send({
                success: false,
                message: 'This user does not exist'
            })
        }
        else {

            const getAdressUser = await connection.query('SELECT FullName_user AS NOMBRE, Cp_Dir AS CODIGOPOSTAL,  City_Dir AS CIUDAD, NumExt_Dir AS NUMEXT, NumInter_Dir AS NUMINTER  FROM  user INNER JOIN  adress ON  Id_user = Id_user_FK  WHERE   Id_user = ?', [id])
            if (getAdressUser.length === 0) {
                const newAdress = {
                    Id_user_FK: id,
                    Cp_Dir: codigoPostal,
                    Street : calle,
                    City_Dir: ciudad,
                    NumExt_Dir: numExt,
                    NumInter_Dir: numInter,
                

                };
                const data = await connection.query('INSERT INTO adress SET ?', newAdress)
                res.send({
                    data: data,
                    success: true,
                    status: 200,

                })

            } else {
                res.status(409).send({
                    success: false,
                    message: 'The adress has been inserted for this specific user'
                })

            }


        }




    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error ' })

    }

}

const postFavorite = async (req, res) => {
    try {
        const idUser = req.params.idUser
        const idArt = req.params.idArt
        const connection = await getConnection();
        const addFavorite = {
            Id_FKuser: idUser,
            Id_FKart: idArt
        }
        const data = await connection.query('INSERT INTO Favorites SET ?', addFavorite)
        if (data.length === 0) {

            return res.status(409).json({ message: 'the user or art do not exist' })
        } else {
            res.send({
                data: data,
                success: true,
                status: 200,

            })

        }


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })

    }


}
const postAddShoppingCart = async (req, res) => {
    try {
        const idUser = req.params.idUser;
        const idArt = req.params.idArt;
        const cantidad = req.params.cantidad;
        const connection = await getConnection();

        // Verificar si el usuario y el artículo existen
        const userExists = await connection.query('SELECT * FROM user WHERE Id_user = ?', [idUser]);
        const artExist = await connection.query('SELECT * FROM art WHERE Id_Art = ?', [idArt]);

        // Validar la existencia del usuario y el artículo
        if (userExists.length === 0 || artExist.length === 0) {
            return res.status(404).json({ message: 'The user or art does not exist' });
        }
        
          // Verificar si el artículo ya está en el carrito
          const checkExistingItem = await connection.query('SELECT * FROM shopping_cart WHERE Id_userFK = ? AND Id_artFK = ?', [idUser, idArt]);
          if (checkExistingItem.length > 0) {
              return res.status(409).json({ message: 'The art already exists in the shopping cart' });
          }

        // Verificar si hay suficiente stock disponible
   
        if (artExist[0].Stock < cantidad) {
            return res.status(409).json({ message: 'Insufficient stock available' });
        } 

      

        // Agregar la compra al carrito
        const addBuy = {
            Id_userFK: idUser,
            Id_artFK: idArt,
            cantidad: cantidad
        };

        // Insertar la compra en el carrito y restar la cantidad del stock
        await connection.beginTransaction();
        await connection.query('INSERT INTO shopping_cart SET ?', addBuy);
        await connection.query('UPDATE art a SET  a.Stock = a.Stock - ? WHERE Id_Art = ?', [cantidad, idArt]);
        await connection.commit();

        res.status(200).json({
            message: 'The purchase has been added to the cart',
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    } 
}
const postbuy = async (req, res) => {
    try {
        const idUser = req.params.idUser;
        const { cantidad, precioTotal } = req.body || {};
        const connection = await getConnection();

        // Obtener información del usuario y su dirección
        const userData= await connection.query('SELECT * FROM user WHERE Id_user = ?', [idUser]);
        const direccionData = await connection.query('SELECT * FROM adress WHERE Id_user_FK = ?', [idUser]);

        if (userData.length===0 || direccionData.length === 0) {
            return res.status(404).json({ message: 'The user or adress  does not exist' });
        }

        // Obtener lista de artículos en el carrito del usuario
        const shoppingCartItems = await connection.query(`
            SELECT art.Descr_Art, art.Price_Art, shopping_cart.cantidad
            FROM shopping_cart 
            INNER JOIN art ON shopping_cart.Id_artFK = art.Id_Art
            WHERE shopping_cart.Id_userFK = ?`, [idUser]);

        // Insertar la compra en la tabla 'buy'
        const addBuy = {
            Id_FK_user: idUser,
            quantity: cantidad,
            total: precioTotal
        };

        const data = await connection.query('INSERT INTO buy SET ?', addBuy);
        if(data.length===0){
            return res.status(404).json({ message: 'The user does not exist' });
        }else{
            console.log(shoppingCartItems)
      
        // Envío de correo electrónico
       const sendedEmail = await sendEmail(
            userData[0].Email_user,
            userData[0].FullName_user,
            direccionData[0].Street,
            direccionData[0].NumExt_Dir,
            shoppingCartItems,
            cantidad,
            precioTotal
        ); 
        res.status(200).json({
            data: data,
            message: 'The buy has been added',
            success: true,
            status: 200,
            notified: true,
            emailSended: sendedEmail.messageId 
        });
    }

       

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const postMethods = {
    uploadImageFile,
    postAdressById,
    postArtById,
    postFavorite,
    postAddShoppingCart,
    postbuy

}