import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../index.css'; // Ensure you have Tailwind CSS set up in your project
import '../App.css'; // Ensure you have Tailwind CSS set up in your project
function GuardRegister() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/guards/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Registration successful');
        navigate('/Guard-login'); // Redirect to login page
      } else {
        alert(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Guard Registration</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Guard ID"
              {...register('guardId', { required: true })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.guardId && <p className="text-sm text-red-500 mt-1">Guard ID is required</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: true })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">Password is required</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <a href="/Guard-login" className="text-green-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default GuardRegister;
