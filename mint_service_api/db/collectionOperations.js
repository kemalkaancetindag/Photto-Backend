let Collection = require("../models/CollectionModel")

const createCollection = async (collectionData) => {
    const {contract_address, description, collection_name, collection_symbol, image} = collectionData 

    const newCollection = new Collection({
        contract_address,
        description,
        collection_name,
        collection_symbol,            
        image:"image"

    })

    const saveResponse = await newCollection.save()
    return saveResponse._id
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