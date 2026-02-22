import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type EmployeeDashboardData = {
  employee_id: string
  next_paycheck: {
    gross_pay: number
    net_pay: number
    date: string
  }
  pto_balance: {
    vacation: number
    sick: number
    personal: number
  }
  bonus_pending: number
  budget_health: number
}

type PaycheckDetails = {
  earnings: {
    base_salary: number
    overtime: number
    bonuses: number
    gross_pay: number
  }
  deductions: {
    federal_tax: number
    state_tax: number
    social_security: number
    medicare: number
    health_insurance: number
    retirement_401k: number
    total_deductions: number
  }
  net_pay: number
}

type PTOSimulationResponse = {
  employee_id: string
  scenario: string
  days_taken: number
  pay_impact: number
  notes: string
}

type BudgetResponse = {
  employee_id: string
  net_pay: number
  budget_allocation: Record<string, number>
  total_allocated: number
  recommended_savings: number
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

const EMPLOYEE_ID = 'demo-employee-1'

export default function EmployeePortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ptoDays, setPtoDays] = useState(5)

  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch: refetchDashboard,
  } = useQuery<EmployeeDashboardData>({
    queryKey: ['employee-dashboard', EMPLOYEE_ID],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/api/v1/employee/dashboard/${EMPLOYEE_ID}`,
      )
      return res.data
    },
    enabled: isAuthenticated,
  })

  const {
    data: paycheck,
    isLoading: isPaycheckLoading,
    isError: isPaycheckError,
    refetch: refetchPaycheck,
  } = useQuery<PaycheckDetails>({
    queryKey: ['employee-paycheck', EMPLOYEE_ID],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/api/v1/employee/paycheck/${EMPLOYEE_ID}`,
      )
      return res.data
    },
    enabled: isAuthenticated,
  })

  const {
    data: ptoWhatIf,
    isLoading: isPtoSimLoading,
    isError: isPtoSimError,
    refetch: refetchPtoSim,
  } = useQuery<PTOSimulationResponse>({
    queryKey: ['employee-pto-sim', EMPLOYEE_ID, ptoDays],
    queryFn: async () => {
      const res = await axios.post(
        `${API_BASE}/api/v1/employee/pto-simulation`,
        null,
        {
          params: { employee_id: EMPLOYEE_ID, days_to_take: ptoDays },
        },
      )
      return res.data
    },
    enabled: isAuthenticated,
  })

  const {
    data: budget,
    isLoading: isBudgetLoading,
    isError: isBudgetError,
    refetch: refetchBudget,
  } = useQuery<BudgetResponse>({
    queryKey: ['employee-budget', EMPLOYEE_ID],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/api/v1/employee/budget/${EMPLOYEE_ID}`,
      )
      return res.data
    },
    enabled: isAuthenticated,
  })

  const handlePtoChange = (days: number) => {
    setPtoDays(days)
    setTimeout(() => refetchPtoSim(), 100)
  }

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Employee Portal - HackHERS</title>
        </Head>
        <div className="fintech-auth-page">
          <div className="fintech-auth-bg" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(5, 150, 105, 0.2), transparent)' }} />
          <div className="fintech-auth-grid" />
          <div className="fintech-auth-card">
            <h1 className="fintech-logo">
              Hack<span className="fintech-logo-accent green">HERS</span>
            </h1>
            <p className="fintech-auth-sub">Employee portal</p>
            <h2>Sign in to your account</h2>
            <form>
              <div className="fintech-form-group">
                <label>Work Email</label>
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
                className="fintech-auth-btn success"
              >
                Sign In
              </button>
            </form>
            <div className="fintech-auth-footer">
              Don't have an account?{' '}
              <Link href="/employee/signup" className="green">Create Employee Account</Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Employee Dashboard - HackHERS</title>
      </Head>
      <div className="fintech-app">
        <nav className="fintech-app-nav">
          <div className="fintech-app-nav-inner">
            <span className="fintech-app-logo success">
              Hack<span className="fintech-logo-accent">HERS</span>
            </span>
            <div className="fintech-app-links">
              <Link href="/employee/dashboard" className="success">
                Dashboard
              </Link>
              <Link href="/employee/paycheck">Paycheck</Link>
              <Link href="/employee/benefits">Benefits</Link>
              <Link href="/employee/budget">Budget</Link>
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
              <h2 className="fintech-page-title">Personal Finance Dashboard</h2>
              <p className="fintech-page-desc" style={{ marginBottom: 0 }}>
                AI-powered insights for your financial wellness
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                refetchDashboard()
                refetchPaycheck()
                refetchBudget()
                refetchPtoSim()
              }}
              className="fintech-reco-link"
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                border: '1px solid var(--fintech-border)',
                background: '#e0f2fe',
                fontSize: 12,
                whiteSpace: 'nowrap',
              }}
            >
              Refresh AI
            </button>
          </div>

          <div className="fintech-metrics">
            <div className="fintech-metric">
              <div className="fintech-metric-top">
                <span className="fintech-metric-label">Net Pay (Bi-weekly)</span>
                <div className="fintech-metric-emoji teal">💵</div>
              </div>
              {isDashboardLoading && (
                <div className="fintech-skeleton" style={{ height: 32, width: '70%' }} />
              )}
              {isDashboardError && (
                <p style={{ fontSize: 14, color: 'var(--fintech-danger)' }}>Failed to load</p>
              )}
              {dashboard && (
                <p className="fintech-metric-value">
                  ${dashboard.next_paycheck.net_pay.toLocaleString()}
                </p>
              )}
              <p className="fintech-metric-note">Take-home</p>
            </div>

            <div className="fintech-metric">
              <div className="fintech-metric-top">
                <span className="fintech-metric-label">PTO Balance</span>
                <div className="fintech-metric-emoji cyan">🏖️</div>
              </div>
              {dashboard && (
                <p className="fintech-metric-value">
                  {dashboard.pto_balance.vacation}
                  <span style={{ fontSize: '1rem', color: 'var(--fintech-text-muted)', marginLeft: 4 }}>days</span>
                </p>
              )}
              <p className="fintech-metric-note">Vacation</p>
            </div>

            <div className="fintech-metric">
              <div className="fintech-metric-top">
                <span className="fintech-metric-label">Bonus Pending</span>
                <div className="fintech-metric-emoji amber">🎁</div>
              </div>
              {dashboard && (
                <p className="fintech-metric-value">
                  ${dashboard.bonus_pending.toLocaleString()}
                </p>
              )}
              <p className="fintech-metric-note">Expected</p>
            </div>

            <div className="fintech-metric">
              <div className="fintech-metric-top">
                <span className="fintech-metric-label">Budget Health</span>
                <div className="fintech-metric-emoji indigo">📈</div>
              </div>
              {dashboard && (
                <>
                  <p className="fintech-metric-value" style={{ marginBottom: 8 }}>
                    {dashboard.budget_health}%
                  </p>
                  <div className="fintech-progress-wrap">
                    <div
                      className="fintech-progress-bar green"
                      style={{ width: `${dashboard.budget_health}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="fintech-card">
            <div className="fintech-card-header">
              <div className="fintech-card-icon green">📊</div>
              <div>
                <h3 className="fintech-card-title">Next Paycheck Preview</h3>
                <p className="fintech-card-sub">
                  {dashboard && `Due ${new Date(dashboard.next_paycheck.date).toLocaleDateString()}`}
                </p>
              </div>
            </div>

            {isPaycheckLoading && (
              <div className="fintech-split">
                <div>
                  <div className="fintech-skeleton" style={{ height: 16, width: '40%', marginBottom: 12 }} />
                  <div className="fintech-skeleton" style={{ height: 12, width: '100%', marginBottom: 8 }} />
                  <div className="fintech-skeleton" style={{ height: 12, width: '80%' }} />
                </div>
                <div>
                  <div className="fintech-skeleton" style={{ height: 16, width: '40%', marginBottom: 12 }} />
                  <div className="fintech-skeleton" style={{ height: 12, width: '100%', marginBottom: 8 }} />
                  <div className="fintech-skeleton" style={{ height: 12, width: '80%' }} />
                </div>
              </div>
            )}

            {isPaycheckError && (
              <div className="fintech-alert error">
                Failed to load paycheck details. Please try again.
              </div>
            )}

            {paycheck && (
              <div className="fintech-split">
                <div>
                  <h4>Earnings</h4>
                  <div className="fintech-split-row">
                    <span>Base Salary</span>
                    <span className="num">${paycheck.earnings.base_salary.toLocaleString()}</span>
                  </div>
                  <div className="fintech-split-row">
                    <span>Overtime</span>
                    <span className="num">${paycheck.earnings.overtime.toLocaleString()}</span>
                  </div>
                  <div className="fintech-split-row total">
                    <span>Gross Pay</span>
                    <span className="num">${paycheck.earnings.gross_pay.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <h4>Deductions</h4>
                  <div className="fintech-split-row">
                    <span>Federal Tax</span>
                    <span className="negative num">-${paycheck.deductions.federal_tax.toLocaleString()}</span>
                  </div>
                  <div className="fintech-split-row">
                    <span>Health Insurance</span>
                    <span className="negative num">-${paycheck.deductions.health_insurance.toLocaleString()}</span>
                  </div>
                  <div className="fintech-split-row">
                    <span>401(k)</span>
                    <span className="negative num">-${paycheck.deductions.retirement_401k.toLocaleString()}</span>
                  </div>
                  <div className="fintech-split-row total">
                    <span>Net Pay</span>
                    <span className="positive num">${paycheck.net_pay.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="fintech-card">
            <div className="fintech-card-header">
              <div className="fintech-card-icon purple">🔮</div>
              <div>
                <h3 className="fintech-card-title">What-If Simulator</h3>
                <p className="fintech-card-sub">See how PTO affects your paycheck</p>
              </div>
            </div>

            <label className="fintech-metric-label" style={{ display: 'block', marginBottom: 12 }}>
              Days of PTO to simulate
            </label>
            <div className="fintech-pills">
              {[1, 3, 5, 7, 10].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => handlePtoChange(days)}
                  className={`fintech-pill ${ptoDays === days ? 'active' : ''}`}
                >
                  {days} {days === 1 ? 'day' : 'days'}
                </button>
              ))}
            </div>

            {isPtoSimLoading && (
              <div className="fintech-skeleton" style={{ height: 80, borderRadius: 12 }} />
            )}

            {isPtoSimError && (
              <div className="fintech-alert error">
                Failed to run simulation. Please try again.
              </div>
            )}

            {ptoWhatIf && (
              <div
                className="fintech-card"
                style={{
                  borderColor: 'rgba(124, 58, 237, 0.3)',
                  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.06), rgba(168, 85, 247, 0.06)',
                }}
              >
                <h4 className="fintech-reco-title" style={{ marginBottom: 12 }}>{ptoWhatIf.scenario}</h4>
                <div className="fintech-card" style={{ marginBottom: 12, padding: 16 }}>
                  <p className="fintech-card-sub" style={{ marginBottom: 4 }}>Pay impact</p>
                  <p className="fintech-metric-value" style={{ color: 'var(--fintech-danger)' }}>
                    -${Math.abs(ptoWhatIf.pay_impact).toFixed(2)}
                  </p>
                </div>
                <p className="fintech-card-sub" style={{ margin: 0 }}>{ptoWhatIf.notes}</p>
              </div>
            )}
          </div>

          <div className="fintech-card">
            <div className="fintech-card-header">
              <div className="fintech-card-icon blue">💰</div>
              <div>
                <h3 className="fintech-card-title">Monthly Budget Plan</h3>
                <p className="fintech-card-sub">AI-recommended budget allocation</p>
              </div>
            </div>

            {isBudgetLoading && (
              <div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div className="fintech-skeleton" style={{ height: 14, width: '30%', marginBottom: 6 }} />
                    <div className="fintech-skeleton" style={{ height: 8, borderRadius: 999 }} />
                  </div>
                ))}
              </div>
            )}

            {isBudgetError && (
              <div className="fintech-alert error">
                Failed to load budget recommendation.
              </div>
            )}

            {budget && (
              <>
                {Object.entries(budget.budget_allocation).map(([category, amount]) => {
                  const percentage = Math.min((amount / budget.net_pay) * 100, 100)
                  return (
                    <div key={category} className="fintech-budget-row">
                      <div className="fintech-budget-row-head">
                        <span>{category.replace('_', ' ')}</span>
                        <span>${amount.toFixed(0)}</span>
                      </div>
                      <div className="fintech-budget-bar">
                        <div
                          className="fintech-budget-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
                <div className="fintech-budget-total">
                  <span className="label">Recommended Savings</span>
                  <span className="value">${budget.recommended_savings.toFixed(0)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
