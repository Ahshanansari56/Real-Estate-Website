import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../utils/api';
import PropertyCard from '../components/common/PropertyCard';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    status: searchParams.get('status') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    sort: '-createdAt',
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const res = await getProperties(params);
      setProperties(res.data.properties);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const updateFilter = (key, val) => {
    setFilters(p => ({ ...p, [key]: val }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: '', type: '', status: '', city: '', minPrice: '', maxPrice: '', bedrooms: '', sort: '-createdAt' });
    setPage(1);
  };

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-views', label: 'Most Viewed' },
  ];

  return (
    <div style={{ paddingTop: 68 }}>
      <div className="container" style={{ padding: '48px 24px' }}>
        <div className="page-header">
          <h1 className="page-title">Properties</h1>
          <p className="page-subtitle">{total} properties found</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32, alignItems: 'start' }}>
          {/* Filters Sidebar */}
          <aside>
            <div className="card" style={{ position: 'sticky', top: 88 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16 }}>Filters</h3>
                <button onClick={clearFilters} style={{ fontSize: 12, color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="form-group">
                  <label className="form-label">Search</label>
                  <input className="form-input" placeholder="Keywords..." value={filters.search} onChange={e => updateFilter('search', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" placeholder="City name..." value={filters.city} onChange={e => updateFilter('city', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Property Type</label>
                  <select className="form-select" value={filters.type} onChange={e => updateFilter('type', e.target.value)}>
                    <option value="">All Types</option>
                    {['house', 'apartment', 'villa', 'office', 'land', 'commercial'].map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={filters.status} onChange={e => updateFilter('status', e.target.value)}>
                    <option value="">All Status</option>
                    <option value="for-sale">For Sale</option>
                    <option value="for-rent">For Rent</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Min Price (₹)</label>
                  <input className="form-input" type="number" placeholder="0" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Price (₹)</label>
                  <input className="form-input" type="number" placeholder="No limit" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Bedrooms (min)</label>
                  <select className="form-select" value={filters.bedrooms} onChange={e => updateFilter('bedrooms', e.target.value)}>
                    <option value="">Any</option>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Sort By</label>
                  <select className="form-select" value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {[...Array(9)].map((_, i) => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 'var(--radius)' }} />)}
              </div>
            ) : properties.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: 64 }}>🔍</div>
                <h3>No properties found</h3>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {properties.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-outline btn-sm" style={{ opacity: page === 1 ? 0.5 : 1 }}>← Prev</button>
                {[...Array(pages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`}>{i + 1}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="btn btn-outline btn-sm" style={{ opacity: page === pages ? 0.5 : 1 }}>Next →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
