let Collection = require("../models/CollectionModel")

const createCollection = async (collectionData) => {
    const {contract_address, collection_description, collection_name, collection_symbol, collection_image,creator_name} = collectionData 
    console.log("Craete Collection")
    console.log(collection_description)
    const newCollection = new Collection({
        contract_address,
        collection_description,
        collection_name,
        collection_symbol,            
        creator_name,  
        traded:0,              
    })

    await newCollection.save()    
}


const addToCollection = async (contractAddress,itemId) => {
    const collection = await Collection.findOne({contract_address:contractAddress})
    collection.items.push(itemId)
    await collection.save()
}

const getNextTokenId = async (contractAddress) => {
    const collection = await Collection.findOne({contract_address:contractAddress})
    return collection.items.length + 1
}




module.exports = {createCollection, addToCollection,getNextTokenId}