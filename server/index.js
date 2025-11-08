const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create tables and seed data
db.serialize(() => {
    // Products table
    db.run(`CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT
  )`);

    // Cart table
    db.run(`CREATE TABLE cart (
    id TEXT PRIMARY KEY,
    productId TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (productId) REFERENCES products (id)
  )`);

    // Seed products
    const products = [
        { id: '1', name: 'Wireless Headphones', price: 99.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop' },
        { id: '2', name: 'Smartphone Case', price: 24.99, image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=300&h=300&fit=crop' },
        { id: '3', name: 'Bluetooth Speaker', price: 79.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop' },
        { id: '4', name: 'USB-C Cable', price: 19.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
        { id: '5', name: 'Laptop Stand', price: 49.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop' },
        { id: '6', name: 'Wireless Mouse', price: 34.99, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&h=300&fit=crop' },
        { id: '7', name: 'Mechanical Keyboard', price: 89.99, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop' },
        { id: '8', name: '4K Monitor', price: 299.99, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop' }
    ];

    const stmt = db.prepare('INSERT INTO products (id, name, price, image) VALUES (?, ?, ?, ?)');
    products.forEach(product => {
        stmt.run(product.id, product.name, product.price, product.image);
    });
    stmt.finalize();
});

// API Routes

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST /api/cart - Add item to cart
app.post('/api/cart', (req, res) => {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if item already in cart
        db.get('SELECT * FROM cart WHERE productId = ?', [productId], (err, existingItem) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (existingItem) {
                // Update quantity
                const newQuantity = existingItem.quantity + quantity;
                db.run('UPDATE cart SET quantity = ? WHERE id = ?', [newQuantity, existingItem.id], (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: 'Cart updated successfully', id: existingItem.id });
                });
            } else {
                // Add new item
                const cartId = uuidv4();
                db.run('INSERT INTO cart (id, productId, quantity) VALUES (?, ?, ?)',
                    [cartId, productId, quantity], (err) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                        res.json({ message: 'Item added to cart', id: cartId });
                    });
            }
        });
    });
});

// GET /api/cart - Get cart items with total
app.get('/api/cart', (req, res) => {
    const query = `
    SELECT c.id, c.quantity, p.id as productId, p.name, p.price, p.image,
           (c.quantity * p.price) as subtotal
    FROM cart c
    JOIN products p ON c.productId = p.id
  `;

    db.all(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const total = rows.reduce((sum, item) => sum + item.subtotal, 0);

        res.json({
            items: rows,
            total: parseFloat(total.toFixed(2))
        });
    });
});

// DELETE /api/cart/:id - Remove item from cart
app.delete('/api/cart/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM cart WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        res.json({ message: 'Item removed from cart' });
    });
});

// POST /api/checkout - Process checkout
app.post('/api/checkout', (req, res) => {
    const { cartItems, customerInfo } = req.body;

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    // Generate mock receipt
    const receipt = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        customerInfo,
        items: cartItems,
        total: parseFloat(total.toFixed(2)),
        status: 'completed'
    };

    // Clear cart after successful checkout
    db.run('DELETE FROM cart', (err) => {
        if (err) {
            console.error('Error clearing cart:', err);
        }
    });

    res.json(receipt);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});