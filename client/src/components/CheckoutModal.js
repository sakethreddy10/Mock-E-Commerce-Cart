import React, { useState } from 'react';
import './CheckoutModal.css';

const CheckoutModal = ({ cartItems, total, onClose, onCheckout }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: ''
  });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const receiptData = await onCheckout(customerInfo);
      setReceipt(receiptData);
    } catch (error) {
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (receipt) {
    return (
      <div className="modal-overlay">
        <div className="modal-content receipt-modal">
          <h2>Order Confirmation</h2>
          <div className="receipt">
            <p><strong>Order ID:</strong> {receipt.id}</p>
            <p><strong>Date:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
            <p><strong>Customer:</strong> {receipt.customerInfo.name}</p>
            <p><strong>Email:</strong> {receipt.customerInfo.email}</p>
            
            <div className="receipt-items">
              <h3>Items:</h3>
              {receipt.items.map(item => (
                <div key={item.id} className="receipt-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="receipt-total">
              <strong>Total: ${receipt.total.toFixed(2)}</strong>
            </div>
            
            <p className="receipt-status">Status: {receipt.status}</p>
          </div>
          
          <button onClick={onClose} className="close-btn">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Checkout</h2>
        
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.map(item => (
            <div key={item.id} className="checkout-item">
              <span>{item.name} x {item.quantity}</span>
              <span>${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
          <div className="checkout-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={customerInfo.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={customerInfo.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Processing...' : 'Complete Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;