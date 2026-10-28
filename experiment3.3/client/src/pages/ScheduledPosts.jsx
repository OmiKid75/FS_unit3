import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import FilterBar from "../components/FilterBar";
import { fetchPosts, deletePost } from "../redux/postsSlice";
import { selectScheduledPosts } from "../redux/selectors";

const ScheduledPosts = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({});
  const scheduled = useSelector(selectScheduledPosts);
  const { status } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const { platform, keyword, dateFrom, dateTo } = filters;
    return scheduled
      .filter((post) => {
        if (platform && !post.platforms.includes(platform)) return false;
        if (keyword && !post.content.toLowerCase().includes(keyword.toLowerCase())) return false;
        if (dateFrom && post.scheduledDate && new Date(post.scheduledDate) < new Date(dateFrom)) return false;
        if (dateTo && post.scheduledDate && new Date(post.scheduledDate) > new Date(dateTo)) return false;
        return true;
      })
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  }, [scheduled, filters]);

  const handleDelete = useCallback(
    (post) => {
      if (confirm("Delete this scheduled post?")) dispatch(deletePost(post._id));
    },
    [dispatch]
  );

  return (
    <>
      <Navbar title="Scheduled Posts" />
      <main className="flex-1 px-6 py-6">
        <FilterBar filters={filters} setFilters={setFilters} />

        {status === "loading" && <p className="text-sm text-slate-500">Loading…</p>}
        {status === "succeeded" && filtered.length === 0 && (
          <div className="card p-8 text-center text-sm text-slate-500">Nothing scheduled yet.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      </main>
    </>
  );
};

export default ScheduledPosts;
