import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyProperties, deleteProperty, getDashboardStats } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/common/PropertyCard';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [myProperties, setMyProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getMyProperties(),
      ...(isAdmin ? [getDashboardStats()] : [])
    ]).then(([propRes, statsRes]) => {
      setMyProperties(propRes.data.properties);
      if (statsRes) setStats(statsRes.data.stats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await deleteProperty(id);
      setMyProperties(prev => prev.filter(p => p._id !== id));
      toast.success('Property deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div style={{ paddingTop: 68 }}>
      <div className="container" style={{ padding: '48px 24px' }}>
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, color: 'var(--gold)', fontFamily: 'Playfair Display, serif' }}>
              Welcome, {user?.name?.split(' ')[0]}!
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
              {isAdmin ? '🛡 Admin Dashboard' : '👤 My Dashboard'} · {user?.email}
            </p>
          </div>
          <Link to="/add-property" className="btn btn-primary">+ List New Property</Link>
        </div>

        {/* Admin Stats */}
        {isAdmin && stats && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, marginBottom: 20, color: 'var(--text-secondary)', letterSpacing: 1, textTransform: 'uppercase', fontSize: 13, fontFamily: 'Jost, sans-serif' }}>Platform Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {[
                { label: 'Total Listings', value: stats.total, icon: '🏠', color: 'var(--gold)' },
                { label: 'For Sale', value: stats.forSale, icon: '💰', color: 'var(--green)' },
                { label: 'For Rent', value: stats.forRent, icon: '🔑', color: '#7a9ae0' },
                { label: 'Sold', value: stats.sold, icon: '✅', color: 'var(--red)' },
                { label: 'Featured', value: stats.featured, icon: '⭐', color: 'var(--gold)' },
                {
                  label: 'Avg Price',
                  value: stats.avgPrice >= 10000000 ? `₹${(stats.avgPrice / 10000000).toFixed(1)}Cr` : `₹${(stats.avgPrice / 100000).toFixed(1)}L`,
                  icon: '📊', color: 'var(--gold)'
                },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: 'Playfair Display, serif' }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Admin Links */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
              {[
                { to: '/admin/users', icon: '👥', label: 'Manage Users' },
                { to: '/admin/reports', icon: '📊', label: 'View Reports' },
                { to: '/admin/settings', icon: '⚙️', label: 'Settings' },
              ].map(({ to, icon, label }) => (
                <Link key={to} to={to} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '16px',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  color: 'var(--text-secondary)', fontWeight: 500, fontSize: 14, transition: 'all 0.2s', textDecoration: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  <span style={{ fontSize: 20 }}>{icon}</span> {label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* My Properties */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 22 }}>My Properties <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>({myProperties.length})</span></h2>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 'var(--radius)' }} />)}
            </div>
          ) : myProperties.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 64, marginBottom: 16 }}>🏠</div>
              <h3>No properties listed yet</h3>
              <p style={{ marginBottom: 24 }}>Start by listing your first property</p>
              <Link to="/add-property" className="btn btn-primary">List a Property</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {myProperties.map(p => (
                <PropertyCard
                  key={p._id} property={p}
                  onDelete={handleDelete}
                  onEdit={(id) => navigate(`/edit-property/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
