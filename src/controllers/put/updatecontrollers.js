import { getConnection } from "../../database/database"
const cloudinary = require("../../cloudinary");



const updateCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const image = req.file;
    const { name, description } = req.body;
    const connection = await getConnection();
    
      const urlImage = await cloudinary.uploader.upload(image.path);
      const updateCategory = {
        Name_catg: name, 
        Description_catg: description,
        Img_catg: urlImage.url
    };
    const query = 'UPDATE Category SET ? WHERE Id_catg = ?';
    const values = [updateCategory, id];
    const data = await connection.query(query, values);
    if(data.affectedRows === 0){
      res.status(409).send({
        success: false,
        message: 'No data found for the specified Category'})
    }else{
      return res.send({
        message : 'The Category has been updated',
        succes : true,
        status: 200
     })

    }



       
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateRolUserById = async (req, res) =>{
   try {
    const id = req.params.id;
    const { name} = req.body;
    const connection = await getConnection();
    const updateRol = {
      Name_rol : name
  };
  const query = 'UPDATE Rol SET ? WHERE Id_user_FK = ?';
  const values = [updateRol, id];
  const data = await connection.query(query, values);
  if(data.affectedRows === 0){
    res.status(409).send({
      success: false,
      message: 'No data found for the specified User'})
  }else{
    return res.send({
      message : 'The User rol has been updated',
      succes : true,
      status: 200
   })

  }




    
   } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
    
   }
  
}





export const  putMethods ={

    updateCategoryById,
    updateRolUserById 

}