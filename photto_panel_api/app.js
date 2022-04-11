const express = require('express')
const app = express()
const port = 3002
const mongoose = require("mongoose");
const infoRoutes = require("./routes/infoRoutes")
const userRoutes = require("./routes/userRoutes")
const authRoutes = require("./routes/authRoutes")
const bodyParser = require("body-parser")
const cors = require("cors")







mongoose.connect("mongodb://localhost:27017/PhottoDB", { useNewUrlParser: true , useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB Database Connection Established Succesfully");
});


app.use(cors())

app.use("/api/info", infoRoutes)
app.use(bodyParser.json())
app.use("/api/users",userRoutes)
app.use("/api/auth",authRoutes)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
