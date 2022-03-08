const pinToIpfs = require("../helpers/pinFileToIpfs")
const Collection = require("../models/CollectionModel")
let {Item} = require("../models/ItemModel")
const {createCollection} = require("./collectionOperations")

const createItem = async (nftData) => {
    let {attributes,owner,name,description,contract_address,collection_name,file_name,price } = nftData    

    const collection = await Collection.findOne({contract_address:contract_address});    
    const token_id = collection.items.length + 1
    //IPFS OPERATION
    let metadata = {        
      "attributes":attributes,
      "description": description,        
      "name": name,        
    }         
    var imagePath = `C:/Users/Kaan/Desktop/photto_backend/mint_service_api/assets/${file_name}`                           
    const {data,ipfsLocation} = await pinToIpfs(imagePath,metadata)     
    const image = data["image"]
    //IPFS OPERATION
                 
    const newNFT = new Item({
      views:0,
      name,
      description,
      owner,
      image,
      attributes,
      token_id,
      contract_address,
      collection_name,
      price            
    });
    

    const saveResponse = await newNFT.save()

    return saveResponse
     
      
}

module.exports = createItem