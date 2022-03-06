const { Item } = require("../models/ItemModel")

const router = require("express").Router()

router.get("/popular-nfts", async (req,res) => {
    var responseObject = {}
    try{
        const popularNFTS = await Item.aggregate([
                                    {
                                        "$project":{
                                            "document":"$$ROOT",
                                            "length":{"$size":"$favorites"}
                                        }
                                    },
                                    {"$sort":{"length":-1}},
                                    {"$limit":8}
                                ])
        
        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = popularNFTS
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }

    res.json(responseObject)

})

router.get("/new-nfts", async (req,res) => {

    var responseObject = {}
    try{
        const newNFTS = await Item.find({},{
            "document":"$$ROOT"
        },{limit:8,sort:{createdAt:-1}})
        
        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = newNFTS
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }

    res.json(responseObject)

})


module.exports = router
