import { getConnection } from "../../database/database"

const updateAdressUserById = async (req, res)=>{

      try {
        const id = req.params.id
        const { codigoPostal, ciudad, numExt, numInter} = req.body
        const connection = await getConnection();
        
           const updateAdress = {
               Cp_Dir: codigoPostal, 
               City_Dir: ciudad,
               NumExt_Dir: numExt,
               NumInter_Dir : numInter
       
           };
           const query = 'UPDATE adress SET ? WHERE Id_user_FK = ?';
           const values = [updateAdress, id];
           const data = await connection.query(query, values);
            if(data.affectedRows === 0){
              res.status(409).send({
                success: false,
                message: 'No data found for the specified user'})
            }else{
              return res.send({
                data : data,
                message : 'The user Adress has been updated',
                succes : true,
                status: 200
             })

            }
            
            
        
      } catch (error) {
        console.log(error)
        res.status(500).json({message : 'Internal Server Error'})
        
      }

}


export const  putMethods ={
    updateAdressUserById 

}