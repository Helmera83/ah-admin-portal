import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function LeadForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    serviceNeed: 'Invoicing & Bookkeeping',
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
      const cleanEmail = formData.email.trim().toLowerCase();

      // Upsert into customers table
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .upsert(
          {
            full_name: formData.fullName.trim(),
            email: cleanEmail,
            phone: formData.phone.trim() || null,
            source: attribution.utm_source === 'facebook' ? 'facebook_lead_ad' : 'website',
            metadata: {
              company_name: formData.companyName.trim() || null,
              service_need: formData.serviceNeed,
              primary_bottleneck: formData.primaryBottleneck.trim() || null,
              fbclid: attribution.fbclid,
              utm_campaign: attribution.utm_campaign,
              utm_medium: attribution.utm_medium,
              utm_content: attribution.utm_content,
              referrer: attribution.referrer,
            },
          },
          { onConflict: 'email' }
        )
        .select('id')
        .single();

      if (customerError) throw customerError;

      // Log event in customer_events
      await supabase.from('customer_events').insert([
        {
          customer_id: customerData?.id,
          source: attribution.utm_source === 'facebook' ? 'facebook_lead_ad' : 'website',
          event_name: 'lead_submitted',
          payload: {
            service_need: formData.serviceNeed,
            captured_at: new Date().toISOString(),
          },
        },
      ]);

      setStatus('success');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Submission failed. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="paper-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
        <CheckCircle2 style={{ width: 48, height: 48, color: 'var(--brand-teal)', margin: '0 auto 1.25rem' }} />
        <h3 style={{ fontSize: '1.4rem', color: 'var(--brand-navy)', marginBottom: '0.65rem', fontWeight: 800 }}>
          Dossier Received
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--brand-muted)', maxWidth: 420, margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
          Thank you for reaching out. Your operational requirements have been securely recorded. Amanda will review your details and respond within one business day.
        </p>
        <button
          type="button"
          onClick={() => {
            setFormData({
              fullName: '',
              email: '',
              phone: '',
              companyName: '',
              serviceNeed: 'Invoicing & Bookkeeping',
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
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--brand-teal)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Direct Contact Form
          </span>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 850, color: 'var(--brand-navy)', marginTop: '0.2rem' }}>
            Send Us a Message
          </h2>
        </div>
        <span style={{ fontSize: '0.68rem', fontWeight: 700, border: '1px solid var(--brand-border)', padding: '0.25rem 0.6rem', borderRadius: 4, background: 'var(--brand-paper)', color: 'var(--brand-muted)' }}>
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
            <label className="form-label">Phone</label>
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

        <div className="form-group">
          <label className="form-label">Primary Service Need</label>
          <select
            name="serviceNeed"
            className="form-select"
            value={formData.serviceNeed}
            onChange={handleChange}
          >
            <option>Invoicing & Bookkeeping</option>
            <option>CRM Administration</option>
            <option>Custom Automations</option>
            <option>Scheduling & Calendar Management</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">How can we assist?</label>
          <textarea
            name="primaryBottleneck"
            rows="4"
            className="form-textarea"
            value={formData.primaryBottleneck}
            onChange={handleChange}
            placeholder="Tell us about your current administrative bottlenecks, tools, or schedule..."
          />
        </div>

        {status === 'error' && (
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.65rem', background: '#fef2f2', border: '1px solid #fee2e2', color: 'var(--brand-danger)', fontSize: '0.78rem', borderRadius: 4, marginBottom: '1.25rem' }}>
            <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <button type="submit" disabled={status === 'submitting'} className="btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
          {status === 'submitting' ? (
            <>
              <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} />
              Transmitting to Supabase...
            </>
          ) : (
            <>
              Submit Operational Dossier
              <ArrowRight style={{ width: 14, height: 14 }} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}