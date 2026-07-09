const orderTemplate = (name, orderId, total) => {

return `

<h2>Hello ${name}</h2>

<h3>Your Order is Confirmed</h3>

<p>Order ID : ${orderId}</p>

<p>Total : ₹${total}</p>

<p>Thank you for shopping.</p>

`;

}

module.exports = orderTemplate;