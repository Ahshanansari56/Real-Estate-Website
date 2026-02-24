const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { isPublic: true };
    const settings = await Settings.find(query);
    const obj = {};
    settings.forEach(s => { obj[s.key] = s.value; });
    res.json({ success: true, settings: obj });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key, value, category, description, isPublic } = req.body;
    const setting = await Settings.findOneAndUpdate(
      { key },
      { key, value, category, description, isPublic, updatedBy: req.user._id },
      { new: true, upsert: true }
    );
    res.json({ success: true, setting });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateBulkSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const ops = settings.map(s => ({
      updateOne: {
        filter: { key: s.key },
        update: { ...s, updatedBy: req.user._id },
        upsert: true
      }
    }));
    await Settings.bulkWrite(ops);
    res.json({ success: true, message: 'Settings updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSetting = async (req, res) => {
  try {
    await Settings.findOneAndDelete({ key: req.params.key });
    res.json({ success: true, message: 'Setting deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
