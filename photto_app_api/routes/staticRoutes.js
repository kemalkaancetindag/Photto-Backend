const router = require("express").Router()
const { response } = require("express")
const multer = require("multer")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null,"C:/Users/Kaan/Desktop/photto_backend/photto_app_api/assets/collection_images")
    },
    filename: (req, file, cb) => {        
          
        cb(null, file.originalname)
        
    }
})

const upload = multer({storage})



router.post("/upload-collection-image",upload.single('collectionImage'),async (req,res) => {
    console.log(req.file.originalname)
    var responseObject = {}
    responseObject["success"] = true
    return res.json(responseObject)    
})


module.exports = router
