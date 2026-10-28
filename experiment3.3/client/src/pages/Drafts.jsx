import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import FilterBar from "../components/FilterBar";
import { fetchDrafts, deleteDraft } from "../redux/draftsSlice";

const Drafts = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({});
  const { items: drafts, status } = useSelector((state) => state.drafts);

  useEffect(() => {
    dispatch(fetchDrafts());
  }, [dispatch]);

  // Filtering is derived state — only recompute when the draft list or the
  // filter object actually changes, rather than on every render.
  const filteredDrafts = useMemo(() => {
    const { platform, keyword, dateFrom, dateTo } = filters;
    return drafts.filter((post) => {
      if (platform && !post.platforms.includes(platform)) return false;
      if (keyword && !post.content.toLowerCase().includes(keyword.toLowerCase())) return false;
      if (dateFrom && post.scheduledDate && new Date(post.scheduledDate) < new Date(dateFrom)) return false;
      if (dateTo && post.scheduledDate && new Date(post.scheduledDate) > new Date(dateTo)) return false;
      return true;
    });
  }, [drafts, filters]);

  const handleDelete = useCallback(
    (post) => {
      if (confirm("Delete this draft?")) dispatch(deleteDraft(post._id));
    },
    [dispatch]
  );

  return (
    <>
      <Navbar title="Drafts" />
      <main className="flex-1 px-6 py-6">
        <FilterBar filters={filters} setFilters={setFilters} />

        {status === "loading" && <p className="text-sm text-slate-500">Loading…</p>}
        {status === "succeeded" && filteredDrafts.length === 0 && (
          <div className="card p-8 text-center text-sm text-slate-500">No drafts match your filters.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrafts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Drafts;
