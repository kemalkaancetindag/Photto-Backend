const express = require('express')
const app = express()
const port = 3001
const mongoose = require("mongoose");
const collectionRoutes = require("./routes/collectionRoutes")
const itemRoutes = require("./routes/itemRoutes")
const searchRoute = require("./routes/searchRoute")
const userRoutes = require("./routes/userRoutes")
const staticRoutes = require("./routes/staticRoutes")
const admin = require("firebase-admin")
var serviceAccount = require("./credentials/admin_sdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});  





mongoose.connect("mongodb://localhost:27017/PhottoDB", { useNewUrlParser: true , useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB Database Connection Established Succesfully");
});

app.use("/public",express.static(`${__dirname}/public`)); 



app.use("/api/collections",collectionRoutes)
app.use("/api/items",itemRoutes)
app.use("/api/explore",searchRoute)
app.use("/api/users", userRoutes)
app.use("/api/statics", staticRoutes)


app.get("/test",async (req,res) => {  
  console.log(process.cwd())
  
  
  res.json({ok:"ok"})

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
