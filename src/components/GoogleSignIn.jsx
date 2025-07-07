import { FcGoogle } from "react-icons/fc";

const GoogleSignIn = ({ text = "Google" }) => {
  return (
    <button
      type="button"
      className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full cursor-pointer transition-colors duration-200 hover:bg-gray-200"
    >
      <FcGoogle size={20} className="mr-1" />
      <span className="font-medium text-gray-600">{text}</span>
    </button>
  );
};

export default GoogleSignIn;
