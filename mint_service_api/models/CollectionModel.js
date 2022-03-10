const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CollectionSchema = new Schema(
  {
    
    items:[],
    contract_address:{
        type:String,
        required:true
    },   
    collection_name:{
        type:String,
        required:true,
    },
    collection_symbol:{
        type:String,
        required:true
    },
    image:{
        type:String,        
    },
    owners:{
        type:Number
    },
    floor_price:{
        type:Number,        
    },
    traded:{
        type:Number
    },
    creator_name:{
        type:String,
        required:true
    },
    collection_description:{
        type:String
    }
  },
  
);



const Collection = mongoose.model('Collection' , CollectionSchema);

module.exports = Collection;