const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FAQSchema = new Schema(
  {
    question_tr:{
        type:String
    },
    question_eng:{
      type:String
  },
    answer_tr:{
        type:String,        
    },
    answer_eng:{
      type:String,        
  },
    image:{
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

FAQSchema.pre('save', function(next) {
    var dt = new Date()
    var day = dt.getDay();
    var month = dt.getMonth();
    var year = dt.getFullYear();
    this.createdAtShown = `${day}/${month}/${year}`
    this.createdAt = dt.getTime()
    next();
});

const FAQ = mongoose.model('FAQ' , FAQSchema);



module.exports = FAQ;