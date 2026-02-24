import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProperty, deleteProperty } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AMENITY_ICONS = { pool: '🏊', gym: '💪', parking: '🅿️', garden: '🌳', security: '🔒', elevator: '🛗', 'air-conditioning': '❄️', wifi: '📶', balcony: '🏗️', rooftop: '🏙️' };
const statusLabels = { 'for-sale': 'For Sale', 'for-rent': 'For Rent', sold: 'Sold', rented: 'Rented' };
const formatPrice = (price) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString()}`;
};

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getProperty(id)
      .then(res => { setProperty(res.data.property); setLoading(false); })
      .catch(() => { toast.error('Property not found'); navigate('/properties'); });
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await deleteProperty(id);
      toast.success('Property deleted');
      navigate('/properties');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) return (
    <div style={{ paddingTop: 68, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loading-spinner" />
    </div>
  );

  if (!property) return null;

  const images = property.images?.length ? property.images : [`https://picsum.photos/seed/${id}/800/600`];
  const canEdit = user && (user._id === property.agent?._id || isAdmin);

  return (
    <div style={{ paddingTop: 68 }}>
      <div className="container" style={{ padding: '48px 24px' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>/</span>
          <Link to="/properties" style={{ color: 'var(--text-muted)' }}>Properties</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{property.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, alignItems: 'start' }}>
          {/* Main Content */}
          <div>
            {/* Image Gallery */}
            <div style={{ marginBottom: 32, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img
                src={images[activeImg]}
                alt={property.title}
                style={{ width: '100%', height: 450, objectFit: 'cover', display: 'block' }}
                onError={e => { e.target.src = `https://picsum.photos/seed/${id}/800/600`; }}
              />
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, padding: 12, background: 'var(--bg-secondary)', overflowX: 'auto' }}>
                  {images.map((img, i) => (
                    <img key={i} src={img} alt={`View ${i + 1}`}
                      onClick={() => setActiveImg(i)}
                      style={{
                        width: 80, height: 60, objectFit: 'cover', borderRadius: 6, cursor: 'pointer',
                        border: `2px solid ${i === activeImg ? 'var(--gold)' : 'transparent'}`,
                        opacity: i === activeImg ? 1 : 0.6, transition: 'all 0.2s',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Title & Header */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-gold">{statusLabels[property.status]}</span>
                  <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>{property.type}</span>
                  {property.featured && <span className="badge badge-gold">⭐ Featured</span>}
                </div>
                {canEdit && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => navigate(`/edit-property/${id}`)} className="btn btn-outline btn-sm">✏️ Edit</button>
                    <button onClick={handleDelete} className="btn btn-danger btn-sm">🗑 Delete</button>
                  </div>
                )}
              </div>
              <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: 8 }}>{property.title}</h1>
              <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                📍 {property.location?.address}, {property.location?.city}, {property.location?.state} — {property.location?.pincode}
              </p>
            </div>

            {/* Key Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 32 }}>
              {[
                { icon: '📐', label: 'Area', val: `${property.area} ${property.areaUnit}` },
                ...(property.bedrooms > 0 ? [{ icon: '🛏', label: 'Bedrooms', val: property.bedrooms }] : []),
                ...(property.bathrooms > 0 ? [{ icon: '🚿', label: 'Bathrooms', val: property.bathrooms }] : []),
                ...(property.parking > 0 ? [{ icon: '🅿️', label: 'Parking', val: property.parking }] : []),
                ...(property.yearBuilt ? [{ icon: '🏗', label: 'Year Built', val: property.yearBuilt }] : []),
                { icon: '👁', label: 'Views', val: property.views },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)', fontFamily: 'Playfair Display, serif' }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16, color: 'var(--gold)' }}>Description</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 15 }}>{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16, color: 'var(--gold)' }}>Amenities</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {property.amenities.map(a => (
                    <span key={a} style={{
                      padding: '6px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      borderRadius: 20, fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      {AMENITY_ICONS[a.toLowerCase()] || '✓'} {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: 88 }}>
            {/* Price Card */}
            <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, var(--bg-card), var(--bg-hover))' }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase' }}>Asking Price</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--gold)', fontFamily: 'Playfair Display, serif', lineHeight: 1.1 }}>
                  {formatPrice(property.price)}
                </div>
                {property.priceType !== 'total' && (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>/{property.priceType.replace('per-', '')}</div>
                )}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Price/sqft</span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                    {formatPrice(Math.round(property.price / property.area))}
                  </span>
                </div>
              </div>
              <a href={`tel:${property.agent?.phone}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }}>
                📞 Call Agent
              </a>
              <a href={`mailto:${property.agent?.email}?subject=Inquiry: ${property.title}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                ✉️ Email Agent
              </a>
            </div>

            {/* Agent Card */}
            <div className="card">
              <h4 style={{ marginBottom: 16, color: 'var(--gold)', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>Listed By</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: 'var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 700, color: '#0d0d1a',
                }}>
                  {property.agent?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{property.agent?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{property.agent?.email}</div>
                  {property.agent?.phone && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{property.agent?.phone}</div>}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center' }}>
                🛡 All properties are verified. We ensure authentic listings and secure transactions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
