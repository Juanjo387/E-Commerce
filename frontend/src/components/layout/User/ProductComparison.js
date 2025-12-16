import React, { useState, useEffect } from "react";
import { PRODUCTS } from "../../../products";
import productImage from "./placeholder.jpeg";
import "./ProductComparison.css"; 

const ProductComparison = () => {
  const [product1, setProduct1] = useState("");
  const [product2, setProduct2] = useState("");
  const [priceDifference, setPriceDifference] = useState(0);

  const handleProductChange = (e, setProduct) => {
    const selectedProduct = PRODUCTS.find(
      (product) => product.sNo === parseInt(e.target.value)
    );
    setProduct(selectedProduct);
  };

  const clearSelections = () => {
    setProduct1("");
    setProduct2("");
    setPriceDifference(0);
  };

  useEffect(() => {
    if (product1 && product2) {
      const tags1 = product1.tags;
      const tags2 = product2.tags;

      if (tags1 !== tags2) {
        alert("Products are incomparable because they are very different");
        clearSelections(); 
      }
    }
  }, [product1, product2]);

  return (
    <div className="compare-products">
      <h2>Product Comparison</h2>
      <div className="compare-container">
        <div className="compare-column">
          <h2>Select Product 1:</h2>
          <select data-testid="product1-select" onChange={(e) => handleProductChange(e, setProduct1)}>
            <option value="">Select a product</option>
            {PRODUCTS.map((product) => (
            <option key={product.sNo} value={product.sNo}>
              {product.name}
            </option>
            ))}
          </select>
            <div data-testid="product1-box" className="product-box">
              <img src={productImage} alt={product1.name} /> 
              <h4>{product1.name}</h4>
              <p><strong>Description:</strong> {product1.description}</p>
              <p><strong>Tags:</strong> {product1.tags}</p>
              <p><strong>Stock Status:</strong> {product1.stockStatus}</p>
              <p><strong>Price:</strong> ${product1.price}</p>
              <button>Shop {product1.name}</button>
            </div>
        </div>
        <div className="compare-column">
          <h2>Select Product 2:</h2>
          <select data-testid="product2-select" onChange={(e) => handleProductChange(e, setProduct2)}>
            <option value="">Select a product</option>
            {PRODUCTS.map((product) => (
            <option key={product.sNo} value={product.sNo}>
              {product.name}
            </option>
          ))}
          </select>
            <div data-testid="product2-box" className="product-box">
              <img src={productImage} alt={product2.name} /> 
              <h4>{product2.name}</h4>
              <p><strong>Description:</strong> {product2.description}</p>
              <p><strong>Tags:</strong> {product2.tags}</p>
              <p><strong>Stock Status:</strong> {product2.stockStatus}</p>
              <p><strong>Price:</strong> ${product2.price}</p>
              <button>Shop {product2.name}</button>
            </div>
        </div>
      </div>
      {priceDifference !== null && (
        <p data-testid="price-diff-statement" className="price-diff-statement">
          This product is ${priceDifference} amount less than the other product.
        </p>
      )}
      <button data-testid="clear-btn" onClick={clearSelections} className="clear-btn">Clear Selections</button>
    </div>
  );
};

export default ProductComparison;