import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type EmployerDashboardData = {
  company_id: string
  cash_flow_summary: {
    predicted_30day_average: number
    monthly_payroll: number
    liquidity_score: number
  }
  recommendations_count: number
  payroll_status: string
  last_updated: string
}

type PayrollRun = {
  period: string
  amount: number
  status: string
  due_date: string
}

type PayrollScheduleResponse = {
  company_id: string
  payroll_runs: PayrollRun[]
}

type CFORecommendation = {
  title: string
  description: string
  estimated_impact: number
  implementation_difficulty: string
  priority: number
  reasoning: string
  next_steps: string[]
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

const COMPANY_ID = 'demo-company-1'

export default function EmployerPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch: refetchDashboard,
  } = useQuery<EmployerDashboardData>({
    queryKey: ['employer-dashboard', COMPANY_ID],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/api/v1/employer/dashboard/${COMPANY_ID}`,
      )
      return res.data
    },
    enabled: isAuthenticated,
  })

  const {
    data: payrollSchedule,
    isLoading: isPayrollLoading,
    isError: isPayrollError,
    refetch: refetchPayroll,
  } = useQuery<PayrollScheduleResponse>({
    queryKey: ['employer-payroll-schedule', COMPANY_ID],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/api/v1/employer/payroll/schedule/${COMPANY_ID}`,
      )
      return res.data
    },
    enabled: isAuthenticated,
  })

  const {
    data: cfoRecs,
    isLoading: isRecsLoading,
    isError: isRecsError,
    refetch: refetchRecs,
  } = useQuery<{ recommendations: CFORecommendation[] }>({
    queryKey: ['employer-cfo-recommendations', COMPANY_ID],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/api/v1/employer/cfo-recommendations/${COMPANY_ID}`,
      )
      return res.data
    },
    enabled: isAuthenticated,
  })

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Employer Portal - HackHERS</title>
        </Head>
        <div className="fintech-auth-page">
          <div className="fintech-auth-bg" />
          <div className="fintech-auth-grid" />
          <div className="fintech-auth-card">
            <h1 className="fintech-logo">
              Hack<span className="fintech-logo-accent">HERS</span>
            </h1>
            <p className="fintech-auth-sub">Employer portal</p>
            <h2>Sign in to your account</h2>
            <form>
              <div className="fintech-form-group">
                <label>Company Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="fintech-auth-input"
                />
              </div>
              <div className="fintech-form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="fintech-auth-input"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsAuthenticated(true)}
                className="fintech-auth-btn primary"
              >
                Sign In
              </button>
            </form>
            <div className="fintech-auth-footer">
              Don't have an account?{' '}
              <Link href="/employer/signup">Create Company Account</Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Employer Dashboard - HackHERS</title>
      </Head>
      <div className="fintech-app">
        <nav className="fintech-app-nav">
          <div className="fintech-app-nav-inner">
            <span className="fintech-app-logo primary">
              Hack<span className="fintech-logo-accent">HERS</span>
            </span>
            <div className="fintech-app-links">
              <Link href="/employer/dashboard">Dashboard</Link>
              <Link href="/employer/payroll">Payroll</Link>
              <Link href="/employer/analytics">Analytics</Link>
              <button
                type="button"
                onClick={() => setIsAuthenticated(false)}
                className="fintech-app-logout"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="fintech-container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div>
              <h2 className="fintech-page-title">Executive Dashboard</h2>
              <p className="fintech-page-desc" style={{ marginBottom: 0 }}>
                AI-powered insights for your financial operations
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                refetchDashboard()
                refetchRecs()
                refetchPayroll()
              }}
              className="fintech-reco-link"
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                border: '1px solid var(--fintech-border)',
                background: '#eef2ff',
                fontSize: 12,
                whiteSpace: 'nowrap',
              }}
            >
              Run AI update
            </button>
          </div>

          {isDashboardLoading && (
            <div className="fintech-metrics">
              {[1, 2, 3].map((i) => (
                <div key={i} className="fintech-metric">
                  <div className="fintech-skeleton" style={{ height: 14, width: '60%', marginBottom: 16 }} />
                  <div className="fintech-skeleton" style={{ height: 32, width: '80%', marginBottom: 8 }} />
                  <div className="fintech-skeleton" style={{ height: 12, width: '40%' }} />
                </div>
              ))}
            </div>
          )}

          {isDashboardError && (
            <div className="fintech-alert error">
              Unable to load dashboard data. Please check your API connection.
            </div>
          )}

          {dashboard && (
            <div className="fintech-metrics">
              <div className="fintech-metric">
                <div className="fintech-metric-top">
                  <span className="fintech-metric-label">Predicted Cash Flow</span>
                  <div className="fintech-metric-emoji teal">💰</div>
                </div>
                <p className="fintech-metric-value">
                  ${dashboard.cash_flow_summary.predicted_30day_average.toLocaleString()}
                </p>
                <p className="fintech-metric-note">Next 30 days average</p>
              </div>
              <div className="fintech-metric">
                <div className="fintech-metric-top">
                  <span className="fintech-metric-label">Monthly Payroll</span>
                  <div className="fintech-metric-emoji blue">💼</div>
                </div>
                <p className="fintech-metric-value">
                  ${dashboard.cash_flow_summary.monthly_payroll.toLocaleString()}
                </p>
                <p className="fintech-metric-note">{dashboard.payroll_status}</p>
              </div>
              <div className="fintech-metric">
                <div className="fintech-metric-top">
                  <span className="fintech-metric-label">Liquidity Score</span>
                  <div className="fintech-metric-emoji cyan">📊</div>
                </div>
                <p className="fintech-metric-value">
                  {dashboard.cash_flow_summary.liquidity_score}
                  <span style={{ fontSize: '1rem', color: 'var(--fintech-text-muted)', marginLeft: 4 }}>/10</span>
                </p>
                <div className="fintech-progress-wrap">
                  <div
                    className="fintech-progress-bar"
                    style={{ width: `${dashboard.cash_flow_summary.liquidity_score * 10}%` }}
                  />
                </div>
                <p className="fintech-metric-note">AI evaluated</p>
              </div>
            </div>
          )}

          <div className="fintech-card">
            <div className="fintech-card-header">
              <div className="fintech-card-icon blue">🤖</div>
              <div>
                <h3 className="fintech-card-title">CFO AI Recommendations</h3>
                <p className="fintech-card-sub">Strategic insights powered by AI analysis</p>
              </div>
            </div>

            {isRecsLoading && (
              <div className="fintech-reco-list">
                {[1, 2].map((i) => (
                  <div key={i} className="fintech-reco-item medium">
                    <div className="fintech-skeleton" style={{ height: 16, width: '40%', marginBottom: 8 }} />
                    <div className="fintech-skeleton" style={{ height: 12, width: '100%', marginBottom: 4 }} />
                    <div className="fintech-skeleton" style={{ height: 12, width: '70%' }} />
                  </div>
                ))}
              </div>
            )}

            {isRecsError && (
              <div className="fintech-alert error">
                Unable to load AI recommendations. Please try again later.
              </div>
            )}

            <div className="fintech-reco-list">
              {cfoRecs?.recommendations?.map((rec, idx) => (
                <div
                  key={rec.title + idx}
                  className={`fintech-reco-item ${rec.priority >= 3 ? 'high' : 'medium'}`}
                >
                  <div className="fintech-reco-head">
                    <h4 className="fintech-reco-title">{rec.title}</h4>
                    <span className={`fintech-reco-badge ${rec.priority >= 3 ? 'high' : 'medium'}`}>
                      {rec.priority >= 3 ? 'High' : 'Medium'}
                    </span>
                  </div>
                  <p className="fintech-reco-desc">{rec.description}</p>
                  <div className="fintech-reco-meta">
                    <span>
                      <strong>Impact:</strong> {rec.estimated_impact > 0 ? '+' : ''}$
                      {Math.abs(rec.estimated_impact).toLocaleString()}
                    </span>
                    <span>{rec.implementation_difficulty}</span>
                    <button type="button" className="fintech-reco-link">View Details →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="fintech-card">
            <h3 className="fintech-card-title" style={{ marginBottom: 24 }}>Payroll Management</h3>

            {isPayrollLoading && (
              <div>
                <div className="fintech-skeleton" style={{ height: 48, marginBottom: 8 }} />
                <div className="fintech-skeleton" style={{ height: 48, marginBottom: 8 }} />
                <div className="fintech-skeleton" style={{ height: 48 }} />
              </div>
            )}

            {isPayrollError && (
              <div className="fintech-alert error">
                Unable to load payroll schedule. Please check your connection.
              </div>
            )}

            {payrollSchedule && (
              <div className="fintech-table-wrap">
                <table className="fintech-table">
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollSchedule.payroll_runs.map((run) => (
                      <tr key={run.period}>
                        <td style={{ fontWeight: 500 }}>{run.period}</td>
                        <td className="num">${run.amount.toLocaleString()}</td>
                        <td>
                          <span className={`fintech-badge ${run.status === 'pending' ? 'pending' : 'done'}`}>
                            {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                          </span>
                        </td>
                        <td style={{ color: 'var(--fintech-text-muted)' }}>
                          {new Date(run.due_date).toLocaleDateString()}
                        </td>
                        <td>
                          <button type="button" className="fintech-table-link">Review →</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
