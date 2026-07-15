const express=require("express");

const router=express.Router();

const emailController=require("../controllers/emailController");

router.get("/welcome",emailController.testWelcome);

module.exports=router;