import React from "react";
import { withNavigation, withForm } from "./HOCs";
import Footer from './Footer';

class StudentRegister extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit(data) {
    const { navigate } = this.props;

    try {
      const response = await fetch("https://gate-pass-management-system-95o7.onrender.com/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Student registered successfully!");
        navigate("/student-login");
      } else {
        alert(result.error || "Registration failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again later.");
    }
  }

  render() {
    const { form, navigate } = this.props;
    const { register, handleSubmit, formState: { errors } } = form;

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 px-4">

        {/* MAIN CENTERED CONTENT */}
        <div className="flex-grow flex items-center justify-center">
          <form
            onSubmit={handleSubmit(this.onSubmit)}
            className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-blue-100"
          >
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-blue-100 rounded-2xl mb-4">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-blue-700 mb-2">Student Registration</h2>
              <p className="text-gray-600">Create your student account</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Student ID
                </label>
                <input
                  type="text"
                  {...register("studentId", { required: true })}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Enter student ID"
                />
                {errors.studentId && <p className="text-red-500 text-sm mt-1">Student ID is required</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", { required: true })}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Create a strong password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">Password is required</p>}
              </div>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white w-full py-3.5 rounded-xl mt-8 hover:from-blue-700 hover:to-blue-800 font-semibold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Register
            </button>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline font-semibold"
                onClick={() => navigate('/student-login')}
              >
                Login here
              </span>
            </p>
          </form>
        </div>

        {/* FOOTER AT BOTTOM */}
        <Footer />
      </div>
    );
  }
}

export default withNavigation(withForm(StudentRegister));
