import React from "react";
import {
  SiNike,
  SiAdidas,
  SiPuma,
  SiApple,
  SiSamsung,
  SiLenovo,
} from "react-icons/si";

const brands = [
  {
    id: 1,
    name: "Nike",
    icon: <SiNike size={45} className="text-black" />,
  },
  {
    id: 2,
    name: "Adidas",
    icon: <SiAdidas size={45} className="text-black" />,
  },
  {
    id: 3,
    name: "Puma",
    icon: <SiPuma size={45} className="text-black" />,
  },
  {
    id: 4,
    name: "Apple",
    icon: <SiApple size={45} className="text-black" />,
  },
  {
    id: 5,
    name: "Samsung",
    icon: <SiSamsung size={45} className="text-blue-600" />,
  },
  {
    id: 6,
    name: "Lenovo",
    icon: <SiLenovo size={45} className="text-red-600" />,
  },
];

const BrandPartners = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">
          Our Brand Partners
        </h2>
        <p className="text-gray-500 mt-2">
          We proudly collaborate with trusted brands to bring you quality products.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white border rounded-xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div>{brand.icon}</div>
            <h3 className="mt-3 font-semibold text-gray-700">
              {brand.name}
            </h3>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-gray-500">
          Trusted by leading global brands and thousands of satisfied customers.
        </p>
      </div>
    </section>
  );
};

export default BrandPartners;
