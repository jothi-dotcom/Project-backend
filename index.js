const express = require("express");
require("dotenv").config();
const cors = require("cors");
const dbConnection = require("./config/dbConnection");
const userRoutes = require("./routes/userRoutes");
const orderRoutes =require("./routes/orderRoutes");
const foodRoutes =require("./routes/foodRoutes");
const couponRoutes =require("./routes/couponRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const PaymentRoutes=require("./routes/PaymentRoutes");


const app = express();

app.use(cors());
app.use(express.json());;
app.use("/auth" ,userRoutes);
app.use("/order" ,orderRoutes);
app.use("/food" ,foodRoutes);
app.use("/coupon" ,couponRoutes);
app.use("/hotel",hotelRoutes);
app.use("/payment" , PaymentRoutes);

let Port = process.env.PORT || 3001

dbConnection();
app.listen(Port ,() =>{
    console.log(`server runnig on ${Port}`);
    
})