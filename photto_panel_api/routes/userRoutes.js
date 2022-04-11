const PanelUser = require("../models/PanelUserModel")
const User = require("../models/UserModel")
var CryptoJS = require("crypto-js");

const router = require("express").Router()

router.post("/new-panel-user", async (req,res) => {
    console.log(req.body)
    const {username,password} = req.body
    
    var responseObject = {}

    try{
        const newPanelUser = new PanelUser(
            {
                username,
                password:CryptoJS.HmacSHA1(password, "photto")
            }
        )

        await newPanelUser.save()
        responseObject["success"] = true
        responseObject["error"] = null
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
    }   

    res.json(responseObject)

})

router.get("/panel-users", async (req,res) => {

    var responseObject = {}

    try{
        const users = await PanelUser.find()
        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = users
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }
    console.log(responseObject)

    res.json(responseObject)
})

router.get("/app-users", async (req,res) => {

    var responseObject = {}

    try{
        const users = await User.find()
        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = users
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null

    }

    res.json(responseObject)

})

router.get("/waiting-confirmation", async (req,res) => {
    var responseObject = {}

    try{
        const users = await User.find({isConfirmPending:true})
        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = users
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null

    }

    res.json(responseObject)

})




module.exports = router