const { Item } = require("../models/ItemModel")
const Collection = require("../models/CollectionModel")

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

router.get("/single-nft", async (req,res) => {

    var {contract_address,token_id} = req.query
    responseObject = {}    
    
    try{
        const collection = await Collection.findOne({contract_address})
        console.log(collection["creator_name"] )
        const item = await Item.findOne({
          contract_address:contract_address,
          token_id:token_id
        })

        
        
        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = item
        responseObject["collection_description"] = collection.description
        responseObject["creator"] = collection.creator_name        
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }
    

    res.json(responseObject)

})

router.get("/trade-nft", async (req,res) => {
    const {new_owner, token_id, contract_address,amount} = req.query
    var responseObject = {}
   

    try{
        await Item.findOneAndUpdate({token_id,contract_address},{owner:new_owner})
        var collection = await Collection.findOne({contract_address})
        if(collection.trades){
            collection.trades.push({amount:parseFloat(amount),date:Date.now()})
        }
        else{
            collection.trades = [{amount:parseFloat(amount),date:Date.now()}]
        }

        await collection.save()

        responseObject["success"] = true
        responseObject ["error"] = null
    }
    catch(e){
        responseObject["success"] = false
        responseObject ["error"] = e.toString()
    }

    return res.json(responseObject)
})


module.exports = router
