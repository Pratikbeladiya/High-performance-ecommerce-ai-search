import React from "react";
import {
  FaShippingFast,
  FaLock,
  FaUndoAlt,
  FaHeadset,
} from "react-icons/fa";

const highlights = [
  {
    id: 1,
    title: "Fast Delivery",
    description: "Get your orders delivered quickly across India.",
    icon: <FaShippingFast size={40} className="text-blue-600" />,
  },
  {
    id: 2,
    title: "Secure Payment",
    description: "100% safe and encrypted payment methods.",
    icon: <FaLock size={40} className="text-green-600" />,
  },
  {
    id: 3,
    title: "Easy Returns",
    description: "Hassle-free returns within 7 days.",
    icon: <FaUndoAlt size={40} className="text-orange-500" />,
  },
  {
    id: 4,
    title: "24/7 Support",
    description: "Our team is always ready to help you.",
    icon: <FaHeadset size={40} className="text-purple-600" />,
  },
];

const StoreHighlights = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">
          Why Shop With Us?
        </h2>
        <p className="text-gray-500 mt-2">
          Experience fast, secure, and reliable online shopping with our trusted services.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center"
          >
            <div className="flex justify-center mb-4">{item.icon}</div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>

            <p className="text-gray-600 text-sm">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center border-t pt-6">
        <p className="text-gray-500 text-sm">
          Trusted by thousands of happy customers across India.
        </p>
      </div>
    </section>
  );
};

export default StoreHighlights;
