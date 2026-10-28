import { useState } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import { updateUserProfile } from "../redux/authSlice";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "" });
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateUserProfile(form));
    if (updateUserProfile.fulfilled.match(result)) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <>
      <Navbar title="Profile" />
      <main className="flex-1 px-6 py-6 max-w-lg">
        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-full bg-accent-dim flex items-center justify-center font-display text-xl font-semibold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-xs text-slate-500">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Name</label>
            <input className="input-field w-full px-3 py-2.5 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Bio</label>
            <textarea rows={3} maxLength={300} className="input-field w-full px-3 py-2.5 text-sm resize-none" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>

          <button type="submit" className="btn-primary rounded-lg py-2.5 text-sm mt-2">{saved ? "Saved ✓" : "Save Changes"}</button>
        </form>
      </main>
    </>
  );
};

export default Profile;
