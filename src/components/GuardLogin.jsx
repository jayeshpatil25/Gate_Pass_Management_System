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

  // Show "Goodbye" if set
  useEffect(() => {
    const msg = localStorage.getItem("logoutMessage");
    if (msg) {
      setSuccess(true);
      setMessage(msg);
      localStorage.removeItem("logoutMessage");
      setTimeout(() => setMessage(""), 2000);
    }
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
        // Save token and id + username
        localStorage.setItem('guardToken', result.token);
        localStorage.setItem('guardId', data.guardId);
        localStorage.setItem('username', data.guardId);

        setSuccess(true);
        setMessage(`Hello ${data.guardId}!`);

        setTimeout(() => {
          setMessage("");
          navigate('/guard-dashboard');
        }, 1800);
      } else {
        setSuccess(false);
        setMessage(result.error || 'Login failed');
        setTimeout(() => setMessage(""), 2200);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setSuccess(false);
      setMessage("Something went wrong. Try again.");
      setTimeout(() => setMessage(""), 2200);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      {message && (
        <div
          className={`fixed left-1/2 transform -translate-x-1/2 top-8 px-6 py-3 rounded-xl shadow-lg text-white text-lg font-semibold animate-fade-in z-50
            ${success ? "bg-green-600" : "bg-red-600"}`}
        >
          {message}
        </div>
      )}

      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Guard Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Guard ID"
              {...register('guardId', { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            {errors.guardId && (
              <p className="text-sm text-red-500 mt-1">Guard ID is required</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">Password is required</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center space-y-2">
          <p className="text-sm">
            New User?{' '}
            <span
              onClick={() => navigate('/register-as-guard')}
              className="text-green-600 hover:underline font-medium cursor-pointer"
            >
              Register Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default GuardLogin;
