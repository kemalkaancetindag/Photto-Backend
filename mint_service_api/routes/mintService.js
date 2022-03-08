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
    // GET COLLECTION DATA CHECK COLLECTION EXISTS    

    //COLLECTION DATA
    const wallet_address = req.body["walletAddress"]
    var contract_address = req.body["contractAddress"]                
    const collection_description = req.body["collectionDescription"]
    var collection_name = req.body["collectionName"]
    const collection_symbol = req.body["collectionSymbol"]
    var creator_name = null
    //COLLECTION DATA

    //NFT DATA
    const attributes = JSON.parse(req.body["attributes"])
    const owner = wallet_address
    const name = req.body["name"]
    const description = req.body["description"]
    const price = req.body["price"]
    const file_name = req.file.originalname    
    //NFT DATA

    const existingCollection = await Collection.findOne({contract_address:contract_address})
    console.log(existingCollection)
    const existingUser = await User.findOne({wallet_address:wallet_address})
    
    

    if(existingUser && existingUser.name){
        creator_name = existingUser.name
    }
    else{
        creator_name = wallet_address
    }

    if(existingUser === null){
        await createUser({wallet_address})
        await createCollection({contract_address, collection_description, collection_name, collection_symbol, creator_name})        
        const item = await createItem({attributes,owner,name,description,contract_address,collection_name,file_name, price})
        await addCollection(contract_address,wallet_address)
        await addToCollection(contract_address,item._id)
    }
    else{
        if(existingCollection === null){       
            console.log("geldi")
            await createCollection({contract_address, collection_description, collection_name, collection_symbol, creator_name})        
            const item = await createItem({attributes,owner,name,description,contract_address,collection_name,file_name, price})
            await addToCollection(contract_address,item._id)
            await addCollection(contract_address,wallet_address)            
        }
        else{
            collection_name = existingCollection.collection_name
            contract_address = existingCollection.contract_address
            const item = await createItem({attributes,owner,name,description,contract_address,collection_name,file_name, price})
            await addToCollection(contract_address,item._id)                
        }
    }

    


   

    const abi = JSON.stringify(JSON.parse(fs.readFileSync("C:/Users/Kaan/Desktop/photto_backend/mint_service_api/abi.json")))    
    

    
    res.json({success:true, ipfsLocation:`https://ipfs.io/ipfs/${ipfsLocation}`, abi})
})


router.post("/deploy-contract",expressFormData.parse(), async (req,res) => {
    const collectionName = req.body["collectionName"] 
    const collectionSymbol = req.body["collectionSymbol"]
    const walletAddress = req.body["walletAddress"]    
    
    
    var responseObject = {}

    try{
        const contractAddress = await deploy(collectionName, collectionSymbol)
        let collectionData = {
            contract_address :contractAddress,
            collection_symbol:collectionSymbol,
            collection_name:collectionName,
            description:"",                        
        }
        await createCollection(collectionData)
        await addCollection(contractAddress,walletAddress)                 
        responseObject["success"] = true
        responseObject["data"] = contractAddress
    }
    catch(e){
        responseObject["success"] = false
        responseObject["data"] = e.toString()
    }

    console.log(responseObject)
    
    res.json(responseObject)
})


module.exports = router;