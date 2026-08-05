import React, { useState } from 'react';
import { FiMail, FiLock, FiCheckCircle, FiShield, FiArrowLeft } from 'react-icons/fi';

export default function ForgotPasswordPage({ currentEmail, onPasswordUpdate, onBackToLogin, showNotification }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [emailInput, setEmailInput] = useState(currentEmail || '');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password validation regex: Minimum 1 uppercase letter, 1 number, 1 special character
  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar;
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const enteredEmail = emailInput.trim().toLowerCase();
    const targetEmail = currentEmail.trim().toLowerCase();

    if (enteredEmail !== targetEmail) {
      showNotification("Email address does not match admin records!", "warning");
      return;
    }

    // Generate a 4 digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setStep(2);
    
    // Simulate sending OTP by displaying it in an alert/notification
    showNotification(`OTP Sent! Your temporary 4-digit code is: ${code}`, "info");
    alert(`🔑 Temporary OTP Code: ${code}`);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      setStep(3);
      showNotification("OTP Verified! Please set your new password.", "success");
    } else {
      showNotification("Invalid OTP code! Please try again.", "warning");
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      showNotification("Password must contain 1 uppercase letter, 1 number, and 1 special character (e.g. Aman@123)!", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification("New Password and Confirm Password do not match!", "warning");
      return;
    }

    // Update password
    onPasswordUpdate(newPassword);
    showNotification("Password updated successfully! Please sign in with your new password.", "success");
    onBackToLogin();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', padding: '20px' }}>
      <div className="login-card" style={{ width: '400px', background: 'var(--bg-card)', padding: '32px', borderRadius: '24px', boxShadow: 'var(--card-shadow)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>🔒 Password Recovery</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {step === 1 && "Enter your email address to receive a 4-digit verification code."}
            {step === 2 && "A temporary 4-digit verification OTP code has been generated."}
            {step === 3 && "Create a secure password with numbers, uppercase letters, and symbols."}
          </span>
        </div>

        {/* Step 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>Admin Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="email" 
                  required 
                  placeholder="admin@avantikapremiumbites.com" 
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-yellow" style={{ width: '100%', marginTop: '10px' }}>
              Send OTP Code
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>Enter 4-Digit OTP Code</label>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '10px 0' }}>
                <input 
                  type="text" 
                  maxLength={4}
                  required 
                  placeholder="1234" 
                  value={otpInput}
                  onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  style={{ width: '120px', letterSpacing: '4px', textAlign: 'center', fontSize: '20px', fontWeight: '800', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-yellow" style={{ width: '100%', marginTop: '10px' }}>
              Verify OTP
            </button>
          </form>
        )}

        {/* Step 3: Password Update Form */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="password" 
                  required 
                  placeholder="e.g. Aman@123" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
            
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="password" 
                  required 
                  placeholder="Repeat your password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-yellow" style={{ width: '100%', marginTop: '10px' }}>
              Reset Password
            </button>
          </form>
        )}

        {/* Cancel / Return to Login Button */}
        <button 
          onClick={onBackToLogin}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}
        >
          <FiArrowLeft /> Return to Sign In
        </button>
      </div>
    </div>
  );
}
