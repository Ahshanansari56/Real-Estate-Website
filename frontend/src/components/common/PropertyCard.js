import { useState } from 'react';
import { Link } from 'react-router-dom';

const typeIcons = { house: '🏠', apartment: '🏢', villa: '🏰', office: '🏬', land: '🌿', commercial: '🏪' };
const statusColors = { 'for-sale': 'badge-gold', 'for-rent': 'badge-blue', sold: 'badge-red', rented: 'badge-red' };
const statusLabels = { 'for-sale': 'For Sale', 'for-rent': 'For Rent', sold: 'Sold', rented: 'Rented' };

export default function PropertyCard({ property, onDelete, onEdit }) {
  const [hovered, setHovered] = useState(false);

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  const PLACEHOLDER = `https://picsum.photos/seed/${property._id}/600/400`;

  return (
    <div
      style={{
        background: 'var(--bg-card)', border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)', overflow: 'hidden', transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.4)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 200 }}>
        <img
          src={property.images?.[0] || PLACEHOLDER}
          alt={property.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
          onError={e => { e.target.src = PLACEHOLDER; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,26,0.7) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span className={`badge ${statusColors[property.status] || 'badge-gold'}`}>{statusLabels[property.status]}</span>
        </div>
        {property.featured && (
          <div style={{ position: 'absolute', top: 12, right: 12 }}>
            <span className="badge badge-gold">⭐ Featured</span>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 12, left: 12, fontSize: 22 }}>{typeIcons[property.type] || '🏠'}</div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>
          {property.title}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
          📍 {property.location?.address}, {property.location?.city}
        </p>

        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          {property.bedrooms > 0 && <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>🛏 {property.bedrooms} Beds</span>}
          {property.bathrooms > 0 && <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>🚿 {property.bathrooms} Baths</span>}
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>📐 {property.area} {property.areaUnit}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gold)', fontFamily: 'Playfair Display, serif' }}>
              {formatPrice(property.price)}
            </div>
            {property.priceType !== 'total' && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>/{property.priceType.replace('per-', '')}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {onEdit && (
              <button onClick={() => onEdit(property._id)} className="btn btn-outline btn-sm" style={{ padding: '5px 12px' }}>Edit</button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(property._id)} className="btn btn-danger btn-sm" style={{ padding: '5px 12px' }}>Delete</button>
            )}
            <Link to={`/properties/${property._id}`} className="btn btn-primary btn-sm" style={{ padding: '5px 12px' }}>View →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
