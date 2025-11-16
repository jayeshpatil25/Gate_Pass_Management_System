import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import '../App.css';
import Footer from './Footer';

function StudentLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();

      if (response.ok) {
        const uname = result.studentId;
        localStorage.setItem('studentId', uname);
        localStorage.setItem('studentToken', result.token);
        localStorage.setItem('username', uname);

        window.dispatchEvent(new CustomEvent('login-event', { detail: { username: uname } }));

        setSuccess(true);
        setMessage(`Hello ${uname}!`);

        setTimeout(() => {
          setMessage("");
          navigate('/student-dashboard');
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 relative px-4">
      
      {/* MAIN CONTENT CENTERED */}
      <div className="flex-grow flex items-center justify-center">

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="fixed top-6 left-6 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 z-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {message && (
          <div className={`fixed left-1/2 -translate-x-1/2 top-8 px-8 py-4 rounded-2xl shadow-2xl text-white text-lg font-semibold animate-fade-in z-50
            ${success ? "bg-gradient-to-r from-blue-600 to-blue-700 border border-blue-400" : "bg-gradient-to-r from-red-500 to-red-600 border border-red-400"}`}>
            {message}
          </div>
        )}

        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-blue-100">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-blue-100 rounded-2xl mb-4">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-blue-700 mb-2">Student Login</h2>
            <p className="text-gray-600">Access your student dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Student ID</label>
              <input 
                type="text" 
                placeholder="Enter Student ID" 
                {...register('studentId', { required: true })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.studentId && <p className="text-sm text-red-500 mt-1">Student ID is required</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
              <input 
                type="password" 
                placeholder="Enter Password" 
                {...register('password', { required: true })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">Password is required</p>}
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            New User?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline font-semibold" onClick={() => navigate('/register-as-Student')}>
              Register Now
            </span>
          </p>
        </div>

      </div>

      {/* FOOTER AT BOTTOM ALWAYS */}
      <Footer />
    </div>
  );
}

export default StudentLogin;
