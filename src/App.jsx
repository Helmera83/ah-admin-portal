import { useState, useEffect } from 'react';
import BrandLogo from './component/BrandLogo';
import AdminPortal from './component/AdminPortal';
import TrueFocus from './component/TrueFocus'
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
  ArrowRight,
  ArrowDown
} from 'lucide-react';

export default function App() {
  // Read path or query parameter on initial load
  const [view, setView] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    if (path.includes('intake') || params.get('view') === 'intake') return 'intake';
    if (path.includes('admin') || params.get('view') === 'admin') return 'admin';
    return 'landing';
  });

  const navigateTo = (newView) => {
    setView(newView);
    const searchParams = new URLSearchParams(window.location.search);

    if (newView === 'intake') {
      searchParams.set('view', 'intake');
      window.history.pushState({}, '', `?${searchParams.toString()}`);
    } else if (newView === 'admin') {
      searchParams.set('view', 'admin');
      window.history.pushState({}, '', `?${searchParams.toString()}`);
    } else {
      searchParams.delete('view');
      const queryString = searchParams.toString();
      window.history.pushState({}, '', queryString ? `?${queryString}` : '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContact = () => navigateTo('intake');

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
    <div className="app-body" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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

          {/* 2-Column Dark Hero */}
          <section className="hero-dark-section">
            <div className="container hero-dark-grid">
              {/* Left Column: Badge, Falling Headline, Description, Button */}
              <div className="hero-left-col">
                <div className="badge-pill hero-badge">
                  <span className="badge-highlight">AUDIT READY</span>
                  <span>— Administrative & Operational Clarity</span>
                </div>

                <h1 className="hero-title-focus">
                  <TrueFocus
                    sentence="Less noise, more focus"
                    manualMode={false}
                    focusStyle="box"
                    easing="spring"
                    order="sequential"
                    blurAmount={4}
                    focusScale={1.1}
                    unfocusedOpacity={0.4}
                    borderColor="#38bdf8"
                    cornerSize={14}
                    borderWidth={1.5}
                    animationDuration={0.55}
                    pauseBetweenAnimations={0.9}
                    highlightColor="#06b6d4"
                  />
                </h1>

                <p className="hero-desc">
                  Eliminate operational drag. AH Administrative Solutions manages your invoicing, maintains CRM accuracy, builds custom automations, and handles executive calendar coordination.
                </p>
                <div className="hero-actions">
                  <button
                    onClick={scrollToContact}
                    className="btn-primary hero-btn"
                  >
                    <Mail style={{ width: 16, height: 16 }} />
                    Get in Touch
                    <ArrowDown style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>

              {/* Right Column: Trust List Card */}
              <div className="hero-right-col">
                <div className="hero-trust-card">
                  <span className="hero-trust-header">OPERATIONAL GUARANTEES</span>

                  <div className="trust-list-v">
                    <div className="trust-item-card">
                      <div className="trust-icon-box">
                        <Check style={{ width: 16, height: 16, color: '#38bdf8' }} />
                      </div>
                      <div>
                        <strong>Invoicing & Bookkeeping Oversight</strong>
                        <span>Full-cycle accounts receivable and billing reconciliation</span>
                      </div>
                    </div>

                    <div className="trust-item-card">
                      <div className="trust-icon-box">
                        <Check style={{ width: 16, height: 16, color: '#38bdf8' }} />
                      </div>
                      <div>
                        <strong>CRM Administration & Custom Automations</strong>
                        <span>Clean pipelines, deduplication, and Zapier/Make webhooks</span>
                      </div>
                    </div>

                    <div className="trust-item-card">
                      <div className="trust-icon-box">
                        <Check style={{ width: 16, height: 16, color: '#38bdf8' }} />
                      </div>
                      <div>
                        <strong>Executive Calendar Management</strong>
                        <span>Time blocking, meeting defense, and client coordination</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

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

          {/* 4. High-Conversion Bottom CTA Banner with Hero Image Background */}
          <section className="cta-banner-section" aria-label="Book Discovery Call">
            <div
              className="cta-banner-card"
              style={{
                position: 'relative',
                backgroundImage: `linear-gradient(rgba(10, 25, 47, 0.88), rgba(10, 25, 47, 0.94)), url(${heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden',
              }}
            >
              <div className="cta-banner-content" style={{ position: 'relative', zIndex: 1 }}>
                <div className="badge-pill cta-badge">
                  <span className="badge-highlight">READY TO SCALE</span>
                  <span>— 100% Confidential Operational Audit</span>
                </div>

                <h2 style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.3rem)', color: '#ffffff', margin: '1rem 0' }}>
                  How much is your business losing to broken processes and back-office bottlenecks?
                </h2>

                <div className="cta-actions-row">
                  <button onClick={() => navigateTo('intake')} className="btn-primary cta-primary-btn">
                    <Mail style={{ width: 17, height: 17 }} />
                    <span>Optimize Your Workflow</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="cta-highlights" style={{ position: 'relative', zIndex: 1 }}>
                <div className="cta-highlight-item">
                  <div className="cta-highlight-icon">
                    <Check style={{ width: 14, height: 14, color: 'var(--brand-teal)' }} />
                  </div>
                  <div>
                    <strong>No Lengthy Lock-In</strong>
                    <span>Flexible monthly retainers and scoped projects</span>
                  </div>
                </div>

                <div className="cta-highlight-item">
                  <div className="cta-highlight-icon">
                    <Check style={{ width: 14, height: 14, color: 'var(--brand-teal)' }} />
                  </div>
                  <div>
                    <strong>Tailored Tech Stack</strong>
                    <span>Works with your existing software and spreadsheets</span>
                  </div>
                </div>

                <div className="cta-highlight-item">
                  <div className="cta-highlight-icon">
                    <Check style={{ width: 14, height: 14, color: 'var(--brand-teal)' }} />
                  </div>
                  <div>
                    <strong>Immediate Bandwidth</strong>
                    <span>Fast onboarding and turnaround on urgent priorities</span>
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
}