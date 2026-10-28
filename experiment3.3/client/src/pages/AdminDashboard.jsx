import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { fetchAllUsers, updateUserRole, fetchSystemAnalytics } from "../redux/adminSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, usersStatus, systemAnalytics } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchSystemAnalytics());
  }, [dispatch]);

  const handleRoleChange = (id, role) => {
    dispatch(updateUserRole({ id, role }));
  };

  return (
    <>
      <Navbar title="Admin Dashboard" />
      <main className="flex-1 px-6 py-6 flex flex-col gap-6">
        <div>
          <h2 className="font-display text-2xl font-semibold">System Overview</h2>
          <p className="text-sm text-slate-400 mt-1">Platform-wide activity across every user.</p>
        </div>

        {systemAnalytics && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="card p-5"><p className="font-display text-3xl font-semibold">{systemAnalytics.totalUsers}</p><p className="text-sm text-slate-400 mt-1">Total Users</p></div>
            <div className="card p-5"><p className="font-display text-3xl font-semibold">{systemAnalytics.totalPosts}</p><p className="text-sm text-slate-400 mt-1">Total Posts</p></div>
            <div className="card p-5"><p className="font-display text-3xl font-semibold">{systemAnalytics.draftCount}</p><p className="text-sm text-slate-400 mt-1">Drafts</p></div>
            <div className="card p-5"><p className="font-display text-3xl font-semibold">{systemAnalytics.scheduledCount}</p><p className="text-sm text-slate-400 mt-1">Scheduled</p></div>
            <div className="card p-5"><p className="font-display text-3xl font-semibold">{systemAnalytics.publishedCount}</p><p className="text-sm text-slate-400 mt-1">Published</p></div>
          </div>
        )}

        <div>
          <h3 className="font-display text-lg font-semibold mb-3">User Management</h3>
          {usersStatus === "loading" && <p className="text-sm text-slate-500">Loading users…</p>}
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-slate-400">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3 text-slate-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="input-field px-2 py-1 text-xs"
                      >
                        <option value="creator">Creator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;