import { useState, useEffect } from 'react';
import { getUsers, deleteUser, toggleUserStatus, updateUser } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    getUsers().then(res => { setUsers(res.data.users); setLoading(false); });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers(p => p.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch (err) { toast.error('Failed to delete'); }
  };

  const handleToggle = async (id) => {
    try {
      const res = await toggleUserStatus(id);
      setUsers(p => p.map(u => u._id === id ? res.data.user : u));
      toast.success('Status updated');
    } catch (err) { toast.error('Failed'); }
  };

  const handleUpdateRole = async (id, role) => {
    try {
      const res = await updateUser(id, { role });
      setUsers(p => p.map(u => u._id === id ? res.data.user : u));
      toast.success('Role updated');
    } catch (err) { toast.error('Failed'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingTop: 68 }}>
      <div className="container" style={{ padding: '48px 24px' }}>
        <div className="page-header">
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">{users.length} total users</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <input
            className="form-input" placeholder="🔍 Search users..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }}
          />
          <div style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text-muted)' }}>
            <span>👥 Total: {users.length}</span>
            <span>🛡 Admins: {users.filter(u => u.role === 'admin').length}</span>
            <span>✅ Active: {users.filter(u => u.isActive).length}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="loading-spinner" /></div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#0d0d1a', flexShrink: 0 }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{u.email}</td>
                      <td>
                        <select value={u.role} onChange={e => handleUpdateRole(u._id, e.target.value)}
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, color: u.role === 'admin' ? 'var(--gold)' : 'var(--text-secondary)', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                          {u.isActive ? '● Active' : '● Inactive'}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => handleToggle(u._id)} className="btn btn-outline btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button onClick={() => handleDelete(u._id)} className="btn btn-danger btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="empty-state" style={{ padding: '48px' }}>
                  <h3>No users found</h3>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
