import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";
import registerImg from "../assets/login.jpg";
import GoogleSignIn from "../components/GoogleSignIn";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    bankAccountNo: "",
    salary: "",
    designation: "",
    photo: null,
  });
  const [errors, setErrors] = useState({});

  const roles = ["Employee", "HR"];

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setIsRoleOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one capital letter");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setErrors({ password: passwordErrors });
      return;
    }
    setErrors({});
    // Handle registration logic here
    console.log("Registration data:", formData);
  };

  return (
    <div className="min-h-screen lg:h-screen flex">
      {/* Left side - Image */}
      <div className="w-1/3 hidden md:block">
        <img
          className="h-full w-full object-cover"
          src={registerImg}
          alt="registerImage"
        />
      </div>

      {/* Right side - Registration Form */}
      <div className="w-full md:w-2/3 flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl text-gray-900 font-medium">
              Create Account
            </h2>
            <p className="text-sm text-gray-500/90 mt-3">
              Join our employee management system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grid Layout for Form Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-500/90 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-500/90 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-500/90 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400" />
                    ) : (
                      <FaEye className="text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="mt-1 text-sm text-red-600">
                    {errors.password.map((error, index) => (
                      <div key={index}>• {error}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-500/90 mb-1">
                  Role
                </label>
                <div className="flex flex-col w-full text-sm relative">
                  <button
                    type="button"
                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                    className="w-full text-left px-3 py-2 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 outline-none hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <span>{formData.role || "Select your role"}</span>
                    <svg
                      className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                        isRoleOpen ? "rotate-0" : "-rotate-90"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#6B7280"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isRoleOpen && (
                    <ul className="absolute top-full left-0 w-full bg-white border border-gray-300/60 rounded-lg shadow-md mt-1 py-2 z-10">
                      {roles.map((role) => (
                        <li
                          key={role}
                          className="px-3 py-2 hover:bg-blue-500 hover:text-white cursor-pointer text-gray-500/80"
                          onClick={() => handleRoleSelect(role)}
                        >
                          {role}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Bank Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-500/90 mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  name="bankAccountNo"
                  value={formData.bankAccountNo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your bank account number"
                  required
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-500/90 mb-1">
                  Expected Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter expected salary"
                  required
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-500/90 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Sales Assistant, Marketer"
                  required
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-500/90 mb-1">
                  Profile Photo
                </label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="mt-8 w-full h-11 rounded-full text-white bg-[#3B82F6] hover:opacity-90 transition-opacity cursor-pointer"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full my-5">
            <div className="w-full h-px bg-gray-300/90"></div>
            <p className="w-full text-center text-sm text-gray-500/90">
              or continue with
            </p>
            <div className="w-full h-px bg-gray-300/90"></div>
          </div>

          {/* Google Login */}
          <GoogleSignIn text="Continue with Google" />

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-500/90 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
