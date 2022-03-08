const Collection = require("../models/CollectionModel")
const { Item } = require("../models/ItemModel")


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

router.get("/single-collection", async (req,res) => {
    const {contract_address} = req.query

    var responseObject = {}
    var dataObject = {}

    try{
        const collection = await Collection.findOne({contract_address:contract_address})
        const items = await Item.find({
            '_id': { $in: collection.items}
        })
        

        
        dataObject["items"] = items
        dataObject["collection_data"] = collection
        responseObject["error"] = null
        responseObject["success"] = true
        responseObject["data"] = dataObject

        
    }
    catch(e){
        dataObject["items"] = null
        dataObject["collection_data"] = null
        responseObject["error"] = e.toString()
        responseObject["success"] = false
        responseObject["data"] = null        
    }

    res.json(responseObject)
})

router.get("/search-item", async (req,res) => {
    const {term, contract_address} = req.query

    var responseObject = {}

    try{
        const items = await Item.find({
            name:{$regex: `${term}`, $options:'i'},
            contract_address:contract_address
        })

        responseObject["error"] = null
        responseObject["success"] = true
        responseObject["data"] = items
    }
    catch(e){
        responseObject["error"] = e.toString()
        responseObject["success"] = false
        responseObject["data"] = null
    }

    res.json(responseObject)


})


module.exports = router