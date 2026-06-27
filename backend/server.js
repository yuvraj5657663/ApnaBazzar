// dotenv sirf local mein chahiye — Vercel apne env vars khud inject karta hai
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const voRoutes = require('./routes/voRoutes');
const shgRoutes = require('./routes/shgRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const exportRoutes = require('./routes/exportRoutes');

// Models for seeding
const VO = require('./models/VoModel');
const SHG = require('./models/ShgModel');

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
    return callback(null, true); // Allow all for now — tighten later
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
