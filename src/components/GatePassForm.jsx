import React from "react";
import '../index.css';
import '../App.css';
import { withNavigation, withForm } from "./HOCs";

class GatePassForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit(data) {
    const { navigate, form } = this.props;

    try {
      const studentId = localStorage.getItem("studentId");
      const token = localStorage.getItem("studentToken");

      if (!studentId || !token) {
        alert("You are not logged in. Please login again.");
        return navigate("/");
      }

      const fullData = { ...data, studentId };

      const response = await fetch("http://localhost:3000/student/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fullData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Gate pass request submitted successfully!");
        form.reset();
        navigate("/student-dashboard");
      } else {
        alert(result.error || "Request failed. You may already have a pending request.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  }

  render() {
    const { form } = this.props;
    const { register, handleSubmit, formState: { errors } } = form;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit(this.onSubmit)}
          className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-4xl border border-blue-100"
        >
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-100 rounded-2xl mb-4">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-blue-700 mb-2">
              Gate Pass Request
            </h2>
            <p className="text-gray-600">Fill in the details below to submit your request</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Name</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Hostel Block</label>
              <select
                {...register("hostelBlock", { required: true })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="">Select Hostel Block</option>
                {["HB1","HB2","HB3","HB4","HB5","HB6","HB7","HB8","HB9","HB10","GH1","GH2"].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {errors.hostelBlock && <p className="text-red-500 text-sm mt-1">Hostel Block is required</p>}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Date of Journey</label>
              <input
                type="date"
                {...register("date", { required: true })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">Date is required</p>}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Time of Leaving</label>
              <input
                type="time"
                {...register("time", { required: true })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.time && <p className="text-red-500 text-sm mt-1">Time is required</p>}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Luggages Carried</label>
              <input
                type="text"
                {...register("luggages", { required: true })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="e.g., 1 backpack, 1 suitcase"
              />
              {errors.luggages && <p className="text-red-500 text-sm mt-1">Luggages are required</p>}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Destination</label>
              <input
                type="text"
                {...register("destination", { required: true })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter destination"
              />
              {errors.destination && <p className="text-red-500 text-sm mt-1">Destination is required</p>}
            </div>
          </div>

          <div className="mt-6">
            <label className="block font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Purpose of Going</label>
            <textarea
              rows="4"
              {...register("purpose", { required: true })}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
              placeholder="Describe the purpose of your visit..."
            />
            {errors.purpose && <p className="text-red-500 text-sm mt-1">Purpose is required</p>}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg transform hover:-translate-y-0.5"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default withNavigation(withForm(GatePassForm));