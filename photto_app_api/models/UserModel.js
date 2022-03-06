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
    collections:[]    
  },
  
);



const User = mongoose.model('User' , UserSchema);

module.exports = User;