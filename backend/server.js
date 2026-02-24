const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/real', require('./routes/realEstateRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Log the effective MONGO_URI (sanitized) to help debug which value is being used
const rawUri = process.env.MONGO_URI || 'mongodb://localhost:27017/real_estate_db';
try {
  const safeUri = rawUri.replace(/(mongodb\+srv:\/\/.*?:)(.*?)(@)/, '$1***REDACTED***$3');
  console.log('Using MONGO_URI:', safeUri);
} catch (e) {
  console.log('Using MONGO_URI: (could not sanitize)');
}

mongoose.connect(rawUri)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:');
    console.error(err && err.message ? err.message : err);
    console.error('Make sure MongoDB is running locally or that MONGO_URI is set in backend/.env');
    console.error('For local MongoDB on Windows, run the mongod server or install MongoDB as a service.');
    // Do not exit immediately so nodemon can pick up fixes; developer can fix env and file changes will restart the app.
  });
