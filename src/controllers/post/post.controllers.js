
import { getConnection } from "../../database/database"
import {sendEmail} from "../../helpers/sendEmail"
const cloudinary = require("../../cloudinary");


const postArtById = async (req, res) => {
    try {
        const id = req.params.id;
        const idCategory = req.params.idCategory
        const image = req.file;
        const { name, description, price } = req.body;
        const connection = await getConnection();
             // Verificar si el usuario existe
             const user = await connection.query('SELECT * FROM user WHERE Id_user = ?', [id]);
             if (user.length === 0) {
                 return res.status(409).json({ message: " The user does not exist" });
             }else{
                  // Verificar si ya existe un producto con el mismo nombre
                const existingProduct = await connection.query('SELECT * FROM Product WHERE Name_prod = ?', [name]);
                if (existingProduct.length > 0) {
                    return res.status(409).json({ message: "the product alredy exist" });
                }else{
                        // Cargar la imagen del producto en Cloudinary
                    const urlImage = await cloudinary.uploader.upload(image.path);
                        const newProduct = {
                            Id_catg_FK: idCategory,
                            Description_prod : description,
                            Name_prod: name,
                            Price_Prod: price,
                            Img_prod : urlImage.url
                        };
                        const productInserted = await connection.query('INSERT INTO Product SET ?', newProduct);
                          if (productInserted.affectedRows === 0) {
                            return res.status(409).json({ message: "error  registering the product" });
                            
                          } else {
                            
                            const productryId = productInserted.insertId;
                             // Insertar la relación entre el usuario y el producto en la tabla User_Prod
                             const newUserProd = {
                                Id_u_fk: id,
                                Id_p_fk: productryId,
                            };
                            const data    =  await connection.query('INSERT INTO User_Prod SET ?', newUserProd);
                            if(data.length === 0){
                                return res.status(409).json({ message: "the data was refused" });
                            }else{
                                res.status(200).send({
                                    message : 'The product has been inserted',
                                    success: true
                                });

                            
                            }
        
                          }
                        }
                    }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const postCategory = async(req,res) =>{
    const image = req.file;
    const { name, description } = req.body;
    const connection = await getConnection();
    const category = await connection.query('SELECT * FROM  Category WHERE Name_catg = ?', [name]);
    if (category.length > 0) {
        return res.status(409).json({ message: "the category alredy exist" });
    }else{
        // Cargar la imagen del producto en Cloudinary
        const urlImage = await cloudinary.uploader.upload(image.path);
        const newCategory ={
            Name_catg : name,
            Description_catg : description,
            Img_catg : urlImage.url
        }
        const categoryInserted = await connection.query('INSERT INTO Category SET ?', newCategory);
        if (categoryInserted.affectedRows === 0) {
            return res.status(409).json({ message: "the category has not been inserted" });
        } else {
            res.send({
                success: true,
                status: 200,
            })

        }

    }
        
};


const uploadImageFile = async (req, res) => {
    try {
        const image = req.file
        const id = req.params.id
        const connection = await getConnection();
        const exist = await connection.query('SELECT * FROM User WHERE Id_user = ?', [id])
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


const postFavorite = async (req, res) => {
    try {
        const idUser = req.params.idUser;
        const idArt = req.params.idArt;
        const connection = await getConnection();
        
        // Verificar si el producto ya está en favoritos
        const existFavorite = await connection.query('SELECT * FROM Favorites WHERE Id_FKprod = ?', [idArt]);
        if (existFavorite.length > 0) {
            return res.status(406).json({ message: 'The favorite product already exists' });
        } 
        
      
        try {
             await connection.query('INSERT INTO Favorites SET ?', {
                Id_FKuser: idUser,
                Id_FKprod: idArt
            });
            
            // Envía respuesta de éxito
            res.status(201).json({
                message: 'The favorite product has been inserted',
                success: true
            });
        } catch (error) {
            // Si la inserción falla, manejar el error
            if (error.code === 'ER_NO_REFERENCED_ROW') {
                return res.status(404).json({ message: 'User not found' });
            } else {
                return res.status(409).json({ message: 'The user or product does not exist' });
            }
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const postAddShoppingCart = async (req, res) => {
    try {
        const idUser = req.params.idUser;
        const idArt = req.params.idArt;
        const cantidad = req.params.cantidad;
        const connection = await getConnection();

        // Verificar si el usuario y el artículo existen
        const userExists = await connection.query('SELECT * FROM User WHERE Id_user = ?', [idUser]);
        const artExist = await connection.query('SELECT * FROM Product WHERE Id_prod = ?', [idArt]);

        // Validar la existencia del usuario y el artículo
        if (userExists.length === 0 || artExist.length === 0) {
            return res.status(404).json({ message: 'The user or art does not exist' });
        }
        
          // Verificar si el artículo ya está en el carrito
          const checkExistingItem = await connection.query('SELECT * FROM Cart WHERE Id_userFK = ? AND Id_prodFK = ?', [idUser, idArt]);
          if (checkExistingItem.length > 0) {
              return res.status(409).json({ message: 'The art already exists in the shopping cart' });
          }


        // Agregar la compra al carrito
        const addBuy = {
            Id_userFK: idUser,
            Id_prodFK: idArt,
            quantity: cantidad
        };

        // Insertar la compra en el carrito 
        await connection.query('INSERT INTO Cart SET ?', addBuy);

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
        const {  descripcion,precioTotal ,tipoMoneda, status, fecha  } = req.body ;
        const connection = await getConnection();

        // Borrar todos los datos de la tabla 'shopping_cart' para este usuario
        await connection.query('DELETE FROM Cart WHERE Id_userFK = ?', [idUser]);

        // Obtener información del usuario 
        const userData = await connection.query('SELECT * FROM User WHERE Id_user = ?', [idUser]);

        if (userData.length === 0) {
            return res.status(404).json({ message: 'No data found for this specific user' });
        }

        // Insertar la compra en la tabla 'buy'
        const addBuy = {
            Id_FK_user: idUser,
            date_create:  fecha,
            description : descripcion,
            TotalPrice : precioTotal, 
            money_Type : tipoMoneda,
            status : status
            
        };

              
 

        const data = await connection.query('INSERT INTO purchases SET ?', addBuy);
        const sendedEmail = await sendEmail(
            userData[0].Email_user,
            descripcion,
            precioTotal

        ); 
  

        res.status(200).json({
            data: data,
            message: 'The buy has been payed',
            success: true,
            emailSended: sendedEmail.messageId ,
            status: 200
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const postMethods = {
    uploadImageFile,
    postArtById,
    postFavorite,
    postAddShoppingCart,
    postbuy,
    postCategory

}