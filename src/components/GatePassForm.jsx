import React from 'react';
import { useForm } from 'react-hook-form';
import '../index.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const GatePassForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
  try {
    const studentId = localStorage.getItem('studentId');
    const token = localStorage.getItem('studentToken'); // ✅ New

    if (!studentId || !token) {
      alert("You are not logged in. Please login again.");
      return navigate('/'); // Redirect to login
    }

    const fullData = { ...data, studentId };

    const response = await fetch('http://localhost:3000/student/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ✅ JWT sent to backend
      },
      body: JSON.stringify(fullData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Gate pass request submitted successfully!");
      reset();
      navigate('/student-dashboard');
    } else {
      alert(result.error || "Request failed. You may already have a pending request.");
    }
  } catch (error) {
    console.error("Error during form submission:", error);
    alert("Something went wrong. Please try again.");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl animate-fade-in"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Gate Pass Request Form
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              {...register('name', { required: true })}
              placeholder="Your Full Name"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
          </div>

          {/* Student ID removed from form input — it comes from localStorage */}
          
          <div>
            <label className="block font-medium text-gray-700 mb-1">Hostel Block</label>
           <select
  {...register('hostelBlock', { required: true })}
  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
>
  <option value="">Select Hostel Block</option>

  <option value="HB1">HB1</option>
  <option value="HB2">HB2</option>
  <option value="HB3">HB3</option>
  <option value="HB4">HB4</option>
  <option value="HB5">HB5</option>
  <option value="HB6">HB6</option>
  <option value="HB7">HB7</option>
  <option value="HB8">HB8</option>
  <option value="HB9">HB9</option>
  <option value="HB10">HB10</option>
  <option value="GH1">GH1</option>
  <option value="GH2">GH2</option>
</select>

{errors.hostelBlock && (
  <p className="text-red-500 text-sm mt-1">Hostel Block is required</p>
)}

          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Date of Journey</label>
            <input
              type="date"
              {...register('date', { required: true })}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">Date is required</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Time of Leaving</label>
            <input
              type="time"
              {...register('time', { required: true })}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
            {errors.time && <p className="text-red-500 text-sm mt-1">Time is required</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Luggages Carried</label>
            <input
              type="text"
              {...register('luggages', { required: true })}
              placeholder="Backpack, suitcase etc."
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
            {errors.luggages && <p className="text-red-500 text-sm mt-1">Luggages are required</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Destination</label>
            <input
              type="text"
              {...register('destination', { required: true })}
              placeholder="Destination Address"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
            {errors.destination && <p className="text-red-500 text-sm mt-1">Destination is required</p>}
          </div>
        </div>

        <div className="mt-6">
          <label className="block font-medium text-gray-700 mb-1">Purpose of Going</label>
          <textarea
            rows="4"
            {...register('purpose', { required: true })}
            placeholder="Enter reason for going..."
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
          ></textarea>
          {errors.purpose && <p className="text-red-500 text-sm mt-1">Purpose is required</p>}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-md"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default GatePassForm;
