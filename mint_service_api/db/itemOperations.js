let {Item} = require("../models/ItemModel")

const createItem = async (nftData) => {
    let {attributes,owner,name,description,image,token_id } = nftData    
    //attributes = JSON.parse(attributes)
   
    

    

  
    const newNFT = new Item({
      name,
      description,
      owner,
      image,
      attributes,
      token_id
    });
    

    const saveResponse = await newNFT.save()

    return saveResponse
     
      
}

module.exports = createItem