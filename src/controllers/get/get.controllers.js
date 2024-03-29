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
const getAllProducts = async (req, res) => {
  try {
    // Parámetros de paginación
    const page = parseInt(req.query.page) || 1; // Página actual
    const pageSize = parseInt(req.query.pageSize) || 30; // Tamaño de la página

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
        User.FirstNames_user AS NameArtist,
        Category.Name_catg AS Category
      FROM 
        Product
      INNER JOIN 
        Category ON Product.Id_catg_FK = Category.Id_catg
      INNER JOIN 
        User_Prod ON Product.Id_prod = User_Prod.Id_p_fk
      INNER JOIN 
        User ON User_Prod.Id_u_fk = User.Id_user
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
}

const getAllCategories = async (req, res) =>{
    try {

      const connection = await getConnection();
      const data = await connection.query('SELECT  Id_catg  AS Id , Name_catg ,Description_catg AS Description , Img_catg AS Img , DateCreated_catg AS Date_Created FROM Category ')
      if(data.length ===0){
        res.status(404).json({message : 'No data found '})

      }else{
        res.send({
          data : data,
          success : true,
          status : 200,
        })

      }
      
    } catch (error) {
      
    }
}

const getCartByIdUser = async (req, res) =>{
  try {
    const id = req.params.id;
    const connection = await getConnection();
    const data = await connection.query(`
        SELECT 
            c.Id_cart AS Id,
     
            p.Name_prod AS NameProd,
            p.Img_prod AS ImgProd,
            p.Description_prod AS DescProd,
            p.Price_Prod AS priceProd,
            COUNT(*) AS quantity
        FROM 
            Cart c
            INNER JOIN user u ON c.Id_userFK = u.Id_user 
            INNER JOIN Product p ON c.Id_prodFK = p.Id_prod
        WHERE 
            u.Id_user = ?  
        GROUP BY  
            c.Id_userFK, 
            u.FirstNames_user, 
            p.Id_prod, 
            p.Description_prod, 
            p.Price_Prod`, [id]);

    if (data.length === 0) {
        res.status(404).json({ message: 'No data found for this specific user' });
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

const getUserById = async (req, res) =>{
  try {
    const id = req.params.id;
    const connection = await getConnection();
    
    const  data = await connection.query('SELECT FirstNames_user AS Names, LastNames_user AS LastNames, Email_user AS Email, ImgProfile_user AS Img FROM User   WHERE Id_user = ?',[id] )
    if(data.length === 0){
      res.status(404).json({ message: 'No data found for this specific user' });
    }else{
      res.status(200).json({
        data: data,
        success: true
    });
    }
    
  } catch (error) {
    
  }


}
const getArtById = async (req, res) =>{
  try {
    const id = req.params.id
    const connection = await getConnection()
    const data = await connection.query('SELECT Name_prod AS Nombre,Description_prod AS Description, Price_Prod AS Price, Img_prod AS Image FROM  Product  WHERE Id_prod = ?', [id])
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

 const getProdByIdUser = async (req,res) =>{
   try {
    const id = req.params.id
       const connection = await getConnection()

        const data = await connection.query('SELECT   u.FirstNames_user AS Nombres, u.LastNames_user AS Apellidos,  u.ImgProfile_user AS Profile,  p.Name_prod AS Nombre_del_producto,  p.Description_prod AS Descripcion,  p.Price_Prod AS Precio,  p.Status_prod AS Estado, p.Img_prod AS ImgProduct, c.Name_catg AS Categoria  FROM     User_Prod up  INNER JOIN User u ON up.Id_u_fk = u.Id_user  INNER JOIN Product p ON up.Id_p_fk = p.Id_prod  INNER JOIN Category c ON p.Id_catg_FK = c.Id_catg  WHERE Id_user = ?', [id])
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

const getFavoritesByUserId= async (req, res) =>{
  try {
      const id = req.params.id;
      const connection = await getConnection();
      const data = await connection.query('SELECT Id_favorites AS Id , Name_prod AS NameProduct, Description_prod AS Description, Price_Prod AS Price , Img_prod  FROM  User INNER JOIN  Favorites  ON  Id_user = Id_FKuser  INNER JOIN  Product  ON  Id_FKprod = Id_prod  WHERE   Id_user = ?', [id]);
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






export const getMethods={
    getUsers,
    getProdByIdUser,
    getAllProducts,
    getFavoritesByUserId,
    getCartByIdUser,
    getArtById ,
    getAllCategories ,
    getUserById


}
