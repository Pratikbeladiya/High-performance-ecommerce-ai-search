const sendEmail=require("../utils/sendEmail");

const welcomeTemplate=require("../templates/welcomeTemplate");
const orderTemplate=require("../templates/orderTemplate");
const forgotPasswordTemplate=require("../templates/forgotPasswordTemplate");
const adminOrderTemplate=require("../templates/adminOrderTemplate");

const sendWelcomeEmail=async(user)=>{

await sendEmail(
user.email,
"Welcome to VectorCommerce",
welcomeTemplate(user.name)
);

}

const sendOrderEmail=async(user,order)=>{

await sendEmail(
user.email,
"Order Confirmation",
orderTemplate(
user.name,
order._id,
order.totalPrice
)
);

}

const sendForgotPasswordEmail=async(user,link)=>{

await sendEmail(
user.email,
"Reset Password",
forgotPasswordTemplate(link)
);

}

const notifyAdmin=async(adminEmail,user,total)=>{

await sendEmail(
adminEmail,
"New Order",
adminOrderTemplate(
user.name,
total
)
);

}

module.exports={
sendWelcomeEmail,
sendOrderEmail,
sendForgotPasswordEmail,
notifyAdmin
}