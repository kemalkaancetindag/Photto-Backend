const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PanelUserSchema = new Schema(
  {
    username:{
        type:String
    },
    password:{
      type:String
  },  
    createdAtShown:{
        type:String
    },
    createdAt:{
        type:Number
    }
  },
  
);

PanelUserSchema.pre('save', function(next) {
    var dt = new Date()
    var day = dt.getDay();
    var month = dt.getMonth();
    var year = dt.getFullYear();
    this.createdAtShown = `${day}/${month}/${year}`
    this.createdAt = dt.getTime()
    next();
});

const PanelUser = mongoose.model('PanelUser' , PanelUserSchema);



module.exports = PanelUser;