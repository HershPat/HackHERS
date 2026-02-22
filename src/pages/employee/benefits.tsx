import Head from 'next/head'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type BenefitsSummary = {
  employee_id: string
  health_insurance: {
    plan: string
    coverage: string
    monthly_cost: number
    deductible: number
    out_of_pocket_max: number
  }
  retirement_plan: {
    type: string
    employer_match: string
    employee_contribution: string
    current_balance: number
    annual_contribution: number
  }
  pto_balance: {
    vacation_days: number
    sick_days: number
    personal_days: number
  }
  bonuses: { type: string; amount: number; status: string; expected_date: string }[]
  other_benefits: { name: string; value: string }[]
}

type BonusesResponse = {
  employee_id: string
  bonuses: { type: string; amount: number; status: string; expected_date: string }[]
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

const EMPLOYEE_ID = 'demo-employee-1'

export default function EmployeeBenefitsPage() {
  const {
    data: benefits,
    isLoading: isBenefitsLoading,
    isError: isBenefitsError,
  } = useQuery<BenefitsSummary>({
    queryKey: ['employee-benefits', EMPLOYEE_ID],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/api/v1/employee/benefits/${EMPLOYEE_ID}`,
      )
      return res.data
    },
  })

  const {
    data: bonuses,
    isLoading: isBonusesLoading,
    isError: isBonusesError,
  } = useQuery<BonusesResponse>({
    queryKey: ['employee-bonuses', EMPLOYEE_ID],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/api/v1/employee/bonuses/${EMPLOYEE_ID}`,
      )
      return res.data
    },
  })

  return (
    <>
      <Head>
        <title>Benefits & PTO – HackHERS</title>
      </Head>
      <div className="fintech-app">
        <nav className="fintech-app-nav">
          <div className="fintech-app-nav-inner">
            <span className="fintech-app-logo success">
              Hack<span className="fintech-logo-accent">HERS</span>
            </span>
            <div className="fintech-app-links">
              <Link href="/employee/dashboard">Dashboard</Link>
              <Link href="/employee/paycheck">Paycheck</Link>
              <Link href="/employee/benefits" className="success">
                Benefits
              </Link>
              <Link href="/employee/budget">Budget</Link>
            </div>
          </div>
        </nav>

        <div className="fintech-container">
          <h2 className="fintech-page-title">Benefits & PTO</h2>
          <p className="fintech-page-desc">
            Understand your health coverage, retirement, and time off at a
            glance.
          </p>

          <div className="fintech-metrics">
            <div className="fintech-metric">
              <div className="fintech-metric-top">
                <span className="fintech-metric-label">Health Plan</span>
                <div className="fintech-metric-emoji blue">🩺</div>
              </div>
              {isBenefitsLoading && (
                <div
                  className="fintech-skeleton"
                  style={{ height: 24, width: '80%' }}
                />
              )}
              {isBenefitsError && (
                <p style={{ fontSize: 14, color: 'var(--fintech-danger)' }}>
                  Failed to load.
                </p>
              )}
              {benefits && (
                <>
                  <p className="fintech-metric-value">
                    ${benefits.health_insurance.monthly_cost.toLocaleString()}
                  </p>
                  <p className="fintech-metric-note">
                    {benefits.health_insurance.plan} ·{' '}
                    {benefits.health_insurance.coverage}
                  </p>
                </>
              )}
            </div>
            <div className="fintech-metric">
              <div className="fintech-metric-top">
                <span className="fintech-metric-label">Retirement Balance</span>
                <div className="fintech-metric-emoji teal">🏦</div>
              </div>
              {benefits && (
                <>
                  <p className="fintech-metric-value">
                    ${benefits.retirement_plan.current_balance.toLocaleString()}
                  </p>
                  <p className="fintech-metric-note">
                    Match: {benefits.retirement_plan.employer_match}
                  </p>
                </>
              )}
            </div>
            <div className="fintech-metric">
              <div className="fintech-metric-top">
                <span className="fintech-metric-label">PTO Balance</span>
                <div className="fintech-metric-emoji cyan">🏖️</div>
              </div>
              {benefits && (
                <>
                  <p className="fintech-metric-value">
                    {benefits.pto_balance.vacation_days}
                    <span
                      style={{
                        fontSize: '1rem',
                        color: 'var(--fintech-text-muted)',
                        marginLeft: 4,
                      }}
                    >
                      vacation days
                    </span>
                  </p>
                  <p className="fintech-metric-note">
                    + {benefits.pto_balance.sick_days} sick ·{' '}
                    {benefits.pto_balance.personal_days} personal
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="fintech-card">
            <div className="fintech-card-header">
              <div className="fintech-card-icon blue">🩺</div>
              <div>
                <h3 className="fintech-card-title">Health Insurance</h3>
                <p className="fintech-card-sub">
                  Key details about your medical coverage
                </p>
              </div>
            </div>
            {benefits && (
              <div>
                <div className="fintech-split-row">
                  <span>Plan</span>
                  <span>{benefits.health_insurance.plan}</span>
                </div>
                <div className="fintech-split-row">
                  <span>Coverage</span>
                  <span>{benefits.health_insurance.coverage}</span>
                </div>
                <div className="fintech-split-row">
                  <span>Monthly Cost</span>
                  <span className="num">
                    ${benefits.health_insurance.monthly_cost.toLocaleString()}
                  </span>
                </div>
                <div className="fintech-split-row">
                  <span>Deductible</span>
                  <span className="num">
                    ${benefits.health_insurance.deductible.toLocaleString()}
                  </span>
                </div>
                <div className="fintech-split-row">
                  <span>Out-of-Pocket Max</span>
                  <span className="num">
                    ${benefits.health_insurance.out_of_pocket_max.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="fintech-card">
            <div className="fintech-card-header">
              <div className="fintech-card-icon teal">🏦</div>
              <div>
                <h3 className="fintech-card-title">Retirement Plan</h3>
                <p className="fintech-card-sub">
                  Your long-term savings and employer match
                </p>
              </div>
            </div>
            {benefits && (
              <div>
                <div className="fintech-split-row">
                  <span>Plan Type</span>
                  <span>{benefits.retirement_plan.type}</span>
                </div>
                <div className="fintech-split-row">
                  <span>Employer Match</span>
                  <span>{benefits.retirement_plan.employer_match}</span>
                </div>
                <div className="fintech-split-row">
                  <span>Your Contribution</span>
                  <span>{benefits.retirement_plan.employee_contribution}</span>
                </div>
                <div className="fintech-split-row">
                  <span>Current Balance</span>
                  <span className="num">
                    ${benefits.retirement_plan.current_balance.toLocaleString()}
                  </span>
                </div>
                <div className="fintech-split-row">
                  <span>Annual Contribution</span>
                  <span className="num">
                    ${benefits.retirement_plan.annual_contribution.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="fintech-card">
            <div className="fintech-card-header">
              <div className="fintech-card-icon amber">🎁</div>
              <div>
                <h3 className="fintech-card-title">Bonuses & Perks</h3>
                <p className="fintech-card-sub">
                  Upcoming bonuses and other benefits
                </p>
              </div>
            </div>

            {isBonusesLoading && (
              <div>
                <div
                  className="fintech-skeleton"
                  style={{ height: 40, marginBottom: 8 }}
                />
                <div
                  className="fintech-skeleton"
                  style={{ height: 40, marginBottom: 8 }}
                />
              </div>
            )}

            {isBonusesError && (
              <div className="fintech-alert error">
                Failed to load bonuses.
              </div>
            )}

            {bonuses && (
              <div className="fintech-table-wrap">
                <table className="fintech-table">
                  <thead>
                    <tr>
                      <th>Bonus</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Expected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bonuses.bonuses.map((b) => (
                      <tr key={b.type}>
                        <td>{b.type}</td>
                        <td className="num">${b.amount.toLocaleString()}</td>
                        <td>
                          <span
                            className={`fintech-badge ${
                              b.status === 'approved' ? 'done' : 'pending'
                            }`}
                          >
                            {b.status.charAt(0).toUpperCase() +
                              b.status.slice(1)}
                          </span>
                        </td>
                        <td style={{ color: 'var(--fintech-text-muted)' }}>
                          {b.expected_date}
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

