const Collection = require("../models/CollectionModel")

const router = require("express").Router()



router.get("/popular-collections", async (req,res) => {
    var responseObject = {}
    try{
        const popularColelctions = await Collection.find({},{},{limit:8,sort:{traded:-1}})
        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = popularColelctions        
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }

    res.json(responseObject)
    
    
})


module.exports = router