import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import '../App.css';

function GuardLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleLogoutEvent = (e) => {
      const name = e.detail.username;
      setSuccess(true);
      setMessage(`Goodbye ${name}!`);
      setTimeout(() => setMessage(""), 2000);
    };
    window.addEventListener("logout-event", handleLogoutEvent);
    return () => window.removeEventListener("logout-event", handleLogoutEvent);
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/guards/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        const uname = data.guardId;
        localStorage.setItem('guardId', uname);
        localStorage.setItem('guardToken', result.token);
        localStorage.setItem('username', uname);

        window.dispatchEvent(new CustomEvent('login-event', { detail: { username: uname } }));

        setSuccess(true);
        setMessage(`Hello ${uname}!`);
        setTimeout(() => {
          setMessage("");
          navigate('/guard-dashboard');
        }, 1200);
      } else {
        setSuccess(false);
        setMessage(result.error || 'Login failed');
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (err) {
      console.error(err);
      setSuccess(false);
      setMessage("Something went wrong");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 z-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      {message && (
        <div className={`fixed left-1/2 -translate-x-1/2 top-8 px-8 py-4 rounded-2xl shadow-2xl text-white text-lg font-semibold animate-fade-in z-50 ${success ? "bg-gradient-to-r from-green-600 to-green-700 border border-green-400" : "bg-gradient-to-r from-red-500 to-red-600 border border-red-400"}`}>
          {message}
        </div>
      )}

      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-green-100">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 rounded-2xl mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-green-700 mb-2">Guard Login</h2>
          <p className="text-gray-600">Access your guard dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Guard ID</label>
            <input 
              type="text" 
              placeholder="Enter Guard ID" 
              {...register('guardId', { required: true })} 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
            />
            {errors.guardId && <p className="text-sm text-red-500 mt-1">Guard ID is required</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              placeholder="Enter Password" 
              {...register('password', { required: true })} 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">Password is required</p>}
          </div>
          
          <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-xl hover:from-green-700 hover:to-green-800 font-semibold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New User?{" "}
          <span className="text-green-600 cursor-pointer hover:underline font-semibold" onClick={() => navigate('/register-as-Guard')}>
            Register Now
          </span>
        </p>
      </div>
    </div>
  );
}

export default GuardLogin;