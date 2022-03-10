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

router.get("/collected-items", async (req,res) => {
    const {wallet_address} = req.query
    var responseObject = {}
    try{
        const user = await User.findOne({wallet_address})
        const items = await Item.find({
            $in:{
                "owner":user.items
            }
        })    

        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = items
        
        
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }


    res.json(responseObject)
    

})

router.get("/search-collected-items", async (req,res) => {
    const {term, wallet_address} = req.query
    var responseObject = {}

    try{
        const items = await Item.find({
            $and:[
                {name:{$regex: `${term}`, $options:'i'}},
                {owner:wallet_address}
            ]            
        })

        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = items
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }


    res.json(responseObject)
})

router.get("/favorites", async (req,res) => {

    const {wallet_address} = req.query
    var responseObject = {}
    try{
        const user = await User.findOne({wallet_address})
        console.log(user.favorites)
        const favoriteItems = await Item.find({
            "_id":{
                $in:user.favorites
            }
        })


        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = favoriteItems
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }

    res.json(responseObject)

})

router.get("/favorite", async (req,res) => {
    const {wallet_address, token_id, contract_address} = req.query    

    var responseObject = {}

    try{
        const user = await User.findOne({wallet_address})
        console.log(user.favorites)
        const item = await Item.findOne({
                    $and:[
                        {token_id},
                        {contract_address}
                    ]
                })
        console.log(item.favorites)
        if(item.favorites.includes(wallet_address)){
            var new_item_favorites_arr = item.favorites.filter(item => item !== wallet_address)
            var new_user_favorites_arr = user.favorites.filter(item => item !== item._id)
            
            user.favorites = new_user_favorites_arr
            item.favorites = new_item_favorites_arr
        }
        else{
            user.favorites.push(item._id)
            item.favorites.push(wallet_address)
        }
        await user.save()
        await item.save()

        responseObject["success"] = true
        responseObject["error"] = null
        
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
    }

    return res.json(responseObject)

})

module.exports = router

