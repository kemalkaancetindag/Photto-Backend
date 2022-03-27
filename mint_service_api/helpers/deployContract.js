const Web3 = require("web3")
const fs = require("fs")
var HDWalletProvider = require("@truffle/hdwallet-provider");
var provider = new HDWalletProvider("scale slam problem follow nurse humor work fiber entry trophy kite clay", "https://rpc-mumbai.maticvigil.com")
const web3 = new Web3(provider)

const constractJSON = JSON.parse(fs.readFileSync(`${process.cwd()}/contracts/Collection.json`))
const abi = constractJSON["abi"]
const byteCode = constractJSON["byteCode"]["object"]



const deploy = async (collectionName, collectionSymbol) => {    
    const result = await new web3.eth.Contract(abi)
    .deploy({data: '0x' + byteCode, arguments: [collectionName, collectionSymbol]}) 
    .send({from: "0x2571c1a0FC371610545A45779B1ddF8F3A212E53"});
    return result["_address"]
}



//var encoded = web3.eth.abi.encodeParameters(["string"],["https://ipfs.io/ipfs/QmU77hRLrqeErqnBNqS8gmd7adRUnkMDtFgNTMEoiCHozj"])
module.exports = deploy
//deployTest()
