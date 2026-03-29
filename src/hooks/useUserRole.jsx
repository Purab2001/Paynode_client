import { useAuth } from "./useAuth";

const useUserRole = () => {
  const { role, loading: roleLoading } = useAuth();

  return { role: role || "Employee", roleLoading };
};

export default useUserRole;
