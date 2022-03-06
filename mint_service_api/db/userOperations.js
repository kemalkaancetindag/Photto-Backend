const User = require("../models/UserModel")


const createUser = async (userData) => {
    const {name,wallet_address} = userData
    const isUser = await checkUserExists(wallet_address)

    const newUser = new User({
        wallet_address,        
    })

    const user = await newUser.save()
    return user

}






const checkUserExists = async (wallet_address)  => {
    const user = await User.findOne({wallet_address:wallet_address})
    if(user){
        return user
    }
    return null
}

const addCollection = async (contractAddress, wallet_address) => {
    const user = await User.findOne({wallet_address:wallet_address})
    console.log(user)
    user.collections.push(contractAddress)
    await user.save()
}

module.exports = {checkUserExists, createUser, addCollection}