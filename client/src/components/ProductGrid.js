import React from 'react';
import './ProductGrid.css';

const ProductGrid = ({ products, onAddToCart }) => {
  return (
    <div className="product-grid">
      <h2>Products</h2>
      <div className="products-container">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">${product.price.toFixed(2)}</p>
              <button 
                className="add-to-cart-btn"
                onClick={() => onAddToCart(product.id)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;