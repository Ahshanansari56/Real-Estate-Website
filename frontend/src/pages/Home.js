import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProperties } from '../utils/api';
import PropertyCard from '../components/common/PropertyCard';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [stats, setStats] = useState({ total: 0, cities: 0, clients: 0, years: 0 });
  const [search, setSearch] = useState({ q: '', city: '', type: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProperties({ featured: 'true', limit: 6 })
      .then(res => {
        setFeaturedProperties(res.data.properties);
        setStats({ total: res.data.total, cities: 24, clients: 3200, years: 12 });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.q) params.set('search', search.q);
    if (search.city) params.set('city', search.city);
    if (search.type) params.set('type', search.type);
    navigate(`/properties?${params}`);
  };

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Jaipur', 'Kolkata'];
  const types = ['house', 'apartment', 'villa', 'office', 'land', 'commercial'];

  return (
    <div style={{ paddingTop: 68 }}>
      {/* HERO */}
      <section style={{
        position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1030 40%, #0d1a20 100%)',
        overflow: 'hidden',
      }}>
        {/* Decorative BG */}
        <div style={{
          position: 'absolute', top: '10%', right: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(82,122,201,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '6px 16px', background: 'var(--gold-dim)', border: '1px solid var(--border)', borderRadius: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: 'var(--gold)', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>Premium Real Estate Platform</span>
            </div>

            <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24 }}>
              Find Your
              <span style={{ display: 'block', color: 'var(--gold)', fontStyle: 'italic' }}>Dream Property</span>
            </h1>

            <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 48, lineHeight: 1.7, maxWidth: 560 }}>
              Discover exclusive listings across India's finest cities. Luxury homes, commercial spaces, and investment properties — all in one place.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} style={{
              background: 'rgba(26,26,48,0.9)', border: '1px solid var(--border)',
              borderRadius: 14, padding: 20, backdropFilter: 'blur(10px)',
              display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end',
            }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Search</label>
                <input
                  className="form-input"
                  placeholder="Keywords, address..."
                  value={search.q}
                  onChange={e => setSearch(p => ({ ...p, q: e.target.value }))}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>City</label>
                <select className="form-select" value={search.city} onChange={e => setSearch(p => ({ ...p, city: e.target.value }))} style={{ width: '100%' }}>
                  <option value="">All Cities</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Type</label>
                <select className="form-select" value={search.type} onChange={e => setSearch(p => ({ ...p, type: e.target.value }))} style={{ width: '100%' }}>
                  <option value="">All Types</option>
                  {types.map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: 44, padding: '0 28px', whiteSpace: 'nowrap' }}>
                🔍 Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '48px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
            {[
              { value: `${stats.total}+`, label: 'Properties Listed' },
              { value: '24+', label: 'Cities Covered' },
              { value: '3,200+', label: 'Happy Clients' },
              { value: '12+', label: 'Years Experience' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--gold)', fontFamily: 'Playfair Display, serif' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 11, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 600 }}>Hand-Picked</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginTop: 8 }}>Featured Properties</h2>
            <div className="gold-line" />
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 340, borderRadius: 'var(--radius)' }} />
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {featuredProperties.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div style={{ fontSize: 48 }}>🏠</div>
              <h3>No featured properties yet</h3>
              <p>Check back soon for exclusive listings</p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/properties" className="btn btn-primary btn-lg">View All Properties →</Link>
          </div>
        </div>
      </section>

      {/* PROPERTY TYPES */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 11, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 600 }}>Browse By</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginTop: 8 }}>Property Types</h2>
            <div className="gold-line" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
            {[
              { type: 'house', icon: '🏠', label: 'Houses' },
              { type: 'apartment', icon: '🏢', label: 'Apartments' },
              { type: 'villa', icon: '🏰', label: 'Villas' },
              { type: 'office', icon: '🏬', label: 'Offices' },
              { type: 'land', icon: '🌿', label: 'Land' },
              { type: 'commercial', icon: '🏪', label: 'Commercial' },
            ].map(({ type, icon, label }) => (
              <Link key={type} to={`/properties?type=${type}`} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '24px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', textDecoration: 'none', transition: 'all 0.25s',
                gap: 10,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.transform = 'none'; }}
              >
                <span style={{ fontSize: 36 }}>{icon}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--bg-card), var(--bg-hover))',
            border: '1px solid var(--border)', borderRadius: 20, padding: '64px 40px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)' }} />
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', marginBottom: 16 }}>Ready to List Your Property?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
              Join thousands of property owners who trust Estate Luxe to connect with serious buyers.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
              <Link to="/properties" className="btn btn-outline btn-lg">Browse Listings</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
