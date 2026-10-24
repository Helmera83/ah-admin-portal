import { useState } from 'react';
import BrandLogo from './components/BrandLogo';
import LeadForm from './components/LeadForm';
import AdminPortal from './components/AdminPortal';
import { 
  Cpu, 
  ReceiptText, 
  DatabaseZap, 
  CalendarCheck, 
  ShieldCheck, 
  Check, 
  Lock, 
  Globe, 
  Mail, 
  ArrowRight, 
  X 
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'admin'
  const [isContactOpen, setIsContactOpen] = useState(false);

  const capabilities = [
    {
      icon: Cpu,
      title: 'Workflow Automation',
      description: 'Synchronize forms, tools, and lead channels directly into clean database backends.',
    },
    {
      icon: ReceiptText,
      title: 'AR & Reconciliation',
      description: 'Audit accounts receivable, standard operating procedures, and invoicing pipelines.',
    },
    {
      icon: DatabaseZap,
      title: 'CRM Data Sanitation',
      description: 'Eliminate duplicate customer records and maintain single-source-of-truth accuracy.',
    },
    {
      icon: CalendarCheck,
      title: 'Operational Support',
      description: 'Reliable administrative execution and ongoing operational retainers.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Header */}
      <header className="app-header">
        <div className="container header-inner">
          <button onClick={() => setView('landing')} className="brand-wrapper">
            <BrandLogo size={36} />
          </button>

          <div className="nav-actions">
            {view === 'landing' ? (
              <>
                <button onClick={() => setIsContactOpen(true)} className="btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem' }}>
                  <Mail style={{ width: 14, height: 14 }} />
                  Contact Us
                </button>
                <button onClick={() => setView('admin')} className="btn-pill" title="Private Operator Access">
                  <Lock style={{ width: 12, height: 12 }} />
                  Admin
                </button>
              </>
            ) : (
              <button onClick={() => setView('landing')} className="btn-pill">
                <Globe style={{ width: 12, height: 12 }} />
                Public Site
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main View Router */}
      {view === 'admin' ? (
        <AdminPortal />
      ) : (
        <main className="container">
          {/* Centered Hero Section */}
          <div style={{ maxWidth: '780px', margin: '4rem auto 3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-muted)', background: '#fff', border: '1px solid var(--brand-border)', padding: '0.25rem 0.75rem', borderRadius: '4px', marginBottom: '1.25rem' }}>
              <span style={{ color: 'var(--brand-teal)', fontWeight: 800 }}>AUDIT READY</span>
              <span>— Administrative & Operational Clarity</span>
            </div>

            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--brand-navy)', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
              High-caliber back-office execution for growing companies.
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--brand-muted)', lineHeight: 1.6, maxWidth: '640px', marginBottom: '2rem' }}>
              Eliminate operational drag. AH Administrative Solutions builds workflow pipelines, resolves billing and CRM discrepancies, and runs day-to-day coordination.
            </p>

            {/* Simple Contact Button */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button 
                onClick={() => setIsContactOpen(true)} 
                className="btn-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
              >
                <Mail style={{ width: 16, height: 16 }} />
                Get in Touch
                <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--brand-navy)' }}>
                <Check style={{ width: 16, height: 16, color: 'var(--brand-teal)' }} />
                <span>Documented SOPs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--brand-navy)' }}>
                <Check style={{ width: 16, height: 16, color: 'var(--brand-teal)' }} />
                <span>Workflow & Database Ingestion</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--brand-navy)' }}>
                <Check style={{ width: 16, height: 16, color: 'var(--brand-teal)' }} />
                <span>Flexible Retainers</span>
              </div>
            </div>
          </div>

          {/* Capabilities Grid */}
          <section className="capabilities-grid">
            {capabilities.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="capability-card">
                  <Icon style={{ width: 20, height: 20, color: 'var(--brand-teal)', marginBottom: '0.75rem' }} />
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '0.35rem' }}>
                    {c.title}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--brand-muted)', lineHeight: 1.5 }}>
                    {c.description}
                  </p>
                </div>
              );
            })}
          </section>
        </main>
      )}

      {/* Modal Contact Sheet */}
      {isContactOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            backgroundColor: 'rgba(16, 34, 63, 0.45)', 
            backdropFilter: 'blur(4px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 100, 
            padding: '1rem' 
          }}
          onClick={() => setIsContactOpen(false)}
        >
          <div 
            style={{ width: '100%', maxWidth: '580px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsContactOpen(false)}
              className="btn-pill"
              style={{ position: 'absolute', top: '-2.5rem', right: 0, background: '#fff' }}
            >
              <X style={{ width: 14, height: 14 }} />
              Close
            </button>
            <LeadForm onSuccessClose={() => setIsContactOpen(false)} />
          </div>
        </div>
      )}

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