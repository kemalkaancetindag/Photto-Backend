const mongoose = require("mongoose");

const Schema = mongoose.Schema;



const ItemSchema = new Schema(
  {
    owner: {
      type: String,
      required: true,      
      trim: true,      
    },
    attributes:[],
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    image:{
        type:String,
        required:true
    },
    token_id:{
        type:Number,
        required:true,
    },
    views:{
        type:Number,
    },
    favorites:{
        type:[]
    },
    price:{
        type:Number
    },
    contract_address:{
        type:String,
        required:true
    },
    onSale:{
        required:true,
        type:Boolean
    }
  },
  
);




const Item = mongoose.model('Item' , ItemSchema);

module.exports = {Item};