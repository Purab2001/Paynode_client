import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const authInfo = useContext(AuthContext);

  if (!authInfo) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return authInfo;
};
