// dotenv load karo — Vercel par env vars already hote hain, local ke liye zaroori
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const voRoutes = require('./routes/voRoutes');
const shgRoutes = require('./routes/shgRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const exportRoutes = require('./routes/exportRoutes');
const productRoutes = require('./routes/productRoutes');

// Models for seeding
const VO = require('./models/VoModel');
const SHG = require('./models/ShgModel');
const Product = require('./models/ProductModel');
const User = require('./models/UserModel');

const app = express();

// ─── CORS — allow all vercel.app + localhost ──────────────────────────────────
const corsOptions = {
  origin: (origin, callback) => {
    // No origin = curl, Postman, mobile — allow
    if (!origin) return callback(null, true);
    // Any vercel.app subdomain — allow
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    // localhost — allow
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    // Explicit FRONTEND_URL env var — allow
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Handle preflight OPTIONS requests
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Connect Database ─────────────────────────────────────────────────────────
connectDB().then(() => {
  seedDatabase();
  seedProducts();
  seedUsers();
}).catch(err => console.error('DB Connection Error:', err));

// ─── Seed VO & SHG if empty ───────────────────────────────────────────────────
async function seedDatabase() {
  try {
    const voCount = await VO.countDocuments();
    if (voCount > 0) return;
    const vo1 = await VO.create({ name: 'Prerna VO' });
    const vo2 = await VO.create({ name: 'Ujala VO' });
    const vo3 = await VO.create({ name: 'Kiran VO' });
    await SHG.insertMany([
      { name: 'Radha SHG', voId: vo1._id },
      { name: 'Laxmi SHG', voId: vo1._id },
      { name: 'Saraswati SHG', voId: vo1._id },
      { name: 'Durga SHG', voId: vo2._id },
      { name: 'Shakti SHG', voId: vo2._id },
      { name: 'Jyoti SHG', voId: vo3._id }
    ]);
    console.log('Seed complete.');
  } catch (err) {
    if (err.code !== 11000) console.error('Seed error:', err.message);
  }
}

async function seedProducts() {
  try {
    const count = await Product.countDocuments();
    if (count > 0) return;
    await Product.insertMany([
      {
        name: 'Organic Wheat Flour',
        price: 45,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
        description: 'Stone-ground atta from local farms'
      },
      {
        name: 'Handwoven Basket',
        price: 320,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
        description: 'Bamboo basket made by SHG artisans'
      },
      {
        name: 'Pure Mustard Oil',
        price: 180,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
        description: 'Cold-pressed kachi ghani oil'
      },
      {
        name: 'Millets Mix',
        price: 95,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        description: 'Ragi, jowar, and bajra blend'
      }
    ]);
    console.log('Product seed complete.');
  } catch (err) {
    if (err.code !== 11000) console.error('Product seed error:', err.message);
  }
}

async function seedUsers() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) return;

    await User.create([
      {
        name: 'Admin User',
        email: 'admin@jivika.org',
        password: 'Admin123',
        role: 'Admin'
      },
      {
        name: 'VO Accountant',
        email: 'accountant@jivika.org',
        password: 'Accountant123',
        role: 'VO Accountant'
      }
    ]);
    console.log('User seed complete. Admin: admin@jivika.org / Admin123, Accountant: accountant@jivika.org / Accountant123');
  } catch (err) {
    if (err.code !== 11000) console.error('User seed error:', err.message);
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Jivika API is running!' });
});

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Jivika API is healthy.',
    env: process.env.NODE_ENV,
    mongo: process.env.MONGO_URI ? 'set' : 'MISSING',
    jwt: process.env.JWT_SECRET ? 'set' : 'MISSING'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/vos', voRoutes);
app.use('/api/shgs', shgRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/exports', exportRoutes);
app.use('/api/products', productRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Local server start
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

// Vercel ke liye export
module.exports = app;
