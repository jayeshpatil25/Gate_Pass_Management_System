import React from "react";
import { withNavigation, withForm } from "./HOCs";

class GuardRegister extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit(data) {
    const { navigate } = this.props;

    try {
      const response = await fetch("http://localhost:3000/guard/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Guard registered successfully!");
        navigate("/guard-login");
      } else {
        alert(result.error || "Registration failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again later.");
    }
  }

  render() {
    const { form } = this.props;
    const { register, handleSubmit, formState: { errors } } = form;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4">
        <form
          onSubmit={handleSubmit(this.onSubmit)}
          className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-green-100"
        >
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-green-100 rounded-2xl mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-green-700 mb-2">Guard Registration</h2>
            <p className="text-gray-600">Create your guard account</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Name</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
              <input
                type="password"
                {...register("password", { required: true })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Create a strong password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">Password is required</p>}
            </div>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-green-700 text-white w-full py-3.5 rounded-xl mt-8 hover:from-green-700 hover:to-green-800 font-semibold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Register
          </button>
        </form>
      </div>
    );
  }
}

export default withNavigation(withForm(GuardRegister));