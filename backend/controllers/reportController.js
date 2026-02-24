const Report = require('../models/Report');
const RealEstate = require('../models/RealEstate');
const User = require('../models/User');

exports.generateReport = async (req, res) => {
  try {
    const { type, title, filters } = req.body;
    let data = {};

    if (type === 'sales') {
      data.sold = await RealEstate.countDocuments({ status: 'sold' });
      data.totalRevenue = await RealEstate.aggregate([
        { $match: { status: 'sold' } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]);
    } else if (type === 'inventory') {
      data.byType = await RealEstate.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]);
      data.byStatus = await RealEstate.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    } else if (type === 'user-activity') {
      data.totalUsers = await User.countDocuments();
      data.activeUsers = await User.countDocuments({ isActive: true });
      data.admins = await User.countDocuments({ role: 'admin' });
    } else if (type === 'revenue') {
      data.byCity = await RealEstate.aggregate([
        { $group: { _id: '$location.city', total: { $sum: '$price' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }, { $limit: 10 }
      ]);
    }

    const report = await Report.create({ title, type, data, filters, generatedBy: req.user._id });
    res.status(201).json({ success: true, report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('generatedBy', 'name email').sort('-createdAt');
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('generatedBy', 'name email');
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Report deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
