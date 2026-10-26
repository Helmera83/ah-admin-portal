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
    // Step 1: Operating Profile
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    website: '',
    industry: 'Professional Services & Consulting',
    teamSize: '2 - 5 team members',
    annualRevenue: '$350k - $750k',

    // Step 2: Primary Focus & Diagnostics
    primaryService: 'Invoicing & Bookkeeping',
    secondaryServices: [],
    
    // Invoicing & AR
    monthlyInvoiceVolume: '10 - 30 invoices/mo',
    arAgingFriction: 'Delayed client payments (30+ days overdue)',
    accountingPlatform: 'QuickBooks Online',
    
    // CRM
    crmPlatform: 'HubSpot',
    crmCleanliness: 'Duplicate contacts & missing tags/stages',
    monthlyNewLeads: '20 - 75 leads/mo',
    
    // Automations
    automationPlatform: 'Zapier / Make',
    dataPipelinePain: 'Manual copy-pasting between forms, emails, and databases',
    
    // Calendar
    calendarPlatform: 'Google Calendar + Calendly',
    schedulingBottleneck: 'Double bookings & endless back-and-forth emails',
    weeklyMeetingsCount: '12 - 25 meetings/week',

    // Qualitative objectives
    primaryObjective: '',
    worstManualProcess: '',

    // Step 3: Tech Stack & System Access
    projectManagementTool: 'Asana',
    communicationChannels: 'Slack & Email',
    documentationStatus: 'Partially documented / Mostly in founders head',

    // Step 4: Engagement Scope & SLA
    targetEngagementModel: 'Core Retainer ($1,400/mo - ~20 hrs dedicated)',
    expectedTurnaround: 'Standard (Within 24 business hours)',
    targetStartDate: 'Within the next 7 - 14 days',
    additionalRequirements: '',
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxToggle = (service) => {
    setFormData((prev) => {
      const exists = prev.secondaryServices.includes(service);
      return {
        ...prev,
        secondaryServices: exists
          ? prev.secondaryServices.filter((s) => s !== service)
          : [...prev.secondaryServices, service],
      };
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const cleanEmail = formData.email.trim().toLowerCase();

      // 1. Maintain identity in customers table
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .upsert(
          {
            full_name: formData.fullName.trim(),
            email: cleanEmail,
            phone: formData.phone.trim() || null,
            source: attribution.utm_source === 'facebook' ? 'facebook_lead_ad' : 'website',
          },
          { onConflict: 'email' }
        )
        .select('id')
        .single();

      if (customerError) throw customerError;

      // 2. Insert into the dedicated client_discoveries table
      const { error: discoveryError } = await supabase
        .from('client_discoveries')
        .insert([
          {
            customer_id: customerData?.id,
            full_name: formData.fullName.trim(),
            email: cleanEmail,
            phone: formData.phone.trim() || null,
            company_name: formData.companyName.trim() || null,
            website: formData.website.trim() || null,
            industry: formData.industry,
            team_size: formData.teamSize,
            annual_revenue: formData.annualRevenue,

            // Core pillar selection
            primary_service: formData.primaryService,
            secondary_services: formData.secondaryServices,

            // Diagnostics
            invoicing_volume: formData.monthlyInvoiceVolume,
            ar_friction: formData.arAgingFriction,
            accounting_platform: formData.accountingPlatform,
            crm_platform: formData.crmPlatform,
            crm_cleanliness: formData.crmCleanliness,
            monthly_lead_flow: formData.monthlyNewLeads,
            automation_platform: formData.automationPlatform,
            data_pipeline_friction: formData.dataPipelinePain,
            calendar_platform: formData.calendarPlatform,
            scheduling_friction: formData.schedulingBottleneck,
            meetings_per_week: formData.weeklyMeetingsCount,

            // Qualitative objectives
            primary_objective: formData.primaryObjective.trim() || null,
            worst_manual_process: formData.worstManualProcess.trim() || null,

            // Stack details
            project_management_tool: formData.projectManagementTool,
            communication_channel: formData.communicationChannels,
            documentation_status: formData.documentationStatus,

            // Scope & SLA
            engagement_model: formData.targetEngagementModel,
            sla_turnaround: formData.expectedTurnaround,
            target_start_date: formData.targetStartDate,
            additional_requirements: formData.additionalRequirements.trim() || null,

            // Marketing attribution
            source: attribution.utm_source === 'facebook' ? 'facebook_lead_ad' : 'website',
            fbclid: attribution.fbclid,
            utm_campaign: attribution.utm_campaign,
            utm_medium: attribution.utm_medium,
            utm_content: attribution.utm_content,
            referrer: attribution.referrer,
          },
        ]);

      if (discoveryError) throw discoveryError;

      // 3. Write telemetry event
      await supabase.from('customer_events').insert([
        {
          customer_id: customerData?.id,
          source: attribution.utm_source === 'facebook' ? 'facebook_lead_ad' : 'website',
          event_name: 'discovery_audit_completed',
          payload: {
            primary_service: formData.primaryService,
            engagement_model: formData.targetEngagementModel,
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
      <div className="paper-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
        <CheckCircle2 style={{ width: 52, height: 52, color: 'var(--brand-teal)', margin: '0 auto 1.25rem' }} />
        <h3 style={{ fontSize: '1.45rem', color: 'var(--brand-navy)', marginBottom: '0.65rem', fontWeight: 850 }}>
          Operational Diagnostic Dossier Logged
        </h3>
        <p style={{ fontSize: '0.92rem', color: 'var(--brand-muted)', maxWidth: 480, margin: '0 auto 1.75rem', lineHeight: 1.65 }}>
          Your systems profile and operational requirements have been securely recorded into our database. Amanda will review your responses and reach out to schedule an introductory strategy session.
        </p>
        <button
          type="button"
          onClick={onSuccessClose || (() => { window.location.href = '/'; })}
          className="btn-primary"
          style={{ padding: '0.75rem 2rem' }}
        >
          Return to Portal Overview
        </button>
      </div>
    );
  }

  const stepLabels = [
    { num: 1, title: 'Operating Profile' },
    { num: 2, title: 'Systems Diagnostic' },
    { num: 3, title: 'Tooling & Stack' },
    { num: 4, title: 'Scope & SLA' },
  ];

  return (
    <div className="paper-card" style={{ padding: '2.5rem 2rem' }}>
      {/* Visual Step Progress Tracker */}
      <div style={{ borderBottom: '1px solid var(--brand-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--brand-teal)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Client Diagnostic & Discovery
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 850, color: 'var(--brand-navy)', marginTop: '0.2rem' }}>
              {step === 1 && 'Part 1: Organization & Operating Baseline'}
              {step === 2 && 'Part 2: Operational Friction & Workflow Diagnostic'}
              {step === 3 && 'Part 3: Tech Stack & System Permissions'}
              {step === 4 && 'Part 4: Scope, Service Level Agreement & Timeline'}
            </h2>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-muted)', background: 'var(--brand-paper)', border: '1px solid var(--brand-border)', padding: '0.3rem 0.75rem', borderRadius: 4 }}>
            Stage {step} of 4
          </span>
        </div>

        {/* Progress Track */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {stepLabels.map((s) => (
            <div key={s.num}>
              <div 
                style={{ 
                  height: '4px', 
                  borderRadius: '2px', 
                  background: step >= s.num ? 'var(--brand-teal)' : 'var(--brand-border)',
                  marginBottom: '0.4rem',
                  transition: 'background 0.25s ease'
                }} 
              />
              <span style={{ fontSize: '0.68rem', fontWeight: step === s.num ? 750 : 550, color: step === s.num ? 'var(--brand-navy)' : 'var(--brand-muted)', display: 'block' }}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={step === 4 ? handleSubmit : handleNext}>
        {/* ================= STEP 1: ORGANIZATION & OPERATING BASELINE ================= */}
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
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Direct Work Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. s.jenkins@company.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 000-0000"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company / Legal Entity Name *</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  className="form-input"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Acme Growth Partners LLC"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Website / Portal URL</label>
                <input
                  type="text"
                  name="website"
                  className="form-input"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://acmegrowth.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Primary Industry</label>
                <select
                  name="industry"
                  className="form-select"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  <option>Professional Services & Consulting</option>
                  <option>B2B Agency & Marketing</option>
                  <option>Technology, SaaS & Software</option>
                  <option>Construction & Trades</option>
                  <option>Legal & Financial Services</option>
                  <option>Healthcare & Wellness Practices</option>
                  <option>Other Commercial Entity</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Current Organization / Team Size</label>
                <select
                  name="teamSize"
                  className="form-select"
                  value={formData.teamSize}
                  onChange={handleChange}
                >
                  <option>1 (Founder / Solo Operator)</option>
                  <option>2 - 5 team members</option>
                  <option>6 - 15 team members</option>
                  <option>16 - 35 team members</option>
                  <option>35+ team members</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Annual Revenue Bracket (Approximate)</label>
                <select
                  name="annualRevenue"
                  className="form-select"
                  value={formData.annualRevenue}
                  onChange={handleChange}
                >
                  <option>Early Stage / Under $150k</option>
                  <option>$150k - $350k</option>
                  <option>$350k - $750k</option>
                  <option>$750k - $1.5M</option>
                  <option>$1.5M - $5M+</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}>
              Proceed to Operational Diagnostics
              <ArrowRight style={{ width: 15, height: 15 }} />
            </button>
          </div>
        )}

        {/* ================= STEP 2: OPERATIONAL WORKFLOW DIAGNOSTIC ================= */}
        {step === 2 && (
          <div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Primary Pillar Requiring Administrative Clarity *</label>
              <select
                name="primaryService"
                className="form-select"
                value={formData.primaryService}
                onChange={handleChange}
                style={{ fontWeight: 650, fontSize: '0.95rem' }}
              >
                <option>Invoicing & Bookkeeping</option>
                <option>CRM Administration</option>
                <option>Custom Automations</option>
                <option>Scheduling & Calendar Management</option>
              </select>
            </div>

            {/* Pillar 1 Deep Dive: Invoicing & Bookkeeping */}
            {formData.primaryService === 'Invoicing & Bookkeeping' && (
              <div style={{ background: 'var(--brand-paper)', border: '1px solid var(--brand-border)', borderRadius: 8, padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
                  <ReceiptText style={{ width: 18, height: 18, color: 'var(--brand-teal)' }} />
                  <strong style={{ fontSize: '0.85rem', color: 'var(--brand-navy)' }}>Invoicing & AR Deep-Dive</strong>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Monthly Invoice Volume</label>
                    <select
                      name="monthlyInvoiceVolume"
                      className="form-select"
                      value={formData.monthlyInvoiceVolume}
                      onChange={handleChange}
                    >
                      <option>Under 10 invoices/mo (High ticket / retainer)</option>
                      <option>10 - 30 invoices/mo</option>
                      <option>30 - 75 invoices/mo</option>
                      <option>75+ invoices/mo</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current Primary AR Friction</label>
                    <select
                      name="arAgingFriction"
                      className="form-select"
                      value={formData.arAgingFriction}
                      onChange={handleChange}
                    >
                      <option>Delayed client payments (30+ days overdue)</option>
                      <option>Disorganized invoicing backlog (unbilled work)</option>
                      <option>Manual receipt reconciliation taking too many hours</option>
                      <option>No formal accounts receivable follow-up protocol</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Pillar 2 Deep Dive: CRM Administration */}
            {formData.primaryService === 'CRM Administration' && (
              <div style={{ background: 'var(--brand-paper)', border: '1px solid var(--brand-border)', borderRadius: 8, padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
                  <DatabaseZap style={{ width: 18, height: 18, color: 'var(--brand-teal)' }} />
                  <strong style={{ fontSize: '0.85rem', color: 'var(--brand-navy)' }}>CRM Hygiene & Pipeline Deep-Dive</strong>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Current CRM Cleanliness State</label>
                    <select
                      name="crmCleanliness"
                      className="form-select"
                      value={formData.crmCleanliness}
                      onChange={handleChange}
                    >
                      <option>Duplicate contacts & missing tags/stages</option>
                      <option>Leads slip through cracks with no follow-up cadence</option>
                      <option>Pipeline stages don't reflect actual deal progression</option>
                      <option>Data scattered across spreadsheets and inbox notes</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monthly Inbound Lead Volume</label>
                    <select
                      name="monthlyNewLeads"
                      className="form-select"
                      value={formData.monthlyNewLeads}
                      onChange={handleChange}
                    >
                      <option>Under 20 leads/mo</option>
                      <option>20 - 75 leads/mo</option>
                      <option>75 - 200 leads/mo</option>
                      <option>200+ leads/mo</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Pillar 3 Deep Dive: Custom Automations */}
            {formData.primaryService === 'Custom Automations' && (
              <div style={{ background: 'var(--brand-paper)', border: '1px solid var(--brand-border)', borderRadius: 8, padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
                  <Cpu style={{ width: 18, height: 18, color: 'var(--brand-teal)' }} />
                  <strong style={{ fontSize: '0.85rem', color: 'var(--brand-navy)' }}>Automation & Data Ingestion Deep-Dive</strong>
                </div>

                <div className="form-group">
                  <label className="form-label">Where is the greatest manual data entry burden?</label>
                  <select
                    name="dataPipelinePain"
                    className="form-select"
                    value={formData.dataPipelinePain}
                    onChange={handleChange}
                  >
                    <option>Manual copy-pasting between forms, emails, and databases</option>
                    <option>No webhook/API ingestion from ad platforms (Meta/Google)</option>
                    <option>Broken Zapier/Make recipes that fail silently</option>
                    <option>Need custom client onboarding dispatch upon contract sign</option>
                  </select>
                </div>
              </div>
            )}

            {/* Pillar 4 Deep Dive: Scheduling & Calendar Management */}
            {formData.primaryService === 'Scheduling & Calendar Management' && (
              <div style={{ background: 'var(--brand-paper)', border: '1px solid var(--brand-border)', borderRadius: 8, padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
                  <CalendarCheck style={{ width: 18, height: 18, color: 'var(--brand-teal)' }} />
                  <strong style={{ fontSize: '0.85rem', color: 'var(--brand-navy)' }}>Executive Calendar Coordination Deep-Dive</strong>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Biggest Scheduling Obstacle</label>
                    <select
                      name="schedulingBottleneck"
                      className="form-select"
                      value={formData.schedulingBottleneck}
                      onChange={handleChange}
                    >
                      <option>Double bookings & endless back-and-forth emails</option>
                      <option>Zero protected focus time; calendar constantly fragmented</option>
                      <option>Client meetings scheduled without intake context or prep</option>
                      <option>Time-zone conversion errors with national/international clients</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Average Weekly Meetings Scheduled</label>
                    <select
                      name="weeklyMeetingsCount"
                      className="form-select"
                      value={formData.weeklyMeetingsCount}
                      onChange={handleChange}
                    >
                      <option>5 - 12 meetings/week</option>
                      <option>12 - 25 meetings/week</option>
                      <option>25 - 40 meetings/week</option>
                      <option>40+ meetings/week (Severe calendar overload)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Secondary Services Checkboxes */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Secondary Areas Requiring Retainer Support (Select all that apply)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.4rem' }}>
                {[
                  'Invoicing & Bookkeeping',
                  'CRM Administration',
                  'Custom Automations',
                  'Scheduling & Calendar Management',
                ].filter(s => s !== formData.primaryService).map((serviceName) => (
                  <label 
                    key={serviceName} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      padding: '0.6rem 0.8rem', 
                      border: '1px solid var(--brand-border)', 
                      borderRadius: 6, 
                      cursor: 'pointer',
                      background: formData.secondaryServices.includes(serviceName) ? 'var(--brand-teal-light)' : 'var(--brand-card)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--brand-navy)'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={formData.secondaryServices.includes(serviceName)}
                      onChange={() => handleCheckboxToggle(serviceName)}
                    />
                    <span>{serviceName}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Open-Ended Diagnostic Questions */}
            <div className="form-group">
              <label className="form-label">Primary Operational Objective (What does success look like in 60 days?) *</label>
              <textarea
                name="primaryObjective"
                required
                rows="3"
                className="form-textarea"
                value={formData.primaryObjective}
                onChange={handleChange}
                placeholder="e.g., All overdue accounts collected, CRM leads tagged within 15 minutes, zero double-booked meetings, and automated receipt matching..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Worst Bottleneck or Manual Process Currently Consuming Founder Hours</label>
              <textarea
                name="worstManualProcess"
                rows="3"
                className="form-textarea"
                value={formData.worstManualProcess}
                onChange={handleChange}
                placeholder="e.g., Spending Saturday mornings manually creating invoices in QuickBooks and chasing unpaid balances via text message..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={handleBack} className="btn-pill" style={{ flex: 1, justifyContent: 'center' }}>
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Back
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                Continue to Tech Stack Audit
                <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: TECH STACK & SYSTEM ACCESS AUDIT ================= */}
        {step === 3 && (
          <div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Accounting & Billing Platform</label>
                <select
                  name="accountingPlatform"
                  className="form-select"
                  value={formData.accountingPlatform}
                  onChange={handleChange}
                >
                  <option>QuickBooks Online</option>
                  <option>Xero</option>
                  <option>Stripe Invoicing / Billing</option>
                  <option>Wave Financial</option>
                  <option>FreshBooks</option>
                  <option>Manual Google Sheets / Excel</option>
                  <option>Other / Custom</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Active CRM / Lead System</label>
                <select
                  name="crmPlatform"
                  className="form-select"
                  value={formData.crmPlatform}
                  onChange={handleChange}
                >
                  <option>HubSpot</option>
                  <option>Salesforce</option>
                  <option>Pipedrive</option>
                  <option>Notion / Airtable Databases</option>
                  <option>Zoho CRM</option>
                  <option>GoHighLevel (GHL)</option>
                  <option>Google Sheets Only</option>
                  <option>None Currently Active</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Calendar & Scheduling Setup</label>
                <select
                  name="calendarPlatform"
                  className="form-select"
                  value={formData.calendarPlatform}
                  onChange={handleChange}
                >
                  <option>Google Workspace + Calendly</option>
                  <option>Google Workspace (Native Appointment Schedules)</option>
                  <option>Microsoft 365 / Outlook + Bookings</option>
                  <option>Acuity Scheduling</option>
                  <option>Direct Manual Email Coordination</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Internal Project Management Platform</label>
                <select
                  name="projectManagementTool"
                  className="form-select"
                  value={formData.projectManagementTool}
                  onChange={handleChange}
                >
                  <option>Asana</option>
                  <option>Monday.com</option>
                  <option>ClickUp</option>
                  <option>Trello</option>
                  <option>Notion Project Boards</option>
                  <option>Jira</option>
                  <option>No formal project manager tool</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Primary Team Communication Tool</label>
                <select
                  name="communicationChannels"
                  className="form-select"
                  value={formData.communicationChannels}
                  onChange={handleChange}
                >
                  <option>Slack & Email</option>
                  <option>Microsoft Teams & Outlook</option>
                  <option>Email Only</option>
                  <option>WhatsApp / SMS & Email</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Current Standard Operating Procedures (SOPs)</label>
                <select
                  name="documentationStatus"
                  className="form-select"
                  value={formData.documentationStatus}
                  onChange={handleChange}
                >
                  <option>Partially documented / Mostly in founders head</option>
                  <option>Zero documentation; need Amanda to build SOPs from scratch</option>
                  <option>Established SOP library that needs auditing and update</option>
                  <option>Fully documented and ready for handoff</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={handleBack} className="btn-pill" style={{ flex: 1, justifyContent: 'center' }}>
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Back
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                Continue to Scope & SLA Alignment
                <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: SCOPE, SLA & TIMELINE ================= */}
        {step === 4 && (
          <div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Target Retainer / Engagement Model *</label>
                <select
                  name="targetEngagementModel"
                  className="form-select"
                  value={formData.targetEngagementModel}
                  onChange={handleChange}
                  style={{ fontWeight: 650 }}
                >
                  <option>Core Retainer ($1,400/mo - ~20 hrs dedicated)</option>
                  <option>Operations Partner ($2,600/mo - ~40 hrs bandwidth)</option>
                  <option>Advisory & Systems Audit ($750 flat rate single engagement)</option>
                  <option>Custom Retainer / Variable Scope</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Required SLA / Response Turnaround</label>
                <select
                  name="expectedTurnaround"
                  className="form-select"
                  value={formData.expectedTurnaround}
                  onChange={handleChange}
                >
                  <option>Standard (Within 24 business hours)</option>
                  <option>High Priority (Same business day turnaround)</option>
                  <option>Flexible / Weekly Batch Processing</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Desired Onboarding / Kick-off Timeline</label>
              <select
                name="targetStartDate"
                className="form-select"
                value={formData.targetStartDate}
                onChange={handleChange}
              >
                <option>Immediately (Within 3 - 7 business days)</option>
                <option>Within the next 7 - 14 days</option>
                <option>Start of upcoming month</option>
                <option>Evaluating proposals for next quarter</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Specific Administrative Instructions or Security Constraints</label>
              <textarea
                name="additionalRequirements"
                rows="3"
                className="form-textarea"
                value={formData.additionalRequirements}
                onChange={handleChange}
                placeholder="Mention password management preferences (1Password/Bitwarden), non-disclosure agreement (NDA) requirements, or specific billing cycles..."
              />
            </div>

            {status === 'error' && (
              <div style={{ display: 'flex', gap: '0.5rem', padding: '0.65rem', background: '#fef2f2', border: '1px solid #fee2e2', color: 'var(--brand-danger)', fontSize: '0.78rem', borderRadius: 4, marginBottom: '1.25rem' }}>
                <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={handleBack} disabled={status === 'submitting'} className="btn-pill" style={{ flex: 1, justifyContent: 'center' }}>
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Back
              </button>
              <button type="submit" disabled={status === 'submitting'} className="btn-primary" style={{ flex: 2, padding: '0.85rem' }}>
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} />
                    Transmitting Diagnostic Dossier...
                  </>
                ) : (
                  <>
                    Transmit Operational Discovery Dossier
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