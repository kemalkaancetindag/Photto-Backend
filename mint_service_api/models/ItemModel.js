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
        type:Number
    },
    price:{
        type:Number
    },
    createdAt:{
        type: Number
    },
    contract_address:{
        type:String,
        required:true
    },
    collection_name:{
        type:String,
        required:true
    },
    favorites:[],
    collection_description:{
        type:String,        
    },
    onSale:{
        type:Boolean,
        required:true
    }
    
  },
  
);


ItemSchema.pre('save', function(next) {
    this.createdAt = new Date().getTime();
    next();
});

const Item = mongoose.model('Item' , ItemSchema);

module.exports = {Item};