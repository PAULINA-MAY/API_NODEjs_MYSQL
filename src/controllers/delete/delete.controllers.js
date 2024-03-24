import { getConnection  } from "../../database/database";

const deleteUserById = async(req, res) =>{
       try {
              const id = req.params.id
              const connection = await getConnection()
              const  exist = await connection.query('SELECT * FROM user WHERE Id_user = ?' , [id])
              if(exist.length=== 0){
                     res.send(
                        {
                            success: false,
                            message: 'No data found for the specified user',
                            status : 404
                        }
                     )
              }else{
                     const deleted = await connection.query('DELETE FROM user  WHERE  Id_user = ?', [id]); 
                     res.send({
                            data : deleted,
                            message : 'The user has been deleted',
                            succes : true,
                            status : 200



                     })
              }
        
       } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });   
        
       }

}

const deleteProductById = async (req,res)=>{

        try {
              const id = req.params.id
              const connection = await getConnection()
              const  exist = await connection.query('SELECT * FROM Product WHERE Id_prod = ?' , [id])
              if(exist.length=== 0){
                     res.send(
                            {
                                success: false,
                                message: 'No data found for the specified product',
                                status : 404
                            }
                         )
              }else{
                     const deleted = await connection.query('DELETE FROM Product  WHERE  Id_prod = ?', [id]); 
                     if(deleted.affectedRows === 0){
                            return res.status(409).json({ message: "error when trying to delete the product" });
                     }else{
                            res.send({
                                   data : deleted,
                                   message : 'The art has been deleted',
                                   succes : true,
                                   status : 200
       
       
       
                            })

                     }
                    

              }
              
        } catch (error) {
              console.log(error)
              res.status(500).json({ message: 'Internal Server Error' });   

              
        }
}
const deleteFavoritesById = async (req, res)=>{
       try {
              const id = req.params.id
              const connection = await getConnection()
              const  exist = await connection.query('SELECT * FROM  Favorites WHERE Id_favorites = ?' , [id])
              if(exist.length=== 0){
                     res.send(
                            {
                                success: false,
                                message: 'No data found for the specified Favorite',
                                status : 409
                            }
                         )
              }else{
                     const data = connection.query('DELETE FROM Favorites WHERE Id_favorites = ?', [id])
                     res.send({
                            message : 'The favorite art has been deleted',
                            success : true,
                            status : 200
                     })
              
              }
              
              
       } catch (error) {
              console.log(error)
              res.status(500).json({ message: 'Internal Server Error' });   
              
       }
}

const deleteShoppingCartById = async (req, res) => {
       try {
           const id = req.params.id;
           const connection = await getConnection();
   
           // Verificar si la compra existe en el carrito
           const purchase = await connection.query('SELECT * FROM Cart WHERE Id_cart = ?', [id]);
   
           if (purchase.length===0) {
               return res.status(404).json({ success: false, message: 'No data found for the specified purchase', status: 404 });
           }else{
           // Eliminar la entrada del carrito
           const deleted = await connection.query('DELETE FROM Cart WHERE Id_cart = ?', [id]);
           if(deleted.affectedRows === 0){
              return res.status(409).json({ success: false, message: 'The purchase has not been deleted', status: 409 });

           }else{
              return res.status(200).json({ success: true, message: 'The purchase has been deleted', status: 200 });
           }
           }
   
       
       }catch (error) {
              console.log(error)
              res.status(500).json({ message: 'Internal Server Error' });   
              
       }
};



export const deleteMethods={
       deleteUserById,
       deleteProductById,
       deleteFavoritesById,
       deleteShoppingCartById
   
   }