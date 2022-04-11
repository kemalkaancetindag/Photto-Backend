const jwt = require("jsonwebtoken")
var CryptoJS = require("crypto-js");
const PanelUser = require("../models/PanelUserModel");

const router = require("express").Router()


router.post("/login", async (req,res) => {
    const {username,password} = req.body
    const hashedPassword = CryptoJS.HmacSHA1(password, "photto").toString()
    console.log(hashedPassword)
    var responseObject = {}
    try{
        const user = await PanelUser.findOne({username,password:hashedPassword})
        
        if(user){
            var token = await jwt.sign({username:user.username}, 'photto', { algorithm: 'RS256'});
            responseObject["success"] = true
            responseObject["error"] = null    
            responseObject["token"] = token    

        }
        else{
            responseObject["success"] = false
            responseObject["error"] = "No such user"    
            responseObject["token"] = null    
        }
    }
    catch(e){
            responseObject["success"] = false
            responseObject["error"] = e.toString()    
            responseObject["token"] = null    
    }

    return res.json(responseObject)
})


module.exports = router