const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema(
  {
    title_tr:{
        type:String
    },
    title_eng:{
      type:String
  },
    content_tr:{
        type:String,        
    },
    content_eng:{
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


AnnouncementSchema.pre('save', function(next) {
    var dt = new Date()
    var day = dt.getDay();
    var month = dt.getMonth();
    var year = dt.getFullYear();
    this.createdAtShown = `${day}/${month}/${year}`
    this.createdAt = dt.getTime()
    next();
});

const Announcement = mongoose.model('Announcement' , AnnouncementSchema);



module.exports = Announcement;