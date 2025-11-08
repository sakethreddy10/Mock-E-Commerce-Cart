import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/cart`);
      setCartItems(response.data.items);
      setCartTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(`${API_BASE}/cart`, { productId, quantity });
      fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`${API_BASE}/cart/${cartItemId}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleCheckout = async (customerInfo) => {
    try {
      const response = await axios.post(`${API_BASE}/checkout`, {
        cartItems,
        customerInfo
      });
      
      // Clear local cart state
      setCartItems([]);
      setCartTotal(0);
      setShowCheckout(false);
      setShowCart(false);
      
      return response.data;
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>E Commerce Cart</h1>
        <button 
          className="cart-button"
          onClick={() => setShowCart(!showCart)}
        >
          Cart ({cartItems.length}) - ${cartTotal.toFixed(2)}
        </button>
      </header>

      <main className="main-content">
        {!showCart ? (
          <ProductGrid products={products} onAddToCart={addToCart} />
        ) : (
          <Cart 
            items={cartItems}
            total={cartTotal}
            onRemoveItem={removeFromCart}
            onCheckout={() => setShowCheckout(true)}
            onContinueShopping={() => setShowCart(false)}
          />
        )}
      </main>

      {showCheckout && (
        <CheckoutModal
          cartItems={cartItems}
          total={cartTotal}
          onClose={() => setShowCheckout(false)}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}

export default App;
