const express = require('express')
const app = express()
const port = 3001
const mongoose = require("mongoose");
const collectionRoutes = require("./routes/collectionRoutes")
const itemRoutes = require("./routes/itemRoutes")
const searchRoute = require("./routes/searchRoute")





mongoose.connect("mongodb://localhost:27017/PhottoDB", { useNewUrlParser: true , useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB Database Connection Established Succesfully");
});


app.use("/api/collections",collectionRoutes)
app.use("/api/items",itemRoutes)
app.use("/api/explore",searchRoute)





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
