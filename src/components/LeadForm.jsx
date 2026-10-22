import { useState, useEffect } from 'react';
import { supabase, supabaseConfigError } from '../lib/supabase';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function LeadForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    serviceNeed: 'Process Automation & Workflows',
    monthlyHours: '10-20 hrs/mo',
    primaryBottleneck: '',
  });

  const [attribution, setAttribution] = useState({});
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAttribution({
      fbclid: params.get('fbclid') || null,
      utm_source: params.get('utm_source') || (document.referrer.includes('facebook') ? 'facebook' : 'direct'),
      utm_campaign: params.get('utm_campaign') || null,
      utm_medium: params.get('utm_medium') || null,
      utm_content: params.get('utm_content') || null,
      referrer: document.referrer || null,
    });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      if (!supabase) throw new Error(supabaseConfigError);

      const payload = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        company_name: formData.companyName.trim() || null,
        service_need: formData.serviceNeed,
        monthly_hours: formData.monthlyHours,
        notes: formData.primaryBottleneck.trim() || null,
        ...attribution,
      };

      const { error } = await supabase.from('ah_leads').insert([payload]);
      if (error) throw error;
      setStatus('success');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Transmission failed. Verify your Supabase connection.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="paper-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <CheckCircle2 style={{ width: 44, height: 44, color: 'var(--brand-teal)', margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.25rem', color: 'var(--brand-navy)', marginBottom: '0.5rem', fontWeight: 700 }}>
          Dossier Received
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--brand-muted)', maxWidth: 360, margin: '0 auto 1.5rem' }}>
          Your operational requirements have been securely ingested into Supabase. We will review and follow up within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setFormData({
              fullName: '',
              email: '',
              phone: '',
              companyName: '',
              serviceNeed: 'Process Automation & Workflows',
              monthlyHours: '10-20 hrs/mo',
              primaryBottleneck: '',
            });
            setStatus('idle');
          }}
          className="btn-pill"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="paper-card">
      <div className="form-header">
        <div>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--brand-teal)', textTransform: 'uppercase' }}>
            Direct Ingestion
          </span>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-navy)' }}>
            Schedule an Operations Review
          </h2>
        </div>
        <span style={{ fontSize: '0.65rem', border: '1px solid var(--brand-border)', padding: '0.2rem 0.5rem', borderRadius: 4, background: 'var(--brand-paper)' }}>
          SECURE RLS
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              required
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Jane Doe"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Work Email *</label>
            <input
              type="email"
              name="email"
              required
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@company.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 000-0000"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              name="companyName"
              className="form-input"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Acme Operations"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Core Focus</label>
            <select
              name="serviceNeed"
              className="form-select"
              value={formData.serviceNeed}
              onChange={handleChange}
            >
              <option>Process Automation & Workflows</option>
              <option>Accounts Receivable & Invoicing</option>
              <option>CRM / Pipeline Cleanup</option>
              <option>Executive Operational Support</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Scope</label>
            <select
              name="monthlyHours"
              className="form-select"
              value={formData.monthlyHours}
              onChange={handleChange}
            >
              <option>Under 10 hrs/mo (Advisory)</option>
              <option>10-20 hrs/mo (Part-time)</option>
              <option>20-40 hrs/mo (Partner)</option>
              <option>Fixed-Scope Project</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Key Challenge or Objective</label>
          <textarea
            name="primaryBottleneck"
            rows="3"
            className="form-textarea"
            value={formData.primaryBottleneck}
            onChange={handleChange}
            placeholder="Describe manual tasks, backlog, or systems requiring cleanup..."
          />
        </div>

        {status === 'error' && (
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.6rem', background: '#fef2f2', border: '1px solid #fee2e2', color: 'var(--brand-danger)', fontSize: '0.75rem', borderRadius: 4, marginBottom: '1rem' }}>
            <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <button type="submit" disabled={status === 'submitting'} className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
          {status === 'submitting' ? (
            <>
              <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} />
              Transmitting to Supabase...
            </>
          ) : (
            <>
              Transmit Operational Dossier
              <ArrowRight style={{ width: 14, height: 14 }} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}