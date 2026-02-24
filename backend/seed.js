const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/real_estate_db';

const userSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String, phone: String, isActive: Boolean }, { timestamps: true });
const User = mongoose.model('User', userSchema);

const realEstateSchema = new mongoose.Schema({
  title: String, description: String, type: String, status: String,
  price: Number, priceType: String, area: Number, areaUnit: String,
  bedrooms: Number, bathrooms: Number, parking: Number, yearBuilt: Number,
  images: [String], location: Object, amenities: [String], featured: Boolean, isActive: Boolean, views: Number, agent: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });
const RealEstate = mongoose.model('RealEstate', realEstateSchema);

const PROPERTIES = [
  { title: 'Luxurious 3BHK in Bandra West', description: 'Stunning sea-facing apartment with modern interiors, premium fittings, and breathtaking views of the Arabian Sea. Walking distance to Bandstand Promenade.', type: 'apartment', status: 'for-sale', price: 45000000, priceType: 'total', area: 1800, areaUnit: 'sqft', bedrooms: 3, bathrooms: 3, parking: 2, yearBuilt: 2019, location: { address: '12 Sea Face Road, Bandstand', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', country: 'India' }, amenities: ['Pool', 'Gym', 'Security', 'Elevator', 'Parking'], featured: true, isActive: true, views: 234 },
  { title: 'Colonial Villa in Koregaon Park', description: 'Majestic 4-bedroom villa in Pune\'s most prestigious neighborhood. Original colonial architecture with modern amenities, lush garden, and private pool.', type: 'villa', status: 'for-sale', price: 85000000, priceType: 'total', area: 5500, areaUnit: 'sqft', bedrooms: 4, bathrooms: 5, parking: 4, yearBuilt: 1985, location: { address: '7 Rose Garden Lane, Koregaon Park', city: 'Pune', state: 'Maharashtra', pincode: '411001', country: 'India' }, amenities: ['Pool', 'Garden', 'Security', 'Parking', 'Gym'], featured: true, isActive: true, views: 189 },
  { title: 'Modern Studio in Indiranagar', description: 'Chic studio apartment perfect for young professionals. Fully furnished with smart home features, just minutes from MG Road metro station.', type: 'apartment', status: 'for-rent', price: 28000, priceType: 'per-month', area: 550, areaUnit: 'sqft', bedrooms: 1, bathrooms: 1, parking: 1, yearBuilt: 2022, location: { address: '56 100ft Road, Indiranagar', city: 'Bangalore', state: 'Karnataka', pincode: '560038', country: 'India' }, amenities: ['WiFi', 'Air-Conditioning', 'Security', 'Elevator'], featured: false, isActive: true, views: 312 },
  { title: 'Premium Office Space in Cyber City', description: 'Grade-A commercial office space in the heart of Gurgaon\'s Cyber City. Open floor plan, 24/7 security, rooftop cafeteria, and excellent connectivity.', type: 'office', status: 'for-rent', price: 150000, priceType: 'per-month', area: 3000, areaUnit: 'sqft', bedrooms: 0, bathrooms: 4, parking: 10, yearBuilt: 2020, location: { address: 'Tower B, DLF Cyber City', city: 'Gurugram', state: 'Haryana', pincode: '122002', country: 'India' }, amenities: ['Elevator', 'Security', 'Parking', 'WiFi', 'Air-Conditioning'], featured: true, isActive: true, views: 98 },
  { title: '2BHK Independent House in Adyar', description: 'Quiet and spacious independent house in Chennai\'s sought-after Adyar locality. Private terrace garden, attached garage, easy access to Adyar beach.', type: 'house', status: 'for-sale', price: 18500000, priceType: 'total', area: 1400, areaUnit: 'sqft', bedrooms: 2, bathrooms: 2, parking: 1, yearBuilt: 2010, location: { address: '34 Lattice Bridge Road, Adyar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600020', country: 'India' }, amenities: ['Parking', 'Garden', 'Security'], featured: false, isActive: true, views: 156 },
  { title: 'Agricultural Land in Lonavala', description: 'Fertile agricultural land with mountain views near Lonavala. Ideal for farmhouse development, vineyard, or eco-resort. All approvals available.', type: 'land', status: 'for-sale', price: 12000000, priceType: 'total', area: 20000, areaUnit: 'sqft', bedrooms: 0, bathrooms: 0, parking: 0, location: { address: 'Near Bhushi Dam, NH-48', city: 'Lonavala', state: 'Maharashtra', pincode: '410401', country: 'India' }, amenities: [], featured: false, isActive: true, views: 67 },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await RealEstate.deleteMany({});

  const adminPass = await bcrypt.hash('admin123', 12);
  const userPass = await bcrypt.hash('user123', 12);

  const admin = await User.create({ name: 'Admin User', email: 'admin@estate.com', password: adminPass, role: 'admin', phone: '+91 98765 43210', isActive: true });
  const user = await User.create({ name: 'John Doe', email: 'user@estate.com', password: userPass, role: 'user', phone: '+91 87654 32109', isActive: true });

  for (const p of PROPERTIES) {
    await RealEstate.create({ ...p, agent: admin._id });
  }

  console.log('✅ Seed complete!');
  console.log('Admin: admin@estate.com / admin123');
  console.log('User:  user@estate.com / user123');
  await mongoose.disconnect();
}

seed().catch(console.error);
