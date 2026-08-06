import React, { useState } from 'react'

export const AuthModal = ({
  showAuthModal,
  setShowAuthModal,
  authMode,
  setAuthMode,
  handleAuthSubmit,
  authName,
  setAuthName,
  authEmail,
  setAuthEmail,
  authPhone,
  setAuthPhone,
  authPassword,
  setAuthPassword,
  authError,
  setAuthError,
  authLoading
}) => {
  const [showPassword, setShowPassword] = useState(false)

  if (!showAuthModal) return null

  const switchMode = (mode) => {
    setAuthMode(mode)
    if (setAuthError) setAuthError('')
  }

  return (
    <div className="auth-popup-overlay">
      <div className="auth-popup-modal">
        <button className="auth-close-btn" onClick={() => { setShowAuthModal(false); if (setAuthError) setAuthError(''); }} aria-label="Close auth popup">×</button>
        <h2 className="auth-title">{authMode === 'login' ? 'Login to Avantika' : 'Create Account'}</h2>
        <p className="auth-subtitle-text">
          {authMode === 'login'
            ? 'Enter your credentials to access your profile.'
            : 'Sign up to unlock premium features and order tracking.'}
        </p>

        {authError && (
          <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', marginBottom: '14px', textAlign: 'center' }}>
            {authError}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="auth-form">
          {authMode === 'signup' && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <div className="phone-input-wrapper">
              <span className="phone-prefix">+91</span>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={authPhone}
                onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password..."
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
                style={{ width: '100%', paddingRight: '45px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '700',
                  outline: 'none',
                  textTransform: 'uppercase',
                  userSelect: 'none'
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={authLoading}>
            {authLoading ? 'Verifying...' : (authMode === 'login' ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-toggle-prompt">
          {authMode === 'login' ? (
            <p>Don't have an account? <span className="auth-toggle-link" onClick={() => switchMode('signup')}>Sign Up</span></p>
          ) : (
            <p>Already have an account? <span className="auth-toggle-link" onClick={() => switchMode('login')}>Login</span></p>
          )}
        </div>
      </div>
    </div>
  )
}
export default AuthModal

