import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../redux/authSlice";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-accent to-accent-soft flex items-center justify-center font-display font-bold text-xl mb-4">S</div>
          <h1 className="font-display text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-slate-400 mt-1">Start managing every platform in one place</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
          {error && <div className="text-sm px-3 py-2 rounded-lg border border-danger/40 bg-danger/10 text-danger">{error}</div>}
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Name</label>
            <input required className="input-field w-full px-3 py-2.5 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email</label>
            <input type="email" required className="input-field w-full px-3 py-2.5 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Password</label>
            <input type="password" required minLength={6} className="input-field w-full px-3 py-2.5 text-sm" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" disabled={status === "loading"} className="btn-primary rounded-lg py-2.5 text-sm mt-2">
            {status === "loading" ? "Creating account…" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account? <Link to="/login" className="text-accent-soft hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
