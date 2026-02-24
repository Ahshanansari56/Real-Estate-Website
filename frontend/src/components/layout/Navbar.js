import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
      background: scrolled ? 'rgba(13,13,26,0.97)' : 'rgba(13,13,26,0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, background: 'var(--gold)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 900, color: '#0d0d1a', fontFamily: 'Playfair Display, serif'
          }}>E</div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>ESTATE</div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text-muted)', textTransform: 'uppercase' }}>LUXE</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          {[['/', 'Home'], ['/properties', 'Properties']].map(([path, label]) => (
            <Link key={path} to={path} style={{
              color: location.pathname === path ? 'var(--gold)' : 'var(--text-secondary)',
              fontSize: 14, fontWeight: 500, letterSpacing: 0.5,
              transition: 'color 0.2s', textDecoration: 'none',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = location.pathname === path ? 'var(--gold)' : 'var(--text-secondary)'}
            >{label}</Link>
          ))}
          {isAdmin && (
            <div style={{ position: 'relative', display: 'flex', gap: 20 }}>
              {[
                ['/admin/users', 'Users'],
                ['/admin/reports', 'Reports'],
                ['/admin/settings', 'Settings'],
              ].map(([path, label]) => (
                <Link key={path} to={path} style={{
                  color: location.pathname === path ? 'var(--gold)' : 'var(--text-secondary)',
                  fontSize: 14, fontWeight: 500, letterSpacing: 0.5,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                onMouseLeave={e => e.target.style.color = location.pathname === path ? 'var(--gold)' : 'var(--text-secondary)'}
                >{label}</Link>
              ))}
            </div>
          )}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isAuthenticated ? (
            <>
              {isAuthenticated && (
                <Link to="/add-property" className="btn btn-outline btn-sm">
                  + List Property
                </Link>
              )}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setMenuOpen(!menuOpen)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)',
                  border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px',
                  color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: 'var(--gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: '#0d0d1a',
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>▼</span>
                </button>
                {menuOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: 8,
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: '8px 0', minWidth: 180,
                    boxShadow: 'var(--shadow)', zIndex: 100,
                  }}>
                    {[
                      ['/dashboard', '📊 Dashboard'],
                      ['/profile', '👤 Profile'],
                      ...(isAdmin ? [['/admin/users', '🛡 Admin Panel']] : []),
                    ].map(([path, label]) => (
                      <Link key={path} to={path} style={{
                        display: 'block', padding: '10px 20px', fontSize: 13,
                        color: 'var(--text-secondary)', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.target.style.background = 'var(--bg-hover)'; e.target.style.color = 'var(--gold)'; }}
                      onMouseLeave={e => { e.target.style.background = ''; e.target.style.color = 'var(--text-secondary)'; }}
                      >{label}</Link>
                    ))}
                    <div style={{ margin: '6px 0', height: 1, background: 'var(--border)' }} />
                    <button onClick={handleLogout} style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 20px', fontSize: 13, background: 'none', border: 'none',
                      color: 'var(--red)', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.background = 'rgba(224,82,82,0.1)'}
                    onMouseLeave={e => e.target.style.background = ''}
                    >🚪 Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
