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

// Models for seeding
const VO = require('./models/VoModel');
const SHG = require('./models/ShgModel');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'https://vercel.app', 
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Connect Database ────────────────────────────────────────────────────────
connectDB().then(() => {
  seedDatabase();
}).catch(err => console.log("DB Connection Error: ", err));

// ─── Seed VO & SHG data if not present ──────────────────────────────────────
async function seedDatabase() {
  try {
    const voCount = await VO.countDocuments();
    if (voCount > 0) {
      console.log(`Seed skipped — ${voCount} VOs already exist in database.`);
      return;
    }

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

    console.log('Seed complete — 3 VOs and 6 SHGs created.');
  } catch (err) {
    if (err.code !== 11000) {
      console.error('Seed error:', err.message);
    }
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────
// Root Check (Isse check hoga ki Vercel par backend chal raha hai ya nahi)
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Jivika API Root is working fine!' });
});

// Health check
app.use('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Jivika API is running.', env: process.env.NODE_ENV });
});

app.use('/api/auth', authRoutes);
app.use('/api/vos', voRoutes);
app.use('/api/shgs', shgRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/exports', exportRoutes);

// 404 handler
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

// ─── Start Server Only In Local ─────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Jivika API Server running at http://localhost:${PORT}`);
  });
}

// ⚠️ VERCEL KE LIYE EXPORT ZAROORI HAI
module.exports = app;