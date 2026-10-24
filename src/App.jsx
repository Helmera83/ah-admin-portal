import { useState } from 'react';
import BrandLogo from './components/BrandLogo';
import LeadForm from './components/LeadForm';
import AdminPortal from './components/AdminPortal';
import FallingText from './components/FallingText';
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
  X
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState('landing');
  const [isContactOpen, setIsContactOpen] = useState(false);

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

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="container header-inner">
          <button onClick={() => setView('landing')} className="brand-wrapper" aria-label="Home">
            <BrandLogo size={36} />
          </button>

          <nav className="nav-actions" aria-label="Main Navigation">
            {view === 'landing' ? (
              <>
                <button onClick={() => setIsContactOpen(true)} className="btn-primary">
                  <Mail style={{ width: 14, height: 14, flexShrink: 0 }} />
                  <span>Contact Us</span>
                </button>
                <button onClick={() => setView('admin')} className="btn-pill" title="Private Operator Access">
                  <Lock style={{ width: 12, height: 12, flexShrink: 0 }} />
                  <span>Admin</span>
                </button>
              </>
            ) : (
              <button onClick={() => setView('landing')} className="btn-pill">
                <Globe style={{ width: 12, height: 12, flexShrink: 0 }} />
                <span>Public Site</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main View Router */}
      {view === 'admin' ? (
        <AdminPortal />
      ) : (
        <main className="container">
          {/* 1. Hero Section */}
          <section className="hero-split">
            <div className="hero-copy">
              <div className="badge-pill">
                <span className="badge-highlight">Administrative & Operational Clarity</span>
              </div>

              <h1>
                Turn Chaotic Administrative Tasks into Seamless Automated Systems
              </h1>

              <p className="hero-desc">
                Eliminate manual data entry, streamline client onboarding, and keep your books balanced with structured operational management built to scale.
              </p>

              <div className="hero-actions">
                <button onClick={() => setIsContactOpen(true)} className="btn-primary hero-btn">
                  <Mail style={{ width: 16, height: 16 }} />
                  <span>Get in Touch</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>

              <div className="trust-list">
                <div className="trust-item">
                  <Check style={{ width: 16, height: 16, color: 'var(--brand-teal)', flexShrink: 0 }} />
                  <span>Invoicing & Bookkeeping Oversight</span>
                </div>
                <div className="trust-item">
                  <Check style={{ width: 16, height: 16, color: 'var(--brand-teal)', flexShrink: 0 }} />
                  <span>CRM Administration & Custom Automations</span>
                </div>
                <div className="trust-item">
                  <Check style={{ width: 16, height: 16, color: 'var(--brand-teal)', flexShrink: 0 }} />
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
                  loading="eager"
                />
                <div className="hero-image-badge">
                  <span className="status-dot"></span>
                  <span>Direct Client Operations</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Capabilities Grid */}
          <section className="capabilities-grid" aria-label="Services and Capabilities">
            {capabilities.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="capability-card">
                  <Icon style={{ width: 22, height: 22, color: 'var(--brand-teal)', marginBottom: '0.75rem' }} />
                  <h3 style={{ fontSize: '0.88rem', fontWeight: 750, color: 'var(--brand-navy)', marginBottom: '0.35rem' }}>
                    {c.title}
                  </h3>
                  <p style={{ fontSize: '0.76rem', color: 'var(--brand-muted)', lineHeight: 1.55 }}>
                    {c.description}
                  </p>
                </div>
              );
            })}
          </section>

          {/* 3. Pricing Section */}
          <section className="pricing-section" aria-label="Pricing Packages">
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
                    onClick={() => setIsContactOpen(true)}
                    className={tier.popular ? 'btn-primary tier-btn' : 'btn-pill tier-btn'}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight style={{ width: 14, height: 14, flexShrink: 0 }} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 4. High-Conversion Bottom CTA Banner with Interactive Falling Heading */}
          <section className="cta-banner-section" aria-label="Book Discovery Call">
            <div className="cta-banner-card">
              <div className="cta-banner-content">
                <div className="badge-pill cta-badge">
                  <span className="badge-highlight">READY TO SCALE</span>
                  <span>— 100% Confidential Operational Audit</span>
                </div>

                {/* Physics Falling Headline */}
                <div className="cta-falling-wrap">
                  <FallingText
                    text="Stop letting back-office bottlenecks stall your growth."
                    highlightWords={['bottlenecks', 'growth.']}
                    highlightClass="cta-accent-word"
                    trigger="hover"
                    variant="text"
                    split="words"
                    order="random"
                    theme="dark"
                    accentColor="#38bdf8"
                    gravity={1.1}
                    bounciness={0.3}
                    scatter={0.6}
                    stagger={0.025}
                    restoreDelay={3.5}
                    draggable={true}
                    fontSize="clamp(1.5rem, 3.2vw, 2.3rem)"
                    className="cta-falling-box"
                  />
                </div>

                <div className="cta-actions-row">
                  <button onClick={() => setIsContactOpen(true)} className="btn-primary cta-primary-btn">
                    <Mail style={{ width: 17, height: 17 }} />
                    <span>Optimize Your Workflow</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="cta-highlights">
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
        </main>
      )}

      {/* Modal Contact Sheet */}
      {isContactOpen && (
        <div className="modal-overlay" onClick={() => setIsContactOpen(false)} role="dialog" aria-modal="true">
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsContactOpen(false)} className="btn-pill modal-close-btn" aria-label="Close modal">
              <X style={{ width: 14, height: 14 }} />
              <span>Close</span>
            </button>
            <div className="modal-content-scroll">
              <LeadForm onSuccessClose={() => setIsContactOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} AH Administrative Solutions. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <ShieldCheck style={{ width: 14, height: 14, color: 'var(--brand-teal)', flexShrink: 0 }} />
            <span>Supabase Ingestion Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}