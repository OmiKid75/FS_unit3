import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import PostCard from "../components/PostCard";
import { fetchPosts } from "../redux/postsSlice";
import { fetchDrafts } from "../redux/draftsSlice";
import { selectDashboardStats, selectRecentPosts } from "../redux/selectors";
import { useAuth } from "../hooks/useAuth";
import { dispatchDeleteForPost } from "../utils/postActions";

const QUICK_ACTIONS = [
  { label: "New Post", to: "/create", icon: "✎" },
  { label: "View Calendar", to: "/calendar", icon: "▦" },
  { label: "Check Analytics", to: "/analytics", icon: "▲" },
  { label: "Manage Drafts", to: "/drafts", icon: "▢" },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const stats = useSelector(selectDashboardStats);
  const recentPosts = useSelector(selectRecentPosts);
  const { status } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchDrafts());
  }, [dispatch]);

  const handleDelete = useCallback(
    (post) => {
      if (confirm("Delete this post?")) dispatchDeleteForPost(dispatch, post);
    },
    [dispatch]
  );

  return (
    <>
      <Navbar title="Dashboard" />
      <main className="flex-1 px-6 py-6 flex flex-col gap-6">
        <div>
          <h2 className="font-display text-2xl font-semibold">Welcome back, {user?.name?.split(" ")[0]}</h2>
          <p className="text-sm text-slate-400 mt-1">Here's what's happening across your platforms.</p>
        </div>

        <DashboardCards stats={stats} />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <button key={action.to} onClick={() => navigate(action.to)} className="card p-4 text-left hover:border-accent/40 transition-colors">
              <span className="text-xl">{action.icon}</span>
              <p className="text-sm font-medium mt-2">{action.label}</p>
            </button>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-semibold">Recent Posts</h3>
            <button onClick={() => navigate("/drafts")} className="text-sm text-accent-soft hover:underline">View all</button>
          </div>

          {status === "loading" && <p className="text-sm text-slate-500">Loading…</p>}
          {status === "succeeded" && recentPosts.length === 0 && (
            <div className="card p-8 text-center text-sm text-slate-500">No posts yet. Create your first post to get started.</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPosts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handleDelete} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold mb-3">Platform Statistics</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(stats.platformCounts).map(([platform, count]) => (
              <div key={platform} className="card p-4 text-center">
                <p className="text-2xl font-display font-semibold">{count}</p>
                <p className="text-xs text-slate-400 capitalize mt-1">{platform}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
