import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Download, RefreshCw, KeyRound, Check, AlertCircle } from 'lucide-react';

export default function AdminPortal() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [fetchError, setFetchError] = useState('');

  const validPass = import.meta.env.VITE_ADMIN_PASSCODE || 'Admin2026!';

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === validPass) {
      setIsAuthenticated(true);
      fetchLeads();
    } else {
      setAuthError('Invalid administrator credentials.');
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    setFetchError('');
    try {
      if (!supabase) throw new Error(supabaseConfigError);

      const { data, error } = await supabase
        .from('ah_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setFetchError(err.message || 'Unable to load leads.');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!leads.length) return;
    const headers = ['Created At', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Hours', 'Source', 'FBCLID'];
    const rows = leads.map((l) => [
      l.created_at,
      `"${l.full_name || ''}"`,
      l.email,
      l.phone || '',
      `"${l.company_name || ''}"`,
      `"${l.service_need || ''}"`,
      `"${l.monthly_hours || ''}"`,
      l.utm_source || 'direct',
      l.fbclid || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: 380, margin: '4rem auto', padding: '0 1rem' }}>
        <div className="paper-card">
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <KeyRound style={{ width: 32, height: 32, color: 'var(--brand-navy)', margin: '0 auto 0.5rem' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-navy)' }}>Admin Access</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--brand-muted)' }}>Enter operator passcode to inspect lead queue.</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="password"
                className="form-input"
                placeholder="Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
            </div>
            {authError && (
              <div style={{ fontSize: '0.75rem', color: 'var(--brand-danger)', marginBottom: '0.75rem' }}>
                {authError}
              </div>
            )}
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Unlock Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-navy)' }}>Lead Intake Pipeline</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--brand-muted)' }}>
            Showing {leads.length} recorded submissions from Facebook Ads & direct traffic.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={fetchLeads} className="btn-pill">
            <RefreshCw style={{ width: 12, height: 12 }} />
            Refresh
          </button>
          <button onClick={exportCSV} className="btn-primary">
            <Download style={{ width: 12, height: 12 }} />
            Export CSV
          </button>
        </div>
      </div>

      {fetchError && (
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.6rem', background: '#fef2f2', border: '1px solid #fee2e2', color: 'var(--brand-danger)', fontSize: '0.75rem', borderRadius: 4 }}>
          <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
          <span>{fetchError}</span>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Prospect</th>
              <th>Company / Needs</th>
              <th>Scope</th>
              <th>Source & Ad Attribution</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--brand-muted)' }}>
                  {loading ? 'Querying Supabase...' : 'No customer records found.'}
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id || Math.random()}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.7rem' }}>
                    {new Date(lead.created_at).toLocaleDateString()} <br />
                    <span style={{ color: 'var(--brand-muted)' }}>
                      {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td>
                    <strong>{lead.full_name}</strong>
                    <div style={{ color: 'var(--brand-muted)', fontSize: '0.75rem' }}>{lead.email}</div>
                    {lead.phone && <div style={{ fontSize: '0.75rem' }}>{lead.phone}</div>}
                  </td>
                  <td>
                    <strong>{lead.company_name || 'Individual'}</strong>
                    <div style={{ color: 'var(--brand-teal)', fontSize: '0.75rem' }}>{lead.service_need}</div>
                    {lead.notes && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--brand-muted)', marginTop: '0.25rem', maxWidth: 280 }}>
                        "{lead.notes}"
                      </div>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{lead.monthly_hours}</td>
                  <td>
                    <span className="badge-source">{lead.utm_source || 'direct'}</span>
                    {lead.fbclid && (
                      <div style={{ fontSize: '0.65rem', color: 'var(--brand-muted)', marginTop: '0.2rem' }}>
                        FB: {lead.fbclid.slice(0, 10)}...
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}