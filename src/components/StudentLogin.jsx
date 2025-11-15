import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import '../App.css';

function StudentLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // ⭐ LISTEN FOR LOGOUT EVENT → Show Goodbye message
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

  // ⭐ LOGIN → Show Hello message
  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('studentId', result.studentId);
        localStorage.setItem('studentToken', result.token);
        localStorage.setItem('username', result.studentId);

        setSuccess(true);
        setMessage(`Hello ${result.studentId}!`);

        setTimeout(() => {
          navigate('/student-dashboard');
        }, 1800);
      } else {
        setSuccess(false);
        setMessage(result.error || 'Login failed');
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (error) {
      setSuccess(false);
      setMessage("Something went wrong");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">

      {message && (
        <div className={`fixed left-1/2 -translate-x-1/2 top-8 px-6 py-3 rounded-xl shadow-lg text-white text-lg font-semibold animate-fade-in z-50
        ${success ? "bg-green-600" : "bg-red-600"}`}>
          {message}
        </div>
      )}

      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Student Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Student ID"
            {...register('studentId', { required: true })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.studentId && <p className="text-sm text-red-500">Student ID is required</p>}

          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: true })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.password && <p className="text-sm text-red-500">Password is required</p>}

          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          New User?{" "}
          <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/register-as-Student')}>
            Register Now
          </span>
        </p>
      </div>
    </div>
  );
}

export default StudentLogin;
