import { getConnection } from "../../database/database"

const getUsers = async (req , res) =>{

   try {
    const connection = await getConnection();
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;
    const data = await connection.query(`SELECT  Id_user, FirstNames_user, LastNames_user, Email_user , ImgProfile_user , DateCreated_user FROM user LIMIT ${limit} OFFSET ${offset}`);
    const totalPageData = await connection.query(`SELECT COUNT(*) as count  FROM User `);
    const  totalPage = Math.ceil(totalPageData[0].count /limit);



    if(!getUsers){
        return res.status(409).json('There are not Users');

    }else{
     res.send({
            data : data,
            pagination: {
              page : +page,
              totalPageData : totalPageData[0].count,
              limit : +limit 

            },

            success : true,
            statusCode : 200
       
          })
          console.log(data ) 
          console.log( 'This is my Total Items : '+'  '+ totalPageData[0].count ) 
          console.log( 'This is my Total Pages : '+'  '+ totalPage ) 
          return
    }


   
   } catch (error) {
    console.log(error);
  res.status(500).json({ message: 'Internal Server Error' });   
   }


}
const getAllArts = async (req, res) => {
  try {
    // Parámetros de paginación
    const page = parseInt(req.query.page) || 1; // Página actual
    const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de la página

    const connection = await getConnection();
    const offset = (page - 1) * pageSize;

    // Consulta para obtener los productos con paginación
    const data = await connection.query(
      `SELECT 
        Product.Id_prod AS Id,
        Product.Name_prod AS Name,
        Product.Description_prod AS Description,
        Product.Price_Prod AS Price,
        Product.Img_prod AS Img,
        Product.Status_prod AS Status,
        Product.DateCreated_prod,
        Category.Name_catg AS Category
      FROM 
        Product
      INNER JOIN 
        Category ON Product.Id_catg_FK = Category.Id_catg
      LIMIT ? OFFSET ?`,
      [pageSize, offset]
    );

    if (data.length === 0) {
      res.status(404).send({
        success: false,
        message: 'No se encontraron datos.'
      });
    } else {
      res.send({
        data: data,
        success: true,
        status: 200,
        pagination: {
        page : page,
        pageZise : pageSize
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};




 const getArtByIdUser = async (req,res) =>{
   try {
    const id = req.params.id
       const connection = await getConnection()

        const data = await connection.query('SELECT  Id_user AS ID_USER, FullName_user AS NOMBRE_ARTISTA, Id_Art, Descr_Art, Price_Art, Stock AS CANTIDAD,Category_Art, Img_Art  FROM art  JOIN user ON  Id_userFK =	Id_user WHERE Id_user = ?', [id])
        if (data.length===0) {
          res.status(409).send({
            success: false,
            message: 'No data found for the specified user'})
          
        }else{
          res.send({
            data : data,
            success : true,
            status : 200
          })

        } 
    
       
       
      
   } catch (error) {
    console.log(error)
    res.status(500).json({message : 'Internal Server Error'})
    
   }
} 

const getArtById = async (req, res) =>{
  try {
    const id = req.params.id
    const connection = await getConnection()
    const data = await connection.query('SELECT Title_Art AS Titulo, Descr_Art AS Descripcion, Price_Art AS Precio, Img_Art AS Imagen FROM art WHERE Id_Art = ?', [id])
    if (data.length===0) {
      res.status(409).send({
        success: false,
        message: 'No data found for the specified ART'})
      
    }else{
      res.send({
        data : data,
        success : true,
        status : 200
      })

    } 


    
  } catch (error) {
    
  }

}




const getFavoritesByUserId= async (req, res) =>{
  try {
      const id = req.params.id;
      const connection = await getConnection();
      const data = await connection.query('SELECT Id_favorites, Descr_Art AS DESCRIPCION, Price_Art AS PRECIO, Category_Art AS CATEGORIA, Img_Art AS IMAGEN FROM Favorites JOIN art  ON Id_FKart = Id_Art WHERE  Id_FKuser = ?', [id]);
      if(data.length ===0){
        res.status(409).json({message : 'No data found for this specific user'})

      }else{
        res.send({
          data : data,
          success : true,
          status : 200,
         
        })
      }
    
    
  } catch (error) {
    console.log(error)
    
  }

}

const getAllShoppingCartPurchase = async (req, res) =>{
  try {
    const id = req.params.id;
    const connection = await getConnection();
    const data = await connection.query(`
        SELECT 
            s.Id_cart AS Id_Carrito,
     
            a.Title_Art AS Titulo,
            a.Img_Art AS Imagen,
            a.Descr_Art AS Descripcion_producto,
            a.Price_Art AS Precio_Original,
            COUNT(*) AS Cantidad
        FROM 
            shopping_cart s 
            INNER JOIN user u ON s.Id_userFK = u.Id_user 
            INNER JOIN art a ON s.Id_artFK = a.Id_Art 
        WHERE 
            u.Id_user = ?  
        GROUP BY  
            s.Id_userFK, 
            u.FullName_user, 
            a.Id_Art, 
            a.Descr_Art, 
            a.Price_Art`, [id]);

    if (data.length === 0) {
        res.status(409).json({ message: 'No data found for this specific user' });
    } else {
        res.status(200).json({
            data: data,
            success: true
        });
    }
} catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
}
          

}
export const getMethods={
    getUsers,
/*     getAdressUseById, */
    getArtByIdUser,
    getAllArts,
    getFavoritesByUserId,
    getAllShoppingCartPurchase,
    getArtById 


}
