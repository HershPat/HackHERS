import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'

export default function EmployerSignup() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/employer/login')
    }, 600)
  }

  return (
    <>
      <Head>
        <title>Create Company Account - HackHERS</title>
      </Head>
      <div className="fintech-auth-page">
        <div className="fintech-auth-bg" />
        <div className="fintech-auth-grid" />
        <div className="fintech-auth-card">
          <h1 className="fintech-logo">
            Hack<span className="fintech-logo-accent">HERS</span>
          </h1>
          <p className="fintech-auth-sub">Create company account</p>
          <h2>Create Company Account</h2>
          <p className="fintech-card-sub" style={{ marginBottom: 24 }}>
            Set up an employer profile so our AI can forecast payroll and cash flow.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="fintech-form-group">
              <label>Company Name</label>
              <input
                type="text"
                required
                className="fintech-auth-input"
                placeholder="Acme Inc."
              />
            </div>
            <div className="fintech-form-group">
              <label>Work Email</label>
              <input
                type="email"
                required
                className="fintech-auth-input"
                placeholder="you@company.com"
              />
            </div>
            <div className="fintech-form-row-2">
              <div className="fintech-form-group">
                <label>Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="fintech-auth-input"
                  placeholder="••••••••"
                />
              </div>
              <div className="fintech-form-group">
                <label>Confirm</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="fintech-auth-input"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="fintech-form-group">
              <label>Company Size</label>
              <select className="fintech-auth-input" defaultValue="10-50">
                <option value="1-10">1–10 employees</option>
                <option value="10-50">10–50 employees</option>
                <option value="50-200">50–200 employees</option>
                <option value="200+">200+ employees</option>
              </select>
            </div>
            {error && (
              <p className="fintech-alert error" style={{ marginBottom: 16 }} role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="fintech-auth-btn primary"
            >
              {isSubmitting ? 'Creating account…' : 'Create Company Account'}
            </button>
          </form>

          <div className="fintech-auth-footer" style={{ marginTop: 24 }}>
            Already have an account? <Link href="/employer/login">Back to sign in</Link>
          </div>
        </div>
      </div>
    </>
  )
}
