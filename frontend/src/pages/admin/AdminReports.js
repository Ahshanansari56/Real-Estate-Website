import { useState, useEffect } from 'react';
import { getReports, generateReport, deleteReport } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newReport, setNewReport] = useState({ title: '', type: 'sales' });
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    getReports().then(res => { setReports(res.data.reports); setLoading(false); });
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await generateReport(newReport);
      setReports(p => [res.data.report, ...p]);
      setNewReport({ title: '', type: 'sales' });
      toast.success('Report generated!');
    } catch (err) {
      toast.error('Failed to generate report');
    } finally { setGenerating(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await deleteReport(id);
      setReports(p => p.filter(r => r._id !== id));
      if (selectedReport?._id === id) setSelectedReport(null);
      toast.success('Report deleted');
    } catch (err) { toast.error('Failed'); }
  };

  const typeIcons = { sales: '💰', inventory: '📦', 'user-activity': '👥', revenue: '📈', custom: '📋' };

  return (
    <div style={{ paddingTop: 68 }}>
      <div className="container" style={{ padding: '48px 24px' }}>
        <div className="page-header">
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Generate and view business analytics</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 32, alignItems: 'start' }}>
          {/* Generate Panel */}
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ color: 'var(--gold)', marginBottom: 20 }}>Generate Report</h3>
              <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Report Title</label>
                  <input className="form-input" placeholder="Q2 Sales Report" value={newReport.title} onChange={e => setNewReport(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Report Type</label>
                  <select className="form-select" value={newReport.type} onChange={e => setNewReport(p => ({ ...p, type: e.target.value }))}>
                    <option value="sales">💰 Sales Report</option>
                    <option value="inventory">📦 Inventory Report</option>
                    <option value="user-activity">👥 User Activity</option>
                    <option value="revenue">📈 Revenue by City</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={generating} style={{ width: '100%', justifyContent: 'center' }}>
                  {generating ? '⏳ Generating...' : '📊 Generate'}
                </button>
              </form>
            </div>

            {/* Reports List */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: 14 }}>Previous Reports ({reports.length})</h4>
              </div>
              {loading ? <div className="flex-center" style={{ height: 100 }}><div className="loading-spinner" /></div> :
                reports.length === 0 ? <div className="empty-state" style={{ padding: 32, fontSize: 13 }}>No reports yet</div> :
                  <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                    {reports.map(r => (
                      <div key={r._id}
                        onClick={() => setSelectedReport(r)}
                        style={{
                          padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid rgba(201,168,76,0.08)',
                          background: selectedReport?._id === r._id ? 'var(--gold-dim)' : 'transparent',
                          transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}
                        onMouseEnter={e => { if (selectedReport?._id !== r._id) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                        onMouseLeave={e => { if (selectedReport?._id !== r._id) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{typeIcons[r.type]} {r.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            {new Date(r.createdAt).toLocaleDateString('en-IN')} · by {r.generatedBy?.name}
                          </div>
                        </div>
                        <button onClick={e => { e.stopPropagation(); handleDelete(r._id); }}
                          style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: 16 }}>🗑</button>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>

          {/* Report Viewer */}
          <div className="card">
            {!selectedReport ? (
              <div className="empty-state">
                <div style={{ fontSize: 64 }}>📊</div>
                <h3>Select a report to view</h3>
                <p>Or generate a new one from the left panel</p>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <h2 style={{ color: 'var(--gold)', marginBottom: 6 }}>{typeIcons[selectedReport.type]} {selectedReport.title}</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Generated by {selectedReport.generatedBy?.name} on {new Date(selectedReport.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <pre style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: 20, fontSize: 12, color: 'var(--text-secondary)',
                  overflowX: 'auto', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                }}>
                  {JSON.stringify(selectedReport.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
