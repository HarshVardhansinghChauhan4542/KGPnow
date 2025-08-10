import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Base styles
import './OtpVerification.css'; // OTP specific styles

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Get email from location state or redirect back to register
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/register');
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0 && isResendDisabled) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isResendDisabled]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    
    // Auto focus to next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);
    
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setIsVerifying(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/auth/verify-otp', {
        email,
        otp: otpCode
      });
      
      if (res.data.success) {
        alert(res.data.message);
        navigate('/login');
      } else {
        setError('OTP verification failed.');
      }      
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setError('');
      await axios.post('http://localhost:3001/api/auth/resend-otp', { email });
      setCountdown(60);
      setIsResendDisabled(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <div className="left-panel">
        <img
          src="https://images.unsplash.com/photo-1538943186303-104afadcbb16?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNoZXJyeSUyMGJsb3Nzb218ZW58MHx8MHx8fDA%3D"
          alt="Purple flower artwork"
          className="art-image"
        />
      </div>

      <div className="right-panel">
        <form className="register-form" onSubmit={handleVerifyOtp}>
          <h2>Verify Your Email</h2>
          <p className="otp-instruction">
            We've sent a 6-digit verification code to <strong>{email}</strong>
          </p>
          
          <div className="otp-container">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="otp-input"
                value={data}
                onChange={(e) => handleOtpChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={isVerifying}>
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </button>

          <div className="resend-otp">
            <p>
              Didn't receive the code?{' '}
              <button 
                type="button" 
                onClick={handleResendOtp} 
                disabled={isResendDisabled}
                className="resend-button"
              >
                {isResendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
              </button>
            </p>
          </div>

          <p className="login-text">
            <a href="/login">Back to Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
