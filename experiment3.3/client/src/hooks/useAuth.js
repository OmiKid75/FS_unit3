import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, token, status, error } = useSelector((state) => state.auth);
  return {
    user,
    token,
    role: user?.role || null,
    isAdmin: user?.role === "admin",
    isCreator: user?.role === "creator",
    isViewer: user?.role === "viewer",
    isAuthenticated: Boolean(token),
    status,
    error,
  };
};