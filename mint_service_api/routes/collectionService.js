const Collection = require("../models/CollectionModel");
const User = require("../models/UserModel");

const router = require("express").Router();


router.get("/collections", async (req,res) => {
    const {wallet_address} = req.query    
    console.log(wallet_address)
    const user = await User.findOne({wallet_address:wallet_address})
    var responseObject = {}
    

    if(user){        
        const collections = await Collection.find({'contract_address': { $in: user.collections}}).select({"contract_address":1, "collection_name":1,"_id":0})
        console.log(collections)
        responseObject["collections"] = collections
        responseObject["success"] = true
        
    }
    else{
        responseObject["success"] = false
        responseObject["collections"] = null
        
    }
    console.log(responseObject)
    return res.json(responseObject)

    
})


module.exports = router