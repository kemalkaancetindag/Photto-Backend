const router = require("express").Router();
const multer = require("multer")
const pinToIpfs = require("../helpers/pinFileToIpfs")
const deploy = require("../helpers/deployContract")
const fs = require("fs");
const expressFormData = require("express-form-data")
const createItem = require("../db/itemOperations");
const {addToCollection,createCollection, getNextTokenId} = require("../db/collectionOperations");
const { checkUserExists, createUser, addCollection } = require("../db/userOperations");






const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null,"C:/Users/Kaan/Desktop/mint_service_api/assets")
    },
    filename: (req, file, cb) => {        
          
        cb(null, file.originalname)
    }
})

const upload = multer({storage})



router.post("/mint-nft",upload.single('image'), async (req, res) => {
    let contractAddress = req.body["contractAddress"]                
    const walletAddress = req.body["walletAddress"]    
    const fileName = req.file.originalname    
    const name = req.body["name"]        
    const attributes = JSON.parse(JSON.stringify(req.body["attributes"]["traits"]))    
    const description = req.body["description"]

    console.log(walletAddress)
    

    let metadata = {        
        "attributes":attributes,
        "description": description,        
        "name": name,        
    }         
    var imagePath = `C:/Users/Kaan/Desktop/mint_service_api/assets/${fileName}`
                           
    const {data,ipfsLocation} = await pinToIpfs(imagePath,metadata)

    data["owner"] = walletAddress    

    const user = await checkUserExists(walletAddress)    
    console.log(user)

    if(user){
        data["token_id"] = await getNextTokenId(contractAddress)
        const newItem = await createItem(data)
        await addToCollection(contractAddress,newItem._id)        
    }
    else{
        let userData = {
            wallet_address: walletAddress,            
        }
        const newUser = await createUser(userData)
        contractAddress = await deploy(collectionName, collectionSymbol)
            
        let collectionData = {
            contract_address :contractAddress,
            collection_symbol:collectionSymbol,
            collection_name:collectionName,
            description:collectionDescription,                        
        }
        
        
        await createCollection(collectionData)
        data["token_id"] = await getNextTokenId(contractAddress)
        await addCollection(contractAddress,walletAddress)           
        const newItem = await createItem(data)
        await addToCollection(contractAddress, newItem._id)
    }

   

    const abi = JSON.stringify(JSON.parse(fs.readFileSync("C:/Users/Kaan/Desktop/mint_service_api/abi.json")))    
    

    
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