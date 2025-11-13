import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import '../App.css';

function StudentLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Login successful:", result);

        // ✅ Save both ID and token
        localStorage.setItem('studentId', result.studentId);
        localStorage.setItem('studentToken', result.token);  // <-- Token saved here

        navigate('/student-dashboard'); 
      } else {
        alert(result.error || 'Login failed');
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Student Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Student ID"
              {...register('studentId', { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.studentId && (
              <p className="text-sm text-red-500 mt-1">Student ID is required</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">Password is required</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center space-y-2">
          <p className="text-sm">
            New User?{' '}
            <span
              onClick={() => navigate('/register-as-Student')}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Register Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
