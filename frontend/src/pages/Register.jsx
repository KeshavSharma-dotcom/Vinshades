import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import NavBar from '../components/NavBar.jsx'
import '../assets/styles/Register.css'

export default function Register() {
    const navigate = useNavigate()
    const [step, setStep] = useState('EMAIL')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({ type: '', text: '' })

    useEffect(() => {
        /* Google OAuth initialization placeholder */
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: 'YOUR_GOOGLE_CLIENT_ID',
                callback: handleGoogleResponse
            })
            window.google.accounts.id.renderButton(
                document.getElementById('googleBtnWrapper'),
                { theme: 'dark', size: 'large', width: '100%' }
            )
        }
    }, [])

    const handleGoogleResponse = async (response) => {
        setLoading(true)
        setStatus({ type: '', text: '' })
        try {
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: response.credential })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Google Auth Failed')
            setStatus({ type: 'success', text: 'Authentication successful!' })
            setTimeout(() => navigate('/'), 1200)
        } catch (err) {
            setStatus({ type: 'error', text: err.message })
        } finally {
            setLoading(false)
        }
    }

    const handleRequestOtp = async (e) => {
        e.preventDefault()
        if (!email) return
        setLoading(true)
        setStatus({ type: '', text: '' })
        try {
            const res = await fetch('/api/otp/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, purpose: 'AUTH' })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Failed to send OTP')
            setStatus({ type: 'success', text: 'OTP sent to your email!' })
            setStep('OTP')
        } catch (err) {
            setStatus({ type: 'error', text: err.message })
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtpAndLogin = async (e) => {
        e.preventDefault()
        if (!otp) return
        setLoading(true)
        setStatus({ type: '', text: '' })
        try {
            const res = await fetch('/api/auth/otp-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, name })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Authentication failed')
            setStatus({ type: 'success', text: 'Logged in successfully!' })
            setTimeout(() => navigate('/'), 1200)
        } catch (err) {
            setStatus({ type: 'error', text: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-page">
            <NavBar />
            <div className="background-effects">
                <div className="gradient"></div>
                <div className="fog"></div>
                <div className="flames"></div>
                <div className="embers"></div>
            </div>

            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <h2 className="register-title">Join Vinshades</h2>
                        <p className="register-subtitle">Sign in or create an account to start playing</p>
                    </div>

                    {status.text && (
                        <div className={`status-badge status-${status.type}`}>
                            <span>{status.text}</span>
                        </div>
                    )}

                    {/* Direct Google Login */}
                    <div className="google-auth-box">
                        <div id="googleBtnWrapper" className="google-btn-container"></div>
                    </div>

                    <div className="auth-divider">
                        <span className="divider-line"></span>
                        <span className="divider-text">OR EMAIL</span>
                        <span className="divider-line"></span>
                    </div>

                    {/* Email / OTP Form Flow */}
                    {step === 'EMAIL' ? (
                        <form onSubmit={handleRequestOtp} className="auth-form">
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="enter your email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="submit-btn">
                                <span>{loading ? 'Sending OTP...' : 'Continue with OTP'}</span>
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtpAndLogin} className="auth-form">
                            <div className="form-group">
                                <label className="form-label">6-Digit OTP</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="form-input text-center"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Display Name (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Choose username..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="submit-btn">
                                <span>{loading ? 'Verifying...' : 'Verify & Sign In'}</span>
                            </button>
                            <button type="button" onClick={() => setStep('EMAIL')} className="back-btn">
                                <span>Use a different email</span>
                            </button>
                        </form>
                    )}

                    <div className="register-footer">
                        <p className="footer-text">Already have an account? <Link to="/login" className="footer-link">Login here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}