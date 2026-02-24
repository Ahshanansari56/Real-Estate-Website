const mongoose = require('mongoose');

const realEstateSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'] },
  type: { type: String, enum: ['house', 'apartment', 'villa', 'office', 'land', 'commercial'], required: true },
  status: { type: String, enum: ['for-sale', 'for-rent', 'sold', 'rented'], default: 'for-sale' },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  priceType: { type: String, enum: ['total', 'per-month', 'per-year'], default: 'total' },
  area: { type: Number, required: true },
  areaUnit: { type: String, enum: ['sqft', 'sqm'], default: 'sqft' },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  parking: { type: Number, default: 0 },
  yearBuilt: { type: Number },
  images: [{ type: String }],
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    pincode: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  amenities: [{ type: String }],
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

realEstateSchema.index({ 'location.city': 1, type: 1, status: 1, price: 1 });

module.exports = mongoose.model('RealEstate', realEstateSchema);
