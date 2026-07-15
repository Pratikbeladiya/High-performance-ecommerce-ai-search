import { useState } from "react";
import CouponBox from "../components/CouponBox";

const Cart = () => {

  const cartTotal = 2500;

  const [discount, setDiscount] = useState(0);

  const finalAmount = cartTotal - discount;

  return (

    <div className="container mt-5">

      <h2>Shopping Cart</h2>

      <h4>Cart Total : ₹{cartTotal}</h4>

      <CouponBox
        cartTotal={cartTotal}
        onApply={setDiscount}
      />

      <hr />

      <h5>Discount : ₹{discount}</h5>

      <h3>Final Amount : ₹{finalAmount}</h3>

    </div>

  );
};

export default Cart;