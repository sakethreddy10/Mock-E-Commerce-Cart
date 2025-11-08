import React from 'react';
import './Cart.css';

const Cart = ({ items, total, onRemoveItem, onCheckout, onContinueShopping }) => {
  if (items.length === 0) {
    return (
      <div className="cart">
        <h2>Your Cart</h2>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={onContinueShopping} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-header">
        <button onClick={onContinueShopping} className="back-btn">
          ← Back to Products
        </button>
        <h2>Your Cart</h2>
      </div>
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
              <p className="subtotal">Subtotal: ${item.subtotal.toFixed(2)}</p>
            </div>
            <button 
              className="remove-btn"
              onClick={() => onRemoveItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="total">
          <strong>Total: ${total.toFixed(2)}</strong>
        </div>
        <div className="cart-actions">
          <button onClick={onContinueShopping} className="continue-shopping-btn">
            Continue Shopping
          </button>
          <button onClick={onCheckout} className="checkout-btn">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;