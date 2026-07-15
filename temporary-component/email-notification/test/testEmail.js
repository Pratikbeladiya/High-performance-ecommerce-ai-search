require("dotenv").config();

const express=require("express");

const app=express();

const emailRoutes=require("../routes/emailRoutes");

app.use("/api/email",emailRoutes);

app.listen(5000,()=>{

console.log("Server Running");

});