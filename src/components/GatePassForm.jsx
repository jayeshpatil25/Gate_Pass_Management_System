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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit(this.onSubmit)}
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
                {...register("name", { required: true })}
                className="w-full p-3 border rounded-xl"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Hostel Block</label>
              <select
                {...register("hostelBlock", { required: true })}
                className="w-full p-3 border rounded-xl"
              >
                <option value="">Select Hostel Block</option>
                {["HB1","HB2","HB3","HB4","HB5","HB6","HB7","HB8","HB9","HB10","GH1","GH2"].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {errors.hostelBlock && <p className="text-red-500 text-sm mt-1">Hostel Block is required</p>}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Date of Journey</label>
              <input
                type="date"
                {...register("date", { required: true })}
                className="w-full p-3 border rounded-xl"
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">Date is required</p>}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Time of Leaving</label>
              <input
                type="time"
                {...register("time", { required: true })}
                className="w-full p-3 border rounded-xl"
              />
              {errors.time && <p className="text-red-500 text-sm mt-1">Time is required</p>}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Luggages Carried</label>
              <input
                type="text"
                {...register("luggages", { required: true })}
                className="w-full p-3 border rounded-xl"
              />
              {errors.luggages && <p className="text-red-500 text-sm mt-1">Luggages are required</p>}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Destination</label>
              <input
                type="text"
                {...register("destination", { required: true })}
                className="w-full p-3 border rounded-xl"
              />
              {errors.destination && <p className="text-red-500 text-sm mt-1">Destination is required</p>}
            </div>
          </div>

          <div className="mt-6">
            <label className="block font-medium text-gray-700 mb-1">Purpose of Going</label>
            <textarea
              rows="4"
              {...register("purpose", { required: true })}
              className="w-full p-3 border rounded-xl"
            />
            {errors.purpose && <p className="text-red-500 text-sm mt-1">Purpose is required</p>}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-full"
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
