const RealEstate = require('../models/RealEstate');

exports.createProperty = async (req, res) => {
  try {
    const property = await RealEstate.create({ ...req.body, agent: req.user._id });
    res.status(201).json({ success: true, property });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const { type, status, city, minPrice, maxPrice, bedrooms, featured, search, page = 1, limit = 12, sort = '-createdAt' } = req.query;
    const query = { isActive: true };

    if (type) query.type = type;
    if (status) query.status = status;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (featured === 'true') query.featured = true;
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [properties, total] = await Promise.all([
      RealEstate.find(query).populate('agent', 'name email phone avatar').sort(sort).skip(skip).limit(Number(limit)),
      RealEstate.countDocuments(query),
    ]);

    res.json({ success: true, properties, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const property = await RealEstate.findById(req.params.id).populate('agent', 'name email phone avatar');
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    await RealEstate.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    let property = await RealEstate.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    if (property.agent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this property.' });
    }
    property = await RealEstate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, property });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await RealEstate.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    if (property.agent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property.' });
    }
    await property.deleteOne();
    res.json({ success: true, message: 'Property deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyProperties = async (req, res) => {
  try {
    const properties = await RealEstate.find({ agent: req.user._id }).sort('-createdAt');
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [total, forSale, forRent, sold, featured] = await Promise.all([
      RealEstate.countDocuments({ isActive: true }),
      RealEstate.countDocuments({ status: 'for-sale', isActive: true }),
      RealEstate.countDocuments({ status: 'for-rent', isActive: true }),
      RealEstate.countDocuments({ status: 'sold', isActive: true }),
      RealEstate.countDocuments({ featured: true, isActive: true }),
    ]);
    const avgPrice = await RealEstate.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avg: { $avg: '$price' } } }
    ]);
    const byType = await RealEstate.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, stats: { total, forSale, forRent, sold, featured, avgPrice: avgPrice[0]?.avg || 0, byType } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
