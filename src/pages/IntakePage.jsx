import BrandLogo from '../components/BrandLogo';
import LeadForm from '../components/LeadForm';
import { ArrowLeft, ShieldCheck, Check } from 'lucide-react';

export default function IntakePage({ onBack }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Header */}
      <header className="app-header">
        <div className="container header-inner">
          <div className="brand-wrapper">
            <BrandLogo size={36} />
          </div>
          <div className="nav-actions">
            <button onClick={onBack} className="btn-pill">
              <ArrowLeft style={{ width: 14, height: 14 }} />
              Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Page Container */}
      <main className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '880px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge-pill" style={{ margin: '0 auto 0.85rem' }}>
            <span className="badge-highlight">CLIENT ONBOARDING</span>
            <span>— Operational Needs Assessment</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--brand-navy)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Schedule an Operations Review
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--brand-muted)', maxWidth: 580, margin: '0 auto', lineHeight: 1.6 }}>
            Tell us about your administrative bottlenecks, systems, and support requirements. We review every submission within one business day.
          </p>
        </div>

        {/* The Intake Form */}
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <LeadForm />
        </div>

        {/* Trust Guarantees */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--brand-navy)', fontWeight: 600 }}>
            <Check style={{ width: 16, height: 16, color: 'var(--brand-teal)' }} />
            <span>Strict Client Confidentiality</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--brand-navy)', fontWeight: 600 }}>
            <Check style={{ width: 16, height: 16, color: 'var(--brand-teal)' }} />
            <span>Documented SOPs & Clear Scoping</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} AH Administrative Solutions. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck style={{ width: 14, height: 14, color: 'var(--brand-teal)' }} />
            <span>Supabase Ingestion Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}