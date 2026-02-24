import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ paddingTop: 68, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 120, fontFamily: 'Playfair Display, serif', fontWeight: 900, color: 'var(--gold)', lineHeight: 1, opacity: 0.3 }}>404</div>
        <h1 style={{ fontSize: 32, marginTop: 16, marginBottom: 12 }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>The page you're looking for doesn't exist or has been moved.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/properties" className="btn btn-outline">Browse Properties</Link>
        </div>
      </div>
    </div>
  );
}
