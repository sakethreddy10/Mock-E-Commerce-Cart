## Mock E-Commerce Cart Application

A full-stack shopping cart application built with React frontend and Node.js/Express backend with SQLite database.

## Features

- **Product Catalog**: Display 8 mock products with images, names, and prices
- **Shopping Cart**: Add/remove items, view quantities and totals
- **Checkout Process**: Customer information form and mock receipt generation
- **Responsive Design**: Works on desktop and mobile devices
- **REST API**: Complete backend API for cart operations

## Tech Stack

### Frontend
- React 18
- Axios for HTTP requests
- CSS3 with responsive design
- Modern ES6+ JavaScript

### Backend
- Node.js with Express
- SQLite database (in-memory)
- CORS enabled
- UUID for unique IDs

## API Endpoints

- `GET /api/products` - Fetch all products
- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get cart items and total
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/checkout` - Process checkout and generate receipt

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd vibe-commerce-cart
   npm run install-all
   ```

2. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend development server on http://localhost:3000

### Manual Setup

If you prefer to start servers individually:

1. **Start the backend:**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start the frontend (in a new terminal):**
   ```bash
   cd client
   npm install
   npm start
   ```

## Usage

1. **Browse Products**: View the product grid on the main page
2. **Add to Cart**: Click "Add to Cart" on any product
3. **View Cart**: Click the cart button in the header to see cart contents
4. **Manage Items**: Remove items or adjust quantities in the cart view
5. **Checkout**: Click "Proceed to Checkout" to enter customer information
6. **Complete Order**: Fill out the form and submit to get a mock receipt

## Project Structure

```
vibe-commerce-cart/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ProductGrid.js
│   │   │   ├── Cart.js
│   │   │   └── CheckoutModal.js
│   │   ├── App.js         # Main app component
│   │   └── App.css        # Global styles
│   └── package.json
├── server/                # Node.js backend
│   ├── index.js          # Express server and API routes
│   └── package.json
└── package.json          # Root package.json with scripts
```

## Development Notes

- The SQLite database runs in-memory, so data resets on server restart
- Mock product images use placeholder.com
- No real payment processing - checkout generates mock receipts
- CORS is enabled for local development

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install dependencies for all packages

## Future Enhancements

- Persistent database (PostgreSQL/MongoDB)
- User authentication
- Product search and filtering
- Real payment integration
- Order history
- Admin panel for product management
