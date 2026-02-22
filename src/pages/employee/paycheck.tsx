import Head from 'next/head'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type EmployeeDashboardData = {
  employee_id: string
  next_paycheck: {
    gross_pay: number
    net_pay: number
    date: string
  }
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

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

const EMPLOYEE_ID = 'demo-employee-1'

export default function EmployeePaycheckPage() {
  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
  } = useQuery<EmployeeDashboardData>({
    queryKey: ['employee-dashboard', 'paycheck', EMPLOYEE_ID],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/api/v1/employee/dashboard/${EMPLOYEE_ID}`,
      )
      return res.data
    },
  })

  const {
    data: paycheck,
    isLoading: isPaycheckLoading,
    isError: isPaycheckError,
  } = useQuery<PaycheckDetails>({
    queryKey: ['employee-paycheck', 'page', EMPLOYEE_ID],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/api/v1/employee/paycheck/${EMPLOYEE_ID}`,
      )
      return res.data
    },
  })

  return (
    <>
      <Head>
        <title>Paycheck – HackHERS</title>
      </Head>
      <div className="fintech-app">
        <nav className="fintech-app-nav">
          <div className="fintech-app-nav-inner">
            <span className="fintech-app-logo success">
              Hack<span className="fintech-logo-accent">HERS</span>
            </span>
            <div className="fintech-app-links">
              <Link href="/employee/dashboard">Dashboard</Link>
              <Link href="/employee/paycheck" className="success">
                Paycheck
              </Link>
              <Link href="/employee/benefits">Benefits</Link>
              <Link href="/employee/budget">Budget</Link>
            </div>
          </div>
        </nav>

        <div className="fintech-container">
          <h2 className="fintech-page-title">Your Paycheck</h2>
          <p className="fintech-page-desc">
            See how your earnings and deductions roll up to your net pay.
          </p>

          <div className="fintech-metrics">
            <div className="fintech-metric">
              <div className="fintech-metric-top">
                <span className="fintech-metric-label">Net Pay</span>
                <div className="fintech-metric-emoji teal">💵</div>
              </div>
              {isDashboardLoading && (
                <div
                  className="fintech-skeleton"
                  style={{ height: 32, width: '70%' }}
                />
              )}
              {isDashboardError && (
                <p style={{ fontSize: 14, color: 'var(--fintech-danger)' }}>
                  Failed to load.
                </p>
              )}
              {dashboard && (
                <p className="fintech-metric-value">
                  ${dashboard.next_paycheck.net_pay.toLocaleString()}
                </p>
              )}
              <p className="fintech-metric-note">
                Next deposit:{' '}
                {dashboard &&
                  new Date(
                    dashboard.next_paycheck.date,
                  ).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="fintech-card">
            <div className="fintech-card-header">
              <div className="fintech-card-icon green">📊</div>
              <div>
                <h3 className="fintech-card-title">Paycheck Breakdown</h3>
                <p className="fintech-card-sub">
                  Earnings vs. taxes, benefits, and savings
                </p>
              </div>
            </div>

            {isPaycheckLoading && (
              <div className="fintech-split">
                <div>
                  <div
                    className="fintech-skeleton"
                    style={{
                      height: 16,
                      width: '40%',
                      marginBottom: 12,
                    }}
                  />
                  <div
                    className="fintech-skeleton"
                    style={{ height: 12, width: '100%', marginBottom: 8 }}
                  />
                  <div
                    className="fintech-skeleton"
                    style={{ height: 12, width: '80%' }}
                  />
                </div>
                <div>
                  <div
                    className="fintech-skeleton"
                    style={{
                      height: 16,
                      width: '40%',
                      marginBottom: 12,
                    }}
                  />
                  <div
                    className="fintech-skeleton"
                    style={{ height: 12, width: '100%', marginBottom: 8 }}
                  />
                  <div
                    className="fintech-skeleton"
                    style={{ height: 12, width: '80%' }}
                  />
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
                    <span className="num">
                      ${paycheck.earnings.base_salary.toLocaleString()}
                    </span>
                  </div>
                  <div className="fintech-split-row">
                    <span>Overtime</span>
                    <span className="num">
                      ${paycheck.earnings.overtime.toLocaleString()}
                    </span>
                  </div>
                  <div className="fintech-split-row">
                    <span>Bonuses</span>
                    <span className="num">
                      ${paycheck.earnings.bonuses.toLocaleString()}
                    </span>
                  </div>
                  <div className="fintech-split-row total">
                    <span>Gross Pay</span>
                    <span className="num">
                      ${paycheck.earnings.gross_pay.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <h4>Deductions</h4>
                  <div className="fintech-split-row">
                    <span>Federal Tax</span>
                    <span className="negative num">
                      -${paycheck.deductions.federal_tax.toLocaleString()}
                    </span>
                  </div>
                  <div className="fintech-split-row">
                    <span>State Tax</span>
                    <span className="negative num">
                      -${paycheck.deductions.state_tax.toLocaleString()}
                    </span>
                  </div>
                  <div className="fintech-split-row">
                    <span>Health Insurance</span>
                    <span className="negative num">
                      -${paycheck.deductions.health_insurance.toLocaleString()}
                    </span>
                  </div>
                  <div className="fintech-split-row">
                    <span>401(k)</span>
                    <span className="negative num">
                      -${paycheck.deductions.retirement_401k.toLocaleString()}
                    </span>
                  </div>
                  <div className="fintech-split-row total">
                    <span>Net Pay</span>
                    <span className="positive num">
                      ${paycheck.net_pay.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

