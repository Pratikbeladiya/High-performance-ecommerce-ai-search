import { useState } from "react";
import coupons from "../data/coupons";

const CouponBox = ({ cartTotal, onApply }) => {
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState("");

  const applyCoupon = () => {
    const found = coupons.find(
      (item) => item.code.toUpperCase() === coupon.toUpperCase()
    );

    if (!found) {
      setMessage("❌ Invalid Coupon");
      return;
    }

    if (cartTotal < found.minOrder) {
      setMessage(
        `Minimum order should be ₹${found.minOrder}`
      );
      return;
    }

    let discount = 0;

    if (found.type === "percentage") {
      discount = (cartTotal * found.value) / 100;
    } else {
      discount = found.value;
    }

    onApply(discount);

    setMessage(
      `✅ Coupon Applied! Saved ₹${discount}`
    );
  };

  return (
    <div className="border rounded p-3 mt-4">

      <h4>Apply Coupon</h4>

      <input
        className="form-control"
        placeholder="Enter Coupon"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
      />

      <button
        className="btn btn-success mt-3"
        onClick={applyCoupon}
      >
        Apply Coupon
      </button>

      <p className="mt-2">{message}</p>

    </div>
  );
};

export default CouponBox;