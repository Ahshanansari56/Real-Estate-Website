import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProperty, updateProperty } from '../utils/api';
import toast from 'react-hot-toast';

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState(null);

  useEffect(() => {
    getProperty(id).then(res => {
      const p = res.data.property;
      setForm({
        title: p.title, description: p.description, type: p.type, status: p.status,
        price: p.price, priceType: p.priceType, area: p.area, areaUnit: p.areaUnit,
        bedrooms: p.bedrooms, bathrooms: p.bathrooms, parking: p.parking,
        yearBuilt: p.yearBuilt || '', images: (p.images || []).join('\n'),
        location: p.location || { address: '', city: '', state: '', pincode: '', country: 'India' },
        amenities: p.amenities || [], featured: p.featured || false,
      });
      setFetching(false);
    }).catch(() => { toast.error('Property not found'); navigate('/dashboard'); });
  }, [id]);

  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const setLocation = (key, val) => setForm(p => ({ ...p, location: { ...p.location, [key]: val } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        price: Number(form.price), area: Number(form.area),
        bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms), parking: Number(form.parking),
        images: form.images ? form.images.split('\n').filter(u => u.trim()) : [],
      };
      await updateProperty(id, data);
      toast.success('Property updated!');
      navigate(`/properties/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ paddingTop: 68, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loading-spinner" /></div>;
  if (!form) return null;

  return (
    <div style={{ paddingTop: 68 }}>
      <div className="container" style={{ padding: '48px 24px', maxWidth: 800 }}>
        <div className="page-header">
          <h1 className="page-title">Edit Property</h1>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <h3 style={{ color: 'var(--gold)', marginBottom: 20 }}>Basic Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" value={form.title} onChange={e => setField('title', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={4} value={form.description} onChange={e => setField('description', e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={e => setField('type', e.target.value)}>
                    {['house', 'apartment', 'villa', 'office', 'land', 'commercial'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={e => setField('status', e.target.value)}>
                    <option value="for-sale">For Sale</option>
                    <option value="for-rent">For Rent</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input className="form-input" type="number" value={form.price} onChange={e => setField('price', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Area</label>
                  <input className="form-input" type="number" value={form.area} onChange={e => setField('area', e.target.value)} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Bedrooms</label>
                  <input className="form-input" type="number" value={form.bedrooms} onChange={e => setField('bedrooms', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bathrooms</label>
                  <input className="form-input" type="number" value={form.bathrooms} onChange={e => setField('bathrooms', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ color: 'var(--gold)', marginBottom: 20 }}>Location</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-input" value={form.location.address} onChange={e => setLocation('address', e.target.value)} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" value={form.location.city} onChange={e => setLocation('city', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input className="form-input" value={form.location.state} onChange={e => setLocation('state', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ color: 'var(--gold)', marginBottom: 20 }}>Images</h3>
            <div className="form-group">
              <label className="form-label">Image URLs (one per line)</label>
              <textarea className="form-input" rows={3} value={form.images} onChange={e => setField('images', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
