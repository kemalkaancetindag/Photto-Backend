const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('71e5304907f40cb37def', '276ffe4b64e97bc5cd7df73f2b6cdca6dd2759d1f9d33181d79e4b8a18f716b7');
const fs = require('fs');



async function pinToIpfs(path, metadata){
    var metadataWImageHash = await pinImage(path, metadata)
    var metadataHash = await pinMetadata(metadataWImageHash)
    
    return {data:metadataWImageHash, ipfsLocation:metadataHash}
}

async function pinImage(path, metadata) {
    const readableStreamForFile = fs.createReadStream(path);
    //var metadata = {"attributes":[{"trait_type":"Background Color","value":"Dark"}],"description":"Mobile Design","name":"Mobile Design"}
    var response = await pinata.pinFileToIPFS(readableStreamForFile)
    metadata["image"] = 'https://ipfs.io/ipfs/'+response["IpfsHash"]    
    return metadata
}



async function pinMetadata(data) {
    const options = {
        pinataMetadata: {
            name: "metadata.json",         
        },
    };
    var response = await pinata.pinJSONToIPFS(data, options)
    return response["IpfsHash"]
}



module.exports = pinToIpfs 