// import React from 'react';
// import './Login.css';

// const Login = () => {
//   return (
//     <div className="login-container">
//       <div className="left-panel">
//         <img
//           src="https://images.unsplash.com/photo-1538943186303-104afadcbb16?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNoZXJyeSUyMGJsb3Nzb218ZW58MHx8MHx8fDA%3D"
//           alt="Purple flower artwork"
//           className="art-image"
//         />
//       </div>

//       <div className="right-panel">
//         <form className="login-form">
//           <h2>Login</h2>

//           <label htmlFor="email">Email</label>
//           <input type="email" id="email" placeholder="you@example.com" required />

//           <label htmlFor="password">Password</label>
//           <input type="password" id="password" placeholder="••••••••" required />

//           <button type="submit">Login</button>

//           <p className="register-text">
//             Not registered? <a href="/register">Register</a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', formData);
      console.log('Login success:', res.data);

      // Save token in localStorage (optional)
      localStorage.setItem('userToken', res.data.token);

      navigate('/'); // Navigate to home on success
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Login</button>

          <p className="forgot-password">
            <a href="/forgot-password">Forgot Password?</a>
          </p>

          <p className="register-text">
            Not registered? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

