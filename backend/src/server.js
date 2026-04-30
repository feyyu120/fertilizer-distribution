// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const dns = require("node:dns")
const keepAlive = require('./cron/keepAlive');

dotenv.config();
connectDB();
keepAlive.start();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Override DNS only in local development. 
// Render's network uses internal DNS, so we skip this in production to prevent breaking Render services.
if (process.env.NODE_ENV !== 'production' && !process.env.RENDER) {
    dns.setServers(['1.1.1.1', '1.0.0.1', '8.8.8.8', '8.8.4.4']);
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoute'));
app.use('/api/fertilizers', require('./routes/fertilizerRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 FertilizerHub Server running on port ${PORT}`);
});