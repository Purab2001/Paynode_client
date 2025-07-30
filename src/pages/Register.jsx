import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import registerImg from "../assets/login.jpg";
import GoogleSignIn from "../components/GoogleSignIn";
import { useAuth } from "../hooks/useAuth";
import { uploadImageToImgBB } from "../utils/uploadImage";
import toast from "react-hot-toast";
import { showSuccess, showError } from "../ui/CustomSwal";
import logo from "../assets/logo.png";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { createUser, updateUserProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      bankAccountNo: "",
      salary: "",
      designation: "",
      photo: null,
    },
    mode: "onBlur",
  });

  const watchedRole = watch("role");
  const roles = ["Employee", "HR"];

  const handleRoleSelect = (role) => {
    setValue("role", role);
    setIsRoleOpen(false);
    trigger("role");
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
    return errors.length === 0 || errors.join(", ");
  };

  const onSubmit = async (data) => {
    if (!data.photo || data.photo.length === 0) {
      toast.error("Please upload a profile photo");
      return;
    }

    setIsLoading(true);
    try {
      // Upload image to ImgBB
      const photoURL = await uploadImageToImgBB(data.photo[0]);

      // Create user with Firebase Auth
      const result = await createUser(data.email, data.password);

      // Update user profile with name and photo
      await updateUserProfile({
        displayName: data.name,
        photoURL: photoURL,
      });

      // Prepare user data for database
      const userData = {
        uid: result.user.uid,
        name: data.name,
        email: data.email,
        role: data.role,
        bank_account_no: data.bankAccountNo,
        salary: parseFloat(data.salary),
        designation: data.designation,
        photo: photoURL,
        isVerified: false,
        isFired: false,
        createdAt: new Date().toISOString(),
      };

      // Debug logs for API URL and payload
      console.log("API URL:", import.meta.env.VITE_API_URL);
      console.log("User payload:", userData);

      // Save user to database
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to save user data");
      }

      await showSuccess(
        "Registration Successful!",
        "Your account has been created successfully. Welcome to PayNode!"
      );
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "An error occurred during registration";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please use a different email.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please choose a stronger password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address. Please enter a valid email.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      await showError("Registration Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show toast for field validation errors
  const showFieldErrorToasts = () => {
    Object.values(errors).forEach((err) => {
      if (err && err.message) toast.error(err.message);
    });
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

          {/* Logo at the top, links to home */}
          <Link to="/" className="mb-3 flex items-center justify-center gap-2">
            <img src={logo} alt="logo" className="h-8" />
            <span className="text-xl font-bold">PayNode</span>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-4xl text-gray-900 font-medium">
              Create Account
            </h2>
            <p className="text-sm text-gray-500/90 mt-3">
              Join our employee management system
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit, showFieldErrorToasts)}
            className="space-y-4"
          >
            {/* Grid Layout for Form Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-500/90 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-500/90 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
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
                    {...register("password", {
                      required: "Password is required",
                      validate: validatePassword,
                    })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
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
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-500/90 mb-1">
                  Role
                </label>
                <div className="flex flex-col w-full text-sm relative">
                  <input
                    type="hidden"
                    {...register("role", { required: "Please select a role" })}
                  />
                  <button
                    type="button"
                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                    className="w-full text-left px-3 py-2 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 outline-none hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <span>{watchedRole || "Select your role"}</span>
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
                  {...register("bankAccountNo", {
                    required: "Bank account number is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message:
                        "Bank account number should contain only numbers",
                    },
                    minLength: {
                      value: 8,
                      message: "Bank account number must be at least 8 digits",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your bank account number"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-500/90 mb-1">
                  Expected Salary
                </label>
                <input
                  type="number"
                  {...register("salary", {
                    required: "Expected salary is required",
                    min: {
                      value: 1000,
                      message: "Salary must be at least 1000",
                    },
                    max: {
                      value: 1000000,
                      message: "Salary cannot exceed 1,000,000",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter expected salary"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-500/90 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  {...register("designation", {
                    required: "Designation is required",
                    minLength: {
                      value: 2,
                      message: "Designation must be at least 2 characters",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Sales Assistant, Marketer"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-500/90 mb-1">
                  Profile Photo
                </label>
                <input
                  type="file"
                  {...register("photo", {
                    required: "Profile photo is required",
                    validate: {
                      fileType: (files) => {
                        if (!files[0]) return true;
                        const allowedTypes = [
                          "image/jpeg",
                          "image/jpg",
                          "image/png",
                          "image/gif",
                        ];
                        return (
                          allowedTypes.includes(files[0].type) ||
                          "Only image files are allowed"
                        );
                      },
                      fileSize: (files) => {
                        if (!files[0]) return true;
                        return (
                          files[0].size <= 5000000 ||
                          "File size must be less than 5MB"
                        );
                      },
                    },
                  })}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300/60 rounded-lg bg-transparent text-gray-500/80 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full h-11 rounded-full text-white bg-blue-500 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full my-3">
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
