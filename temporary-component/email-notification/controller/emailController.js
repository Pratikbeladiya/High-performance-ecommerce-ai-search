const emailService=require("../services/emailService");

exports.testWelcome=async(req,res)=>{

const user={
name:"Pratik",
email:"yourgmail@gmail.com"
}

await emailService.sendWelcomeEmail(user);

res.json({
success:true,
message:"Welcome email sent."
})

}