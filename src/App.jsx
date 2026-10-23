import { useState } from 'react';
import BrandLogo from './components/BrandLogo';
import LeadForm from './components/LeadForm';
import AdminPortal from './components/AdminPortal';
import { Cpu, ReceiptText, DatabaseZap, CalendarCheck, ShieldCheck, Check, Lock, Globe } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'admin'

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
              <button onClick={() => setView('admin')} className="btn-pill" title="Private Operator Access">
                <Lock style={{ width: 12, height: 12 }} />
                Admin
              </button>
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
          <div className="hero-grid">
            {/* Value Proposition Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-muted)' }}>
                <span style={{ color: 'var(--brand-teal)', fontWeight: 800 }}>AUDIT READY</span>
                <span>— Administrative Clarity</span>
              </div>

              <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--brand-navy)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                High-caliber back-office execution for growing companies.
              </h1>

              <p style={{ fontSize: '0.9rem', color: 'var(--brand-muted)', lineHeight: 1.6 }}>
                Eliminate operational drag. AH Administrative Solutions builds workflow pipelines, resolves billing and CRM discrepancies, and runs day-to-day back-office coordination.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--brand-navy)' }}>
                  <Check style={{ width: 16, height: 16, color: 'var(--brand-teal)' }} />
                  <span>Documented Standard Operating Procedures (SOPs)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--brand-navy)' }}>
                  <Check style={{ width: 16, height: 16, color: 'var(--brand-teal)' }} />
                  <span>Direct Meta ad attribution & CRM sync</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--brand-navy)' }}>
                  <Check style={{ width: 16, height: 16, color: 'var(--brand-teal)' }} />
                  <span>Flexible monthly support retainers</span>
                </div>
              </div>
            </div>

            {/* Lead Intake Form Column */}
            <div>
              <LeadForm />
            </div>
          </div>

          {/* Capabilities Section */}
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