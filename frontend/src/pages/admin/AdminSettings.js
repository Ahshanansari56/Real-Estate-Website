import { useState, useEffect } from 'react';
import { getSettings, updateBulkSettings } from '../../utils/api';
import toast from 'react-hot-toast';

const DEFAULT_SETTINGS = [
  { key: 'site_name', value: 'Estate Luxe', category: 'general', description: 'Site Name', isPublic: true },
  { key: 'site_email', value: 'info@estateluxe.in', category: 'general', description: 'Contact Email', isPublic: true },
  { key: 'site_phone', value: '+91 98765 43210', category: 'general', description: 'Contact Phone', isPublic: true },
  { key: 'properties_per_page', value: '12', category: 'general', description: 'Properties Per Page', isPublic: true },
  { key: 'currency', value: 'INR', category: 'payment', description: 'Currency', isPublic: true },
  { key: 'currency_symbol', value: '₹', category: 'payment', description: 'Currency Symbol', isPublic: true },
  { key: 'maintenance_mode', value: 'false', category: 'general', description: 'Maintenance Mode', isPublic: false },
  { key: 'allow_registration', value: 'true', category: 'general', description: 'Allow Registration', isPublic: false },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then(res => {
      const fetched = res.data.settings;
      setSettings(prev => prev.map(s => ({
        ...s, value: fetched[s.key] !== undefined ? String(fetched[s.key]) : s.value
      })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateSetting = (key, val) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value: val } : s));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBulkSettings({ settings });
      toast.success('Settings saved!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally { setSaving(false); }
  };

  const categories = [...new Set(settings.map(s => s.category))];

  return (
    <div style={{ paddingTop: 68 }}>
      <div className="container" style={{ padding: '48px 24px', maxWidth: 800 }}>
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure platform settings</p>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="loading-spinner" /></div>
        ) : (
          <form onSubmit={handleSave}>
            {categories.map(cat => (
              <div key={cat} className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ color: 'var(--gold)', marginBottom: 20, textTransform: 'capitalize' }}>
                  {cat === 'general' ? '⚙️' : cat === 'payment' ? '💳' : '📧'} {cat} Settings
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {settings.filter(s => s.category === cat).map(s => (
                    <div key={s.key} className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label className="form-label">{s.description}</label>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>
                          {s.isPublic ? '🌐 PUBLIC' : '🔒 PRIVATE'}
                        </span>
                      </div>
                      {s.value === 'true' || s.value === 'false' ? (
                        <select className="form-select" value={s.value} onChange={e => updateSetting(s.key, e.target.value)}>
                          <option value="true">Enabled</option>
                          <option value="false">Disabled</option>
                        </select>
                      ) : (
                        <input className="form-input" value={s.value} onChange={e => updateSetting(s.key, e.target.value)} placeholder={s.description} />
                      )}
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>Key: {s.key}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                {saving ? '⏳ Saving...' : '💾 Save All Settings'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
