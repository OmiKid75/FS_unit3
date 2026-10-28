import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Wraps a route element to restrict it to specific roles.
// Usage: <RequireRole roles={["admin"]}><AdminDashboard /></RequireRole>
const RequireRole = ({ roles, children }) => {
  const { role } = useAuth();
  if (!roles.includes(role)) return <Navigate to="/403" replace />;
  return children;
};

export default RequireRole;