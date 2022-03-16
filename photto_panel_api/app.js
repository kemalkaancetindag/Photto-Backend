const express = require('express')
const app = express()
const port = 3002
const mongoose = require("mongoose");
const infoRoutes = require("./routes/infoRoutes")





mongoose.connect("mongodb://localhost:27017/PhottoDB", { useNewUrlParser: true , useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB Database Connection Established Succesfully");
});


app.use("/api/info", infoRoutes)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
