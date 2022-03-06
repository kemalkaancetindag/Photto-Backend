const express = require('express')
const app = express()
const port = 3000
const mintRoute = require("./routes/mintService")
const collectionRoute = require("./routes/collectionService")
const mongoose = require("mongoose");




//app.use(formidable());

app.post('/test',(req,res) => {
    console.log(req.body["name"])
    const attributes = JSON.parse(req.body["attributes"])
    console.log(attributes)
    res.send("test")
})

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
