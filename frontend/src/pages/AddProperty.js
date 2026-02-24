import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../utils/api';
import toast from 'react-hot-toast';

const AMENITIES = ['Pool', 'Gym', 'Parking', 'Garden', 'Security', 'Elevator', 'Air-Conditioning', 'WiFi', 'Balcony', 'Rooftop'];

export default function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', type: 'apartment', status: 'for-sale',
    price: '', priceType: 'total', area: '', areaUnit: 'sqft',
    bedrooms: 0, bathrooms: 0, parking: 0, yearBuilt: '',
    images: '',
    location: { address: '', city: '', state: '', pincode: '', country: 'India' },
    amenities: [],
    featured: false,
  });

  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const setLocation = (key, val) => setForm(p => ({ ...p, location: { ...p.location, [key]: val } }));
  const toggleAmenity = (a) => setForm(p => ({
    ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        parking: Number(form.parking),
        yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : undefined,
        images: form.images ? form.images.split('\n').filter(u => u.trim()) : [],
      };
      const res = await createProperty(data);
      toast.success('Property listed successfully!');
      navigate(`/properties/${res.data.property._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ title, children }) => (
    <div className="card" style={{ marginBottom: 24 }}>
      <h3 style={{ color: 'var(--gold)', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>{title}</h3>
      {children}
    </div>
  );

  return (
    <div style={{ paddingTop: 68 }}>
      <div className="container" style={{ padding: '48px 24px', maxWidth: 900 }}>
        <div className="page-header">
          <h1 className="page-title">List a Property</h1>
          <p className="page-subtitle">Fill in the details to publish your listing</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Section title="📋 Basic Information">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Property Title *</label>
                <input className="form-input" placeholder="e.g. Luxurious 3BHK in Bandra West" value={form.title} onChange={e => setField('title', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-input" placeholder="Describe the property..." rows={4} value={form.description} onChange={e => setField('description', e.target.value)} required style={{ resize: 'vertical' }} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Property Type *</label>
                  <select className="form-select" value={form.type} onChange={e => setField('type', e.target.value)}>
                    {['house', 'apartment', 'villa', 'office', 'land', 'commercial'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Listing Status *</label>
                  <select className="form-select" value={form.status} onChange={e => setField('status', e.target.value)}>
                    <option value="for-sale">For Sale</option>
                    <option value="for-rent">For Rent</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={e => setField('featured', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--gold)' }} />
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>⭐ Mark as Featured Listing</span>
              </label>
            </div>
          </Section>

          <Section title="💰 Pricing">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input className="form-input" type="number" placeholder="5000000" value={form.price} onChange={e => setField('price', e.target.value)} required min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Price Type</label>
                <select className="form-select" value={form.priceType} onChange={e => setField('priceType', e.target.value)}>
                  <option value="total">Total Price</option>
                  <option value="per-month">Per Month</option>
                  <option value="per-year">Per Year</option>
                </select>
              </div>
            </div>
          </Section>

          <Section title="📐 Property Details">
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Area *</label>
                <input className="form-input" type="number" placeholder="1200" value={form.area} onChange={e => setField('area', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Area Unit</label>
                <select className="form-select" value={form.areaUnit} onChange={e => setField('areaUnit', e.target.value)}>
                  <option value="sqft">Square Feet</option>
                  <option value="sqm">Square Meters</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
              {[
                { key: 'bedrooms', label: 'Bedrooms' },
                { key: 'bathrooms', label: 'Bathrooms' },
                { key: 'parking', label: 'Parking Slots' },
                { key: 'yearBuilt', label: 'Year Built', placeholder: '2020' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  <input className="form-input" type="number" placeholder={placeholder || '0'} value={form[key]} onChange={e => setField(key, e.target.value)} min={0} />
                </div>
              ))}
            </div>
          </Section>

          <Section title="📍 Location">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input className="form-input" placeholder="123 Marine Drive, Nariman Point" value={form.location.address} onChange={e => setLocation('address', e.target.value)} required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input className="form-input" placeholder="Mumbai" value={form.location.city} onChange={e => setLocation('city', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input className="form-input" placeholder="Maharashtra" value={form.location.state} onChange={e => setLocation('state', e.target.value)} required />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input className="form-input" placeholder="400001" value={form.location.pincode} onChange={e => setLocation('pincode', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input className="form-input" value={form.location.country} onChange={e => setLocation('country', e.target.value)} />
                </div>
              </div>
            </div>
          </Section>

          <Section title="🏊 Amenities">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {AMENITIES.map(a => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)} style={{
                  padding: '8px 16px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                  border: `1px solid ${form.amenities.includes(a) ? 'var(--gold)' : 'var(--border)'}`,
                  background: form.amenities.includes(a) ? 'var(--gold-dim)' : 'var(--bg-secondary)',
                  color: form.amenities.includes(a) ? 'var(--gold)' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                }}>
                  {form.amenities.includes(a) ? '✓ ' : ''}{a}
                </button>
              ))}
            </div>
          </Section>

          <Section title="🖼️ Images">
            <div className="form-group">
              <label className="form-label">Image URLs (one per line)</label>
              <textarea
                className="form-input" rows={4} placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                value={form.images} onChange={e => setField('images', e.target.value)}
                style={{ resize: 'vertical' }}
              />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Leave empty to use auto-generated placeholder images</span>
            </div>
          </Section>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? '⏳ Publishing...' : '🚀 Publish Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
