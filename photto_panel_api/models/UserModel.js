const mongoose = require("mongoose");

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
    isConfirmPending:{
      type:Boolean
    },
    image:{
      type:String
    },
    banner_image:{
      type:String
    },
    instance_token:{
      type:String
    },
    collections:[],
    items:[],
    favorites:[]    
  },
  
);



const User = mongoose.model('User' , UserSchema);

module.exports = User;