const router = require("express").Router();
const multer = require("multer")
const pinToIpfs = require("../helpers/pinFileToIpfs")
const deploy = require("../helpers/deployContract")
const fs = require("fs");
const expressFormData = require("express-form-data")
const createItem = require("../db/itemOperations");
const {addToCollection,createCollection, getNextTokenId} = require("../db/collectionOperations");
const { checkUserExists, createUser, addCollection } = require("../db/userOperations");
const Collection = require("../models/CollectionModel");
const User = require("../models/UserModel");
const mintNFT = require("../helpers/mintNFT");






const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null,"C:/Users/Kaan/Desktop/photto_backend/mint_service_api/assets")
    },
    filename: (req, file, cb) => {        
          
        cb(null, file.originalname)
    }
})

const upload = multer({storage})



router.post("/mint-nft",upload.single('image'), async (req, res) => {    
    const abi = JSON.stringify(JSON.parse(fs.readFileSync("C:/Users/Kaan/Desktop/photto_backend/mint_service_api/contracts/Collection.json"))["abi"])
    responseObject = {}

    //COLLECTION DATA
    const wallet_address = req.body["walletAddress"]
    var contract_address = req.body["contractAddress"]                
    var collection_description = req.body["collectionDescription"]
    var collection_name = req.body["collectionName"]
    const collection_symbol = req.body["collectionSymbol"]
    var creator_name = null
    //COLLECTION DATA

    //NFT DATA
    const attributes = JSON.parse(JSON.stringify(req.body["attributes"]["traits"]))
    const owner = wallet_address
    const name = req.body["name"]
    const description = req.body["description"]
    const price = req.body["price"]
    const file_name = req.file.originalname    
    //NFT DATA
    try{
        const existingCollection = await Collection.findOne({contract_address:contract_address})
    
        const existingUser = await User.findOne({wallet_address:wallet_address})    
        var returnDataObject = null
        
                                
    
        if(existingUser && existingUser.name){
            creator_name = existingUser.name
        }
        else{
            creator_name = wallet_address
        }

        if(existingCollection){
            collection_name = existingCollection.collection_name
            contract_address = existingCollection.contract_address
            collection_description = existingCollection.collection_description
            returnDataObject = await createItem({attributes,owner,name,description,contract_address,collection_name,file_name, price,collection_description})
            await addToCollection(contract_address,returnDataObject.item._id)      

        }
        else{
            returnDataObject = await createItem({attributes,owner,name,description,contract_address,collection_name,file_name, price,collection_description})
            await addToCollection(contract_address,returnDataObject.item._id)      
        }
    
       
        
        await mintNFT(contract_address,`https://ipfs.io/ipfs/${returnDataObject.ipfsLocation}`,wallet_address)
        console.log("bitti")
        responseObject["success"] = true
        responseObject["error"] = null
        return res.json(responseObject)

    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        console.log(e)
        return res.json(responseObject)
    }
          
})


router.post("/deploy-contract",expressFormData.parse(), async (req,res) => {
    const collectionName = req.body["collectionName"] 
    const collectionSymbol = req.body["collectionSymbol"]
    const collection_description = req.body["collectionDescription"]
    const wallet_address = req.body["walletAddress"]    
    var creator_name = null
    const user = await User.findOne({wallet_address})

    

    if(user && user.name){
        creator_name = user.name
    }
    else{
        creator_name = wallet_address
    }

        
    var responseObject = {}

    try{
        const contractAddress = await deploy(collectionName, collectionSymbol)
        let collectionData = {
            contract_address :contractAddress,
            collection_symbol:collectionSymbol,
            collection_name:collectionName,
            collection_description,
            creator_name:creator_name,
            description: collection_description,                        
        }
        console.log(collectionData)
        await createCollection(collectionData)
        await addCollection(contractAddress,wallet_address)                 
        responseObject["success"] = true
        responseObject["data"] = contractAddress
    }
    catch(e){
        responseObject["success"] = false
        responseObject["data"] = e.toString()
    }
    
    
    res.json(responseObject)
})


module.exports = router;