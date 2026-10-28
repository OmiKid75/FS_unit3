import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { fetchPosts } from "../redux/postsSlice";
import { fetchDrafts } from "../redux/draftsSlice";
import {
  selectAnalyticsSummary,
  selectPlatformChartData,
  selectStatusChartData,
  selectMonthlyTrendData,
} from "../redux/selectors";
import { PlatformPieChart, StatusBarChart, TrendLineChart } from "../components/AnalyticsChart";

// Analytics is now derived entirely from posts/drafts already in the Redux
// store via memoized selectors (see redux/selectors.js), instead of relying
// on a separate GET /api/analytics call. That backend round trip was the
// point of failure that made this page appear broken/empty.
const Analytics = () => {
  const dispatch = useDispatch();
  const summary = useSelector(selectAnalyticsSummary);
  const platformData = useSelector(selectPlatformChartData);
  const statusData = useSelector(selectStatusChartData);
  const trendData = useSelector(selectMonthlyTrendData);
  const { status } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchDrafts());
  }, [dispatch]);

  return (
    <>
      <Navbar title="Analytics" />
      <main className="flex-1 px-6 py-6 flex flex-col gap-6">
        {status === "loading" && <p className="text-sm text-slate-500">Loading analytics…</p>}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5">
            <p className="font-display text-3xl font-semibold">{summary.totalPosts}</p>
            <p className="text-sm text-slate-400 mt-1">Total Posts</p>
          </div>
          <div className="card p-5">
            <p className="font-display text-3xl font-semibold">{summary.draftCount}</p>
            <p className="text-sm text-slate-400 mt-1">Draft Count</p>
          </div>
          <div className="card p-5">
            <p className="font-display text-3xl font-semibold">{summary.publishedCount}</p>
            <p className="text-sm text-slate-400 mt-1">Published Count</p>
          </div>
          <div className="card p-5">
            <p className="font-display text-3xl font-semibold">{summary.scheduledCount}</p>
            <p className="text-sm text-slate-400 mt-1">Scheduled Count</p>
          </div>
        </div>

        <div className="card p-5">
          <p className="text-sm text-slate-400">Most Active Platform</p>
          <p className="font-display text-2xl font-semibold capitalize mt-1">{summary.mostActivePlatform || "—"}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card p-5">
            <h3 className="font-display text-base font-semibold mb-2">Posts per Platform</h3>
            {summary.totalPosts === 0 ? (
              <p className="text-sm text-slate-500">No posts yet — create one to see this chart.</p>
            ) : (
              <PlatformPieChart data={platformData} />
            )}
          </div>
          <div className="card p-5">
            <h3 className="font-display text-base font-semibold mb-2">Posts by Status</h3>
            {summary.totalPosts === 0 ? (
              <p className="text-sm text-slate-500">No posts yet — create one to see this chart.</p>
            ) : (
              <StatusBarChart data={statusData} />
            )}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-display text-base font-semibold mb-2">Monthly Trend</h3>
          {trendData.length === 0 ? (
            <p className="text-sm text-slate-500">Not enough post history yet to show a trend.</p>
          ) : (
            <TrendLineChart data={trendData} />
          )}
        </div>
      </main>
    </>
  );
};

export default Analytics;
