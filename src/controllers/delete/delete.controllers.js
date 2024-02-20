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
                            status : 409
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

const deleteArtById = async (req,res)=>{

        try {
              const id = req.params.id
              const connection = await getConnection()
              const  exist = await connection.query('SELECT * FROM art WHERE Id_Art = ?' , [id])
              if(exist.length=== 0){
                     res.send(
                            {
                                success: false,
                                message: 'No data found for the specified art',
                                status : 409
                            }
                         )
              }else{
                     const deleted = await connection.query('DELETE FROM art  WHERE  Id_Art = ?', [id]); 
                     res.send({
                            data : deleted,
                            message : 'The art has been deleted',
                            succes : true,
                            status : 200



                     })

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
                     data : data,
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
           const purchase = await connection.query('SELECT * FROM shopping_cart WHERE Id_cart = ?', [id]);
   
           if (purchase.length===0) {
               return res.status(404).json({ success: false, message: 'No data found for the specified purchase', status: 404 });
           }else{
              // Obtener el ID del artículo que se está eliminando
              const idArt = purchase.Id_artFK;
              
           // Incrementar el stock del artículo eliminado
           await connection.query('UPDATE art SET Stock = Stock + 1 WHERE Id_Art = ?', [idArt]);
   
           // Eliminar la entrada del carrito
           const deleted = await connection.query('DELETE FROM shopping_cart WHERE Id_cart = ?', [id]);
           if(deleted.length === 0){
              return res.status(404).json({ success: false, message: 'The purchase has not been deleted', status: 404 });

           }else{
              return res.status(200).json({ success: false, message: 'The purchase has been deleted', status: 404 });
           }
           }
   
       
       }catch (error) {
              console.log(error)
              res.status(500).json({ message: 'Internal Server Error' });   
              
       }
};



export const deleteMethods={
       deleteUserById,
       deleteArtById,
       deleteFavoritesById,
       deleteShoppingCartById
   
   }