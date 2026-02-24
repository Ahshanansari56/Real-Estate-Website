import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', marginTop: 80 }}>
      <div className="container" style={{ padding: '60px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--gold)', marginBottom: 12 }}>ESTATE LUXE</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.7 }}>
              Premium real estate platform connecting buyers, sellers, and investors with exceptional properties across India.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Navigation</h4>
            {[['/', 'Home'], ['/properties', 'Properties'], ['/login', 'Login'], ['/register', 'Register']].map(([path, label]) => (
              <div key={path} style={{ marginBottom: 8 }}>
                <Link to={path} style={{ color: 'var(--text-muted)', fontSize: 13, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{label}</Link>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Property Types</h4>
            {['Houses', 'Apartments', 'Villas', 'Commercial', 'Land'].map(t => (
              <div key={t} style={{ marginBottom: 8 }}>
                <Link to={`/properties?type=${t.toLowerCase()}`} style={{ color: 'var(--text-muted)', fontSize: 13, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{t}</Link>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Contact</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.7 }}>
              📍 Mumbai, India<br />
              📞 +91 98765 43210<br />
              ✉️ info@estateluxe.in
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>© {new Date().getFullYear()} Estate Luxe. All rights reserved.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Built with MERN Stack</p>
        </div>
      </div>
    </footer>
  );
}
