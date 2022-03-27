const Web3 = require("web3")
const fs = require("fs")
var HDWalletProvider = require("@truffle/hdwallet-provider");
var provider = new HDWalletProvider("scale slam problem follow nurse humor work fiber entry trophy kite clay", "https://rpc-mumbai.maticvigil.com")
const web3 = new Web3(provider)

const constractJSON = JSON.parse(fs.readFileSync(`${process.cwd()}\\contracts/Collection.json`))
const abi = constractJSON["abi"]
const byteCode = constractJSON["byteCode"]["object"]





const mintNFT = async (contractAddress,tokenURI,to) => {
    console.log(contractAddress)
    console.log(tokenURI)
    console.log(to)

    const contract = await new web3.eth.Contract(abi, contractAddress)    
    console.log(contract)
    const result = await contract.methods.claimItem(tokenURI,to).send({from: "0x2571c1a0FC371610545A45779B1ddF8F3A212E53",gasLimit:6000000},)  
    console.log(result)
    console.log("bitti")
}

module.exports = mintNFT