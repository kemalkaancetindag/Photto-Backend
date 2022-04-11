const mongoose = require("mongoose");
const Collection = require("./CollectionModel");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name:{
        type:String
    },
    wallet_address:{
        type:String,
        required:true
    },
    isConfirmed:{
        type:Boolean,        
    },
    collections:[],
    items:[],
    favorites:[],
    image:{
      type:String
    },
    banner_image:{
      type:String
    },
  },
  
);



const User = mongoose.model('User' , UserSchema);

module.exports = User;