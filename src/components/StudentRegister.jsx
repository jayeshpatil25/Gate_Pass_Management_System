import React from "react";
import { withNavigation, withForm } from "./HOCs";

class StudentRegister extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit(data) {
    const { navigate } = this.props;

    try {
      const response = await fetch("http://localhost:3000/student/register", {
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
    const { form } = this.props;
    const { register, handleSubmit, formState: { errors } } = form;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit(this.onSubmit)}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Student Register</h2>

          <div className="mb-4">
            <label>Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full p-3 border rounded-lg"
            />
            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
          </div>

          <div className="mb-4">
            <label>Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full p-3 border rounded-lg"
            />
            {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
          </div>

          <div className="mb-4">
            <label>Password</label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="w-full p-3 border rounded-lg"
            />
            {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
          </div>

          <div className="mb-4">
            <label>Registration Number</label>
            <input
              type="text"
              {...register("regNo", { required: true })}
              className="w-full p-3 border rounded-lg"
            />
            {errors.regNo && <p className="text-red-500 text-sm">Registration number is required</p>}
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white w-full py-3 rounded-xl mt-4"
          >
            Register
          </button>
        </form>
      </div>
    );
  }
}

export default withNavigation(withForm(StudentRegister));
