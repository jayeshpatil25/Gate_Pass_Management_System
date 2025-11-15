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

  // listen for logout-event (Goodbye)
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

        // dispatch login-event for dashboard
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      {message && (
        <div className={`fixed left-1/2 -translate-x-1/2 top-8 px-6 py-3 rounded-xl shadow-lg text-white text-lg font-semibold animate-fade-in z-50 ${success ? "bg-green-600" : "bg-red-600"}`}>
          {message}
        </div>
      )}

      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Guard Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="text" placeholder="Guard ID" {...register('guardId', { required: true })} className="w-full px-4 py-2 border rounded-md" />
          {errors.guardId && <p className="text-sm text-red-500">Guard ID is required</p>}
          <input type="password" placeholder="Password" {...register('password', { required: true })} className="w-full px-4 py-2 border rounded-md" />
          {errors.password && <p className="text-sm text-red-500">Password is required</p>}
          <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">Login</button>
        </form>
      </div>
    </div>
  );
}

export default GuardLogin;
