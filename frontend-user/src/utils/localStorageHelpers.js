export const getProductsFromLocalStorage = (initialProducts) => {
  const stored = localStorage.getItem("admin_products");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialProducts;
    }
  }
  return initialProducts;
};

export const setProductsToLocalStorage = (products) => {
  localStorage.setItem("admin_products", JSON.stringify(products));
};
