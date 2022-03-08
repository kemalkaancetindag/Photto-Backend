const Collection = require("../models/CollectionModel")
const { Item } = require("../models/ItemModel")
const User = require("../models/UserModel")


const router = require("express").Router()

router.get("/get-user", async (req,res) => {
    const {wallet_address} = req.query

    var responseObject = {}
    var dataObject = {}

    try{
        const user = await User.findOne({wallet_address})
        const items = await Item.find({
            '_id': { $in: user.items}
        })
        responseObject["success"] = true
        responseObject["error"] = null
        dataObject["user"] = user    
        dataObject["items"] = items        
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

