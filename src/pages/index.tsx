import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>HackHERS — AI Payroll & Finance</title>
        <meta name="description" content="Autonomous AI for payroll and financial management. Predictive intelligence for employers. Financial clarity for employees." />
      </Head>

      <div className="fintech-hero">
        <div className="fintech-hero-bg" />
        <div className="fintech-hero-grid" />

        <nav className="fintech-nav">
          <span className="fintech-logo">
            Hack<span className="fintech-logo-accent">HERS</span>
          </span>
          <div className="fintech-nav-links">
            <Link href="/employer/login">For employers</Link>
            <Link href="/employee/login">For employees</Link>
            <Link href="/employer/login" className="fintech-nav-cta">Sign in</Link>
          </div>
        </nav>

        <main className="fintech-hero-inner">
          <p className="fintech-hero-badge">Autonomous AI Payroll & Finance</p>
          <h1 className="fintech-hero-title">
            Finance that runs
            <br />
            <span className="fintech-hero-gradient">itself.</span>
          </h1>
          <p className="fintech-hero-desc">
            Predictive cash flow and CFO-level insights for employers. Pay clarity, PTO sims, and budgeting for employees — all in one place.
          </p>
          <div className="fintech-hero-btns">
            <Link href="/employer/login" className="fintech-btn-primary">
              Employer portal →
            </Link>
            <Link href="/employee/login" className="fintech-btn-secondary">
              Employee portal
            </Link>
          </div>

          <div className="fintech-cards">
            <div className="fintech-feature-card">
              <div className="fintech-feature-icon employer">👔</div>
              <h3>For employers</h3>
              <ul>
                <li>Predictive cash flow</li>
                <li>CFO-style recommendations</li>
                <li>Payroll timing & liquidity</li>
              </ul>
            </div>
            <div className="fintech-feature-card employee">
              <div className="fintech-feature-icon employee">👩‍💼</div>
              <h3>For employees</h3>
              <ul>
                <li>Paycheck breakdown</li>
                <li>PTO & benefits + what‑if</li>
                <li>Personal budget plan</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
