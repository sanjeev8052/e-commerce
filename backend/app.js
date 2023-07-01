const express = require("express")
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser")
const { connectDB } = require("./config/Database");


const app = express();
app.use(express.json())
app.use(cookieParser())

//Config 
dotenv.config({ path: "backend/config/config.env" })
connectDB();




// use Routes 
app.use("/api/v1", product = require("./Routes/Product"))
app.use("/api/v1", user = require("./routes/userRoute"))
app.use("/api/v1", order = require("./routes/orderRoute"))

module.exports = app 