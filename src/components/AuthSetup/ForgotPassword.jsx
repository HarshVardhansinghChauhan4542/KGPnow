import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await axios.post('http://localhost:3001/api/auth/forgot-password', { email });
      setMessage('Password reset OTP sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending password reset OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Verify OTP with the backend
      const response = await axios.post('http://localhost:3001/api/auth/verify-reset-otp', {
        email,
        otp
      });
      
      // If OTP is valid, proceed to password reset step
      if (response.data.success) {
        setMessage('OTP verified successfully. You can now set your new password.');
        setStep(3);
      } else {
        setError(response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error verifying OTP';
      setError(errorMessage);
      
      // If OTP is expired, allow user to request a new one
      if (errorMessage.includes('expired') || errorMessage.includes('No OTP found')) {
        setStep(1);
        setEmail(email); // Keep the email filled in
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3001/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      
      setMessage('Password reset successful! Redirecting to login...');
      
      // Clear the form after successful password reset
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Password reset successful! You can now log in with your new password.' 
          } 
        });
      }, 2000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error resetting password';
      setError(errorMessage);
      
      // If OTP is expired or invalid, go back to OTP step
      if (errorMessage.includes('expired') || errorMessage.includes('Invalid OTP')) {
        setStep(2);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <img
          src="https://images.unsplash.com/photo-1538943186303-104afadcbb16?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNoZXJyeSUyMGJsb3Nzb218ZW58MHx8MHx8fDA%3D"
          alt="Purple flower artwork"
          className="art-image"
        />
      </div>

      <div className="right-panel">
        <form 
          className="login-form" 
          onSubmit={step === 1 ? handleEmailSubmit : step === 2 ? handleOtpSubmit : handleResetPassword}
        >
          <h2>Reset Password</h2>
          
          {step === 1 && (
            <>
              <p>Enter your email address and we'll send you an OTP to reset your password.</p>
              
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </>
          )}

          {step === 2 && (
            <>
              <p>Enter the 6-digit OTP sent to {email}</p>
              
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                pattern="\d{6}"
              />
              
              <p className="resend-otp">
                Didn't receive OTP?{' '}
                <button 
                  type="button" 
                  onClick={handleEmailSubmit}
                  disabled={isLoading}
                  className="resend-btn"
                >
                  Resend OTP
                </button>
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <p>Create a new password for {email}</p>
              
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                minLength={6}
              />
              
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                minLength={6}
              />
            </>
          )}

          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 
             step === 1 ? 'Send OTP' : 
             step === 2 ? 'Verify OTP' : 'Reset Password'}
          </button>

          <p className="back-to-login">
            Remember your password?{' '}
            <a href="/login">Back to Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
