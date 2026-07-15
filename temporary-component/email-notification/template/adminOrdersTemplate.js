const adminOrderTemplate = (user,total)=>{

return `

<h2>New Order Received</h2>

Customer : ${user}

Amount : ₹${total}

`;

}

module.exports=adminOrderTemplate;