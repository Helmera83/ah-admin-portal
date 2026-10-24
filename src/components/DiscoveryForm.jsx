import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  ArrowLeft, 
  ReceiptText, 
  DatabaseZap, 
  Cpu, 
  CalendarCheck 
} from 'lucide-react';

export default function DiscoveryForm({ onSuccessClose }) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [attribution, setAttribution] = useState({});

  const [formData, setFormData] = useState({
    // Step 1: Contact & Company
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    website: '',
    teamSize: '1-5',

    // Step 2: Core Focus & Operational Needs
    serviceNeed: 'Invoicing & Bookkeeping',
    primaryBottleneck: '',
    accountingTool: 'QuickBooks Online',
    crmTool: 'HubSpot',
    calendarTool: 'Google Calendar / Calendly',

    // Step 3: Scope & Engagement Model
    engagementModel: 'Core Retainer ($1,400/mo)',
    targetStartDate: 'Immediately',
    additionalNotes: '',
  });

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

  const handleNext = (e) => {
    e.preventDefault();
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
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
              website: formData.website.trim() || null,
              team_size: formData.teamSize,
              service_need: formData.serviceNeed,
              primary_bottleneck: formData.primaryBottleneck.trim() || null,
              accounting_tool: formData.accountingTool,
              crm_tool: formData.crmTool,
              calendar_tool: formData.calendarTool,
              engagement_model: formData.engagementModel,
              target_start_date: formData.targetStartDate,
              additional_notes: formData.additionalNotes.trim() || null,
              fbclid: attribution.fbclid,
              utm_campaign: attribution.utm_campaign,
              utm_medium: attribution.utm_medium,
              utm_content: attribution.utm_content,
              referrer: attribution.referrer,
              submitted_form: 'client_discovery',
            },
          },
          { onConflict: 'email' }
        )
        .select('id')
        .single();

      if (customerError) throw customerError;

      // Insert audit event
      await supabase.from('customer_events').insert([
        {
          customer_id: customerData?.id,
          source: attribution.utm_source === 'facebook' ? 'facebook_lead_ad' : 'website',
          event_name: 'discovery_form_completed',
          payload: {
            service_need: formData.serviceNeed,
            engagement_model: formData.engagementModel,
            team_size: formData.teamSize,
            captured_at: new Date().toISOString(),
          },
        },
      ]);

      setStatus('success');
    } catch (err) {
      console.error('Discovery submission error:', err);
      setErrorMessage(err.message || 'Submission failed. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="paper-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <CheckCircle2 style={{ width: 48, height: 48, color: 'var(--brand-teal)', margin: '0 auto 1.25rem' }} />
        <h3 style={{ fontSize: '1.35rem', color: 'var(--brand-navy)', marginBottom: '0.65rem', fontWeight: 800 }}>
          Discovery Dossier Received
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--brand-muted)', maxWidth: 420, margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
          Your systems profile and operational requirements have been registered. Amanda will review your tech stack and reach out to schedule an introductory call.
        </p>
        <button
          type="button"
          onClick={onSuccessClose || (() => setStatus('idle'))}
          className="btn-primary"
          style={{ padding: '0.65rem 1.75rem' }}
        >
          Return to Portal
        </button>
      </div>
    );
  }

  return (
    <div className="paper-card" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
      {/* Header & Step Indicator */}
      <div className="form-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--brand-teal)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Client Onboarding & Discovery
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 850, color: 'var(--brand-navy)', marginTop: '0.2rem' }}>
            {step === 1 && 'Step 1: Contact & Organization'}
            {step === 2 && 'Step 2: Systems, Tooling & Workflows'}
            {step === 3 && 'Step 3: Scope, Timeline & Delivery'}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem' }}>
          {[1, 2, 3].map((num) => (
            <span
              key={num}
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: step === num ? 'var(--brand-navy)' : 'var(--brand-border)',
                color: step === num ? '#ffffff' : 'var(--brand-muted)',
              }}
            >
              {num}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={step === 3 ? handleSubmit : handleNext}>
        {/* STEP 1: Contact & Organization */}
        {step === 1 && (
          <div>
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
                  placeholder="Jane Smith"
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
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company / Legal Name *</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  className="form-input"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Acme Operations LLC"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company Website / Domain</label>
                <input
                  type="text"
                  name="website"
                  className="form-input"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="acmeoperations.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Team Size</label>
                <select
                  name="teamSize"
                  className="form-select"
                  value={formData.teamSize}
                  onChange={handleChange}
                >
                  <option>1 (Founder / Solo)</option>
                  <option>2 - 5 team members</option>
                  <option>6 - 15 team members</option>
                  <option>16+ team members</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}>
              Proceed to Systems & Workflows
              <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
        )}

        {/* STEP 2: Systems, Tooling & Workflows */}
        {step === 2 && (
          <div>
            <div className="form-group">
              <label className="form-label">Primary Engagement Focus *</label>
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

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Current Accounting / Billing Tool</label>
                <select
                  name="accountingTool"
                  className="form-select"
                  value={formData.accountingTool}
                  onChange={handleChange}
                >
                  <option>QuickBooks Online</option>
                  <option>Xero</option>
                  <option>Wave / FreshBooks</option>
                  <option>Stripe Invoicing</option>
                  <option>Manual Spreadsheets / Paper</option>
                  <option>Other / None</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Current CRM Platform</label>
                <select
                  name="crmTool"
                  className="form-select"
                  value={formData.crmTool}
                  onChange={handleChange}
                >
                  <option>HubSpot</option>
                  <option>Salesforce</option>
                  <option>Pipedrive</option>
                  <option>Notion / Airtable</option>
                  <option>Google Sheets / Excel</option>
                  <option>Other / None</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Calendar & Scheduling Environment</label>
              <select
                name="calendarTool"
                className="form-select"
                value={formData.calendarTool}
                onChange={handleChange}
              >
                <option>Google Calendar + Calendly</option>
                <option>Google Workspace (Native)</option>
                <option>Microsoft 365 / Outlook</option>
                <option>Acuity Scheduling</option>
                <option>Manual Email Coordination</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Bottleneck or Operational Objective *</label>
              <textarea
                name="primaryBottleneck"
                required
                rows="3"
                className="form-textarea"
                value={formData.primaryBottleneck}
                onChange={handleChange}
                placeholder="Where is time or money currently being lost? (e.g., unpaid invoice backlog, untracked CRM leads, missed meetings, manual data entry)..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button type="button" onClick={handleBack} className="btn-pill" style={{ flex: 1, justifyContent: 'center' }}>
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Back
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                Continue to Scope & Delivery
                <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Scope, Timeline & Delivery */}
        {step === 3 && (
          <div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Target Engagement Model</label>
                <select
                  name="engagementModel"
                  className="form-select"
                  value={formData.engagementModel}
                  onChange={handleChange}
                >
                  <option>Advisory & Systems Audit ($750 flat rate)</option>
                  <option>Core Retainer ($1,400/mo - Up to 20 hrs)</option>
                  <option>Operations Partner ($2,600/mo - Up to 40 hrs)</option>
                  <option>Undecided / Custom Scope</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Desired Onboarding Timeline</label>
                <select
                  name="targetStartDate"
                  className="form-select"
                  value={formData.targetStartDate}
                  onChange={handleChange}
                >
                  <option>Immediately (Within 7 business days)</option>
                  <option>Next Month / Upcoming Quarter</option>
                  <option>Exploring Options & Budgeting</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Context or Requirements</label>
              <textarea
                name="additionalNotes"
                rows="3"
                className="form-textarea"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Mention specific workflows, communication preferences, or access requirements..."
              />
            </div>

            {status === 'error' && (
              <div style={{ display: 'flex', gap: '0.5rem', padding: '0.6rem', background: '#fef2f2', border: '1px solid #fee2e2', color: 'var(--brand-danger)', fontSize: '0.75rem', borderRadius: 4, marginBottom: '1rem' }}>
                <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button type="button" onClick={handleBack} disabled={status === 'submitting'} className="btn-pill" style={{ flex: 1, justifyContent: 'center' }}>
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Back
              </button>
              <button type="submit" disabled={status === 'submitting'} className="btn-primary" style={{ flex: 2 }}>
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} />
                    Transmitting Dossier...
                  </>
                ) : (
                  <>
                    Submit Discovery Form
                    <ArrowRight style={{ width: 14, height: 14 }} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}