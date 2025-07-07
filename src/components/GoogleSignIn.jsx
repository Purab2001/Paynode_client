import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router";
import toast from "react-hot-toast";
import { showSuccess, showError } from "../ui/CustomSwal";

const GoogleSignIn = ({ text = "Google" }) => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Prepare user data for social login users
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: "Employee", // Default role for social login
        bank_account_no: "1234567890", // Mock data as mentioned in requirements
        salary: 50000, // Mock data
        designation: "Software Developer", // Mock data
        photo: user.photoURL,
        isVerified: false,
        isFired: false,
        createdAt: new Date().toISOString(),
      };

      // Check if user already exists, if not create new user
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${user.email}`
        );

        if (!response.ok && response.status === 404) {
          // User doesn't exist, create new user
          const createResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/users`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );

          if (!createResponse.ok) {
            throw new Error("Failed to save user data");
          }
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
        // Continue with login even if DB operation fails
      }

      // Show success message based on current page
      if (location.pathname === "/register") {
        await showSuccess(
          "Registration Successful!",
          `Welcome ${
            user.displayName || "User"
          }! Your account has been created.`
        );
      } else {
        toast.success(`Welcome back, ${user.displayName || "User"}!`, {
          duration: 3000,
          position: "top-center",
        });
      }

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google Sign-in error:", error);

      let errorMessage = "Google sign-in failed. Please try again.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in was cancelled.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection.";
      }

      if (location.pathname === "/register") {
        showError("Registration Failed", errorMessage);
      } else {
        toast.error(errorMessage, {
          duration: 4000,
          position: "top-center",
        });
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full bg-gray-500/10 flex items-center justify-center h-11 rounded-full cursor-pointer transition-colors duration-200 hover:bg-gray-200"
    >
      <FcGoogle size={20} className="mr-1" />
      <span className="font-medium text-gray-600">{text}</span>
    </button>
  );
};

export default GoogleSignIn;
