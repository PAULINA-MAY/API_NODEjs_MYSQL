const multer = require('multer')
/* const sharp = require('sharp') */

const storage = multer.diskStorage({
/*     destination: (req, file, cb) => {
        cb(null, 'C:/Home/API-PROYECTO/src/images')
    }, */
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
  
        console.log(`${Date.now()}.${ext}`)
        cb(null, `${Date.now()}.${ext}`)
    }
})

export const upload = multer({storage})