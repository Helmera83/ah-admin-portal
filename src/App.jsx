import { useState, useEffect } from 'react';
import BrandLogo from './components/BrandLogo';
import AdminPortal from './components/AdminPortal';
import IntakePage from './pages/IntakePage';
import heroImage from './assets/hero-office.jpg';
import { 
  ReceiptText, 
  DatabaseZap, 
  Cpu, 
  CalendarCheck, 
  ShieldCheck, 
  Check, 
  Lock, 
  Globe, 
  Mail, 
  ArrowRight
} from 'lucide-react';

export default function App() {
  // Read path or query parameter on initial load
  const [view, setView] = useState(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    if (path.includes('intake') || params.get('view') === 'intake') return 'intake';
    if (path.includes('admin') || params.get('view') === 'admin') return 'admin';
    return 'landing';
  });

  const navigateTo = (newView) => {
    setView(newView);
    const search = window.location.search; // preserves fbclid/utm parameters
    if (newView === 'intake') {
      window.history.pushState({}, '', `/intake${search}`);
    } else if (newView === 'admin') {
      window.history.pushState({}, '', `/admin${search}`);
    } else {
      window.history.pushState({}, '', `/${search}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('intake')) setView('intake');
      else if (path.includes('admin')) setView('admin');
      else setView('landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const capabilities = [
    {
      icon: ReceiptText,
      title: 'Invoicing & Bookkeeping',
      description: 'Full-cycle accounts receivable, invoice creation, billing reconciliation, and payment follow-ups.',
    },
    {
      icon: DatabaseZap,
      title: 'CRM Administration',
      description: 'Pipeline hygiene, custom data fields, lead routing, and removing duplicate customer records.',
    },
    {
      icon: Cpu,
      title: 'Custom Automations',
      description: 'Connect form intakes, database pipelines, webhook relays, and cross-platform workflows.',
    },
    {
      icon: CalendarCheck,
      title: 'Scheduling & Calendar Management',
      description: 'Executive time blocking, meeting coordination, calendar de-conflicting, and booking links.',
    },
  ];

  const pricingTiers = [
    {
      name: 'Advisory & Systems Audit',
      badge: 'Single Engagement',
      price: '$750',
      period: 'flat rate',
      description: 'Complete audit of your bookkeeping workflow, CRM configuration, calendar booking systems, and tech stack.',
      features: [
        'Full administrative workflow & billing audit',
        'CRM data integrity review & hygiene plan',
        'Custom automation opportunities roadmap',
        'Documentation of standard operating procedures',
      ],
      popular: false,
      cta: 'Request Systems Audit',
    },
    {
      name: 'Core Retainer',
      badge: 'Most Popular',
      price: '$1,400',
      period: 'per month',
      description: 'Ongoing dedicated administrative execution across bookkeeping, CRM maintenance, and calendar management.',
      features: [
        'Up to 20 hours/month dedicated bandwidth',
        'Regular invoice dispatch & AR reconciliation',
        'CRM hygiene, record updates & tagging',
        'Daily calendar management & client scheduling',
        'Asynchronous communication via Slack/Email',
      ],
      popular: true,
      cta: 'Start Core Retainer',
    },
    {
      name: 'Operations Partner',
      badge: 'High-Volume Scope',
      price: '$2,600',
      period: 'per month',
      description: 'Embedded administrative leadership with custom automations, end-to-end bookkeeping, and priority support.',
      features: [
        'Up to 40 hours/month dedicated bandwidth',
        'Custom webhooks, Zapier/Make & database automations',
        'Complete end-to-end billing & payment oversight',
        'Executive calendar defense & appointment setting',
        'Priority same-business-day turnaround',
      ],
      popular: false,
      cta: 'Inquire for Bandwidth',
    },
  ];

  // Route: Intake Page
  if (view === 'intake') {
    return <IntakePage onBack={() => navigateTo('landing')} />;
  }

  // Route: Admin Console
  if (view === 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <header className="app-header">
          <div className="container header-inner">
            <button onClick={() => navigateTo('landing')} className="brand-wrapper">
              <BrandLogo size={36} />
            </button>
            <div className="nav-actions">
              <button onClick={() => navigateTo('landing')} className="btn-pill">
                <Globe style={{ width: 12, height: 12 }} />
                Public Site
              </button>
            </div>
          </div>
        </header>
        <AdminPortal />
      </div>
    );
  }

  // Route: Main Landing Page
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Header */}
      <header className="app-header">
        <div className="container header-inner">
          <button onClick={() => navigateTo('landing')} className="brand-wrapper">
            <BrandLogo size={36} />
          </button>

          <div className="nav-actions">
            <button 
              onClick={() => navigateTo('intake')} 
              className="btn-primary" 
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem' }}
            >
              <Mail style={{ width: 14, height: 14 }} />
              Client Intake
            </button>
            <button onClick={() => navigateTo('admin')} className="btn-pill" title="Private Operator Access">
              <Lock style={{ width: 12, height: 12 }} />
              Admin
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Executive Split Hero */}
        <div className="hero-split">
          <div className="hero-copy">
            <div className="badge-pill">
              <span className="badge-highlight">AUDIT READY</span>
              <span>— Administrative & Operational Clarity</span>
            </div>

            <h1>High-caliber back-office execution for growing companies.</h1>

            <p className="hero-desc">
              Eliminate operational drag. AH Administrative Solutions manages your invoicing, maintains CRM accuracy, builds custom automations, and handles executive calendar coordination.
            </p>

            <div className="hero-actions">
              <button 
                onClick={() => navigateTo('intake')} 
                className="btn-primary hero-btn"
              >
                <Mail style={{ width: 16, height: 16 }} />
                Start Intake Form
                <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <div className="trust-list">
              <div className="trust-item">
                <Check style={{ width: 16, height: 16, color: 'var(--brand-teal)' }} />
                <span>Invoicing & Bookkeeping Oversight</span>
              </div>
              <div className="trust-item">
                <Check style={{ width: 16, height: 16, color: 'var(--brand-teal)' }} />
                <span>CRM Administration & Custom Automations</span>
              </div>
              <div className="trust-item">
                <Check style={{ width: 16, height: 16, color: 'var(--brand-teal)' }} />
                <span>Executive Calendar Management</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-frame">
            <div className="hero-image-wrapper">
              <img 
                src={heroImage} 
                alt="AH Administrative Solutions Office Entry" 
                className="hero-image"
              />
              <div className="hero-image-badge">
                <span className="status-dot"></span>
                <span>Direct Client Operations</span>
              </div>
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
                <h3 style={{ fontSize: '0.85rem', fontWeight: 750, color: 'var(--brand-navy)', marginBottom: '0.35rem' }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--brand-muted)', lineHeight: 1.5 }}>
                  {c.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Pricing Section */}
        <section className="pricing-section">
          <div className="pricing-header">
            <div className="badge-pill" style={{ margin: '0 auto 1rem' }}>
              <span className="badge-highlight">TRANSPARENT ENGAGEMENT</span>
              <span>— No Hidden Overhead</span>
            </div>
            <h2 className="pricing-title">Simple, Structured Pricing Models</h2>
            <p className="pricing-subtitle">
              Predictable monthly retainers and scoped projects tailored to support high-growth operators.
            </p>
          </div>

          <div className="pricing-grid">
            {pricingTiers.map((tier, idx) => (
              <div 
                key={idx} 
                className={`pricing-card ${tier.popular ? 'pricing-card-popular' : ''}`}
              >
                {tier.popular && (
                  <div className="popular-ribbon">
                    <span>{tier.badge}</span>
                  </div>
                )}

                <div className="pricing-card-top">
                  <span className="tier-badge">{tier.badge}</span>
                  <h3 className="tier-name">{tier.name}</h3>
                  <p className="tier-desc">{tier.description}</p>
                  <div className="tier-price-wrapper">
                    <span className="tier-amount">{tier.price}</span>
                    <span className="tier-period">/ {tier.period}</span>
                  </div>
                </div>

                <ul className="tier-features">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="tier-feature-item">
                      <Check style={{ width: 15, height: 15, color: 'var(--brand-teal)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => navigateTo('intake')}
                  className={tier.popular ? 'btn-primary tier-btn' : 'btn-pill tier-btn'}
                >
                  {tier.cta}
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} AH Administrative Solutions. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck style={{ width: 14, height: 14, color: 'var(--brand-teal)' }} />
            <span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}