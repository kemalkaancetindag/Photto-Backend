const express = require('express')
const app = express()
const port = 3000
const mintRoute = require("./routes/mintService")
const collectionRoute = require("./routes/collectionService")
const mongoose = require("mongoose");
const mintNFT = require('./helpers/mintNFT')




//app.use(formidable());


mongoose.connect("mongodb://localhost:27017/PhottoDB", { useNewUrlParser: true , useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB Database Connection Established Succesfully");
});


app.use('/mint-service', mintRoute)
app.use('/collection-service', collectionRoute)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
