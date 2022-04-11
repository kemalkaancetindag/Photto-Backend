const router = require("express").Router()

const multer = require("multer")
const Collection = require("../models/CollectionModel")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, `${process.cwd()}/public/assets/collection_images`)
    },
    filename: (req, file, cb) => {

        cb(null, file.originalname)

    }
})

const upload = multer({ storage })



router.post("/upload-collection-image", upload.fields([{
    name: 'collectionImage', maxCount: 1
}, {
    name: 'collectionBannerImage', maxCount: 1
}]), async (req, res) => {
    const { contractAddress } = req.body

    console.log(req.files)

    var responseObject = {}
    try {
        await Collection.findOneAndUpdate({ contract_address: contractAddress }, { image: `/public/assets/collection_images/${req.files["collectionImage"][0].originalname}`, banner_image:`/public/assets/collection_images/${req.files["collectionBannerImage"][0].originalname}`})
        responseObject["success"] = true
        responseObject["error"] = null
    }
    catch (e) {
        responseObject["success"] = false
        responseObject["error"] = e.toString()
    }

    return res.json(responseObject)
})


module.exports = router
