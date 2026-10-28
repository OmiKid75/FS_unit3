import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useAuth } from "../hooks/useAuth";

const Navbar = ({ title }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-line bg-surface/40 backdrop-blur">
      <h1 className="font-display text-xl font-semibold tracking-tight">{title}</h1>

      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/profile")} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <div className="w-8 h-8 rounded-full bg-accent-dim flex items-center justify-center font-display text-xs font-semibold">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="hidden sm:inline">{user?.name}</span>
        </button>
        <button onClick={handleLogout} className="btn-ghost text-sm px-3 py-1.5 rounded-lg">Log out</button>
      </div>
    </header>
  );
};

export default Navbar;
