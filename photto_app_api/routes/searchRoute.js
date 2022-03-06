const { Item } = require("../models/ItemModel")
const  Collection  = require("../models/CollectionModel")

const router = require("express").Router()

router.get("/search", async (req,res) => {
    var {term} = req.query
    console.log(term)

    const items = await Item.find({
        name:{$regex: `${term}`, $options:'i'}
    })

    const collections = await Collection.find({
        collection_name:{$regex: `${term}`, $options:'i'}
    })


    var responseObject = {}
    var dataObject = {}
    try{
       
        dataObject["collections"] = collections
        dataObject["items"] = items
        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = dataObject
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }

    res.json(responseObject)

})




module.exports = router
