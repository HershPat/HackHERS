import Head from 'next/head'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

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

export default function EmployeeBudgetPage() {
  const {
    data: budget,
    isLoading: isBudgetLoading,
    isError: isBudgetError,
    refetch: refetchBudget,
  } = useQuery<BudgetResponse>({
    queryKey: ['employee-budget', 'page', EMPLOYEE_ID],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/api/v1/employee/budget/${EMPLOYEE_ID}`,
      )
      return res.data
    },
  })

  return (
    <>
      <Head>
        <title>Budget – HackHERS</title>
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
              <Link href="/employee/benefits">Benefits</Link>
              <Link href="/employee/budget" className="success">
                Budget
              </Link>
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
              <h2 className="fintech-page-title">Monthly Budget</h2>
              <p className="fintech-page-desc" style={{ marginBottom: 0 }}>
                How your net pay is allocated across categories.
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetchBudget()}
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
              Recalculate
            </button>
          </div>

          <div className="fintech-card">
            <div className="fintech-card-header">
              <div className="fintech-card-icon blue">💰</div>
              <div>
                <h3 className="fintech-card-title">Budget Plan</h3>
                <p className="fintech-card-sub">
                  Based on your net pay and standard ratios
                </p>
              </div>
            </div>

            {isBudgetLoading && (
              <div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div
                      className="fintech-skeleton"
                      style={{ height: 14, width: '30%', marginBottom: 6 }}
                    />
                    <div
                      className="fintech-skeleton"
                      style={{ height: 8, borderRadius: 999 }}
                    />
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
                {Object.entries(budget.budget_allocation).map(
                  ([category, amount]) => {
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
                  },
                )}
                <div className="fintech-budget-total">
                  <span className="label">Recommended Savings</span>
                  <span className="value">
                    ${budget.recommended_savings.toFixed(0)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

